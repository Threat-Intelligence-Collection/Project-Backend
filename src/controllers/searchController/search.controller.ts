import {
  ApiResponse,
  searchIPresponse,
  searchDomainResponse,
} from "../../../types/ApiResponse/ApiResponse";
import { CriminalDomainResponseType } from "types/searchDomainResponse/CriminalDomainType";
import "dotenv/config";
import { AbuseIPObject } from "../../../types/searchIPResponse/AbuseIPDBType";
import { VirusTotalIPreport } from "../../../types/searchIPResponse/VirusTotalType";
import { IPInfo } from "../../../types/searchIPResponse/DBIPType";
import { CriminalObject } from "../../../types/searchIPResponse/CriminalIPType";
import { BlockList } from "../../../types/searchIPResponse/blockListType";
import { IsMaliciousData } from "../../../types/searchDomainResponse/IsMaliciousType";
import { NeutrinoData } from "../../../types/searchDomainResponse/NeutrinoType";
import { URLVoidData } from "../../../types/searchDomainResponse/UrlVoidDomainType";
import { VirusTotalDomain } from "../../../types/searchDomainResponse/VirusTotalDomainType";
import { handleError } from "@src/services/handler/error_handling";
import { AppError } from "@src/services/handler/error_interface";
import { fetchSearchData } from "@src/services/search/search";
import { searchAssetResponse } from "../../../types/searchAssetResponse/NDV";
import { fetchAsset } from "@src/services/searchAsset/searchAsset";
import { calculateDomainRisk } from "@src/services/Analyze/calculateDomainRisk";
import { calculateIPRisk } from "@src/services/Analyze/calculateIPRisk";

async function searchIP({
  params,
}: {
  params: { ip: string };
}): Promise<ApiResponse | searchIPresponse> {
  try {
    const ipv4Regex =
      /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}$/;
    if (!params.ip) {
      throw new AppError(404, "IP must be provided!");
    }
    if (!ipv4Regex.test(params.ip)) {
      throw new AppError(400, "Invalid IP format!");
    }
    const Abuseresult = await fetchSearchData<AbuseIPObject>(
      "IP",
      params.ip,
      "AbuseIPDB",
      process.env.ABUSE_IPDB_API_KEY || ""
    );
    const Virusresult = await fetchSearchData<VirusTotalIPreport>(
      "IP",
      params.ip,
      "VirusTotal",
      process.env.VIRUS_TOTAL_API_KEY || ""
    );
    const DBIPresult = await fetchSearchData<IPInfo>(
      "IP",
      params.ip,
      "DBIP",
      ""
    );
    const Criminalresult = await fetchSearchData<CriminalObject>(
      "IP",
      params.ip,
      "CriminalIP",
      process.env.CRIMINAL_IP_API_KEY || ""
    );
    const BlockListresult = await fetchSearchData<BlockList>(
      "IP",
      params.ip,
      "BlockList",
      ""
    );
    const riskScore = calculateIPRisk(
      {
        abuseData: Abuseresult._tag === "Right" ? Abuseresult.right : ({} as AbuseIPObject),
        virusTotalData: Virusresult._tag === "Right" ? Virusresult.right : ({} as VirusTotalIPreport),
        DBIPData: DBIPresult._tag === "Right" ? DBIPresult.right : ({} as IPInfo),
        CriminalData: Criminalresult._tag === "Right" ? Criminalresult.right : ({} as CriminalObject),
        BlockListData: BlockListresult._tag === "Right" ? BlockListresult.right : ({} as BlockList)
      }
    );
    return {
      success: true,
      status: 200,
      riskScore: riskScore,
      message: "Domain search completed successfully",
      abuseData:
        Abuseresult._tag === "Left" ? Abuseresult.left : Abuseresult.right,
      virusTotalData:
        Virusresult._tag === "Left" ? Virusresult.left : Virusresult.right,
      DBIPData: DBIPresult._tag === "Left" ? DBIPresult.left : DBIPresult.right,
      CriminalData:
        Criminalresult._tag === "Left"
          ? Criminalresult.left
          : Criminalresult.right,
      BlockListData:
        BlockListresult._tag === "Left"
          ? BlockListresult.left
          : BlockListresult.right,
    };
  } catch (error: unknown) {
    if (error instanceof AppError) {
      return handleError(error.statusCode, error.message);
    }
    return handleError(
      500,
      error instanceof Error
        ? `Internal Error: ${error.message}`
        : "Unknown internal error"
    );
  }
}

async function searchDomain({
  params,
}: {
  params: { domainName: string };
}): Promise<ApiResponse | searchDomainResponse> {
  try {
    const domainRegex = /^(?!-)([A-Za-z0-9-]{1,63}\.)+[A-Za-z]{2,63}$/;
    if (!params.domainName) {
      throw new AppError(404, "Domain name must be provided!");
    }
    if (!domainRegex.test(params.domainName)) {
      throw new AppError(400, "Invalid Domain format!");
    }
    const CriminalResult = await fetchSearchData<CriminalDomainResponseType>(
      "Domain",
      params.domainName,
      "CriminalIP",
      process.env.CRIMINAL_IP_API_KEY || ""
    );
    const IsMaliciousresult = await fetchSearchData<IsMaliciousData>(
      "Domain",
      params.domainName,
      "IsMalicious",
      process.env.ISMALICIOUS_API_KEY || "",
      process.env.ISMALICIOUS_API_SECRET || ""
    );
    const NeutrinoResult = await fetchSearchData<NeutrinoData>(
      "Domain",
      params.domainName,
      "Neutrino",
      process.env.NEUTRINO_API_KEY || "",
      "",
      process.env.NEUTRINO_USER_ID || ""
    );
    const UrlVoidresult = await fetchSearchData<URLVoidData>(
      "Domain",
      params.domainName,
      "UrlVoid",
      ""
    );
    const Virusresult = await fetchSearchData<VirusTotalDomain>(
      "Domain",
      params.domainName,
      "VirusTotal",
      process.env.VIRUS_TOTAL_API_KEY || ""
    );

    const riskScore = calculateDomainRisk({
      UrlVoidData: UrlVoidresult._tag === "Right" ? UrlVoidresult.right : ({} as URLVoidData),
      virusTotalData: Virusresult._tag === "Right" ? Virusresult.right : ({} as VirusTotalDomain),
      IsMaliCiousData: IsMaliciousresult._tag === "Right" ? IsMaliciousresult.right : ({} as IsMaliciousData),
      CriminalData:
        CriminalResult._tag === "Right"
          ? CriminalResult.right
          : ({} as CriminalDomainResponseType),
      NeutrinoData: NeutrinoResult._tag === "Right" ? NeutrinoResult.right : ({} as NeutrinoData),
    });

    return {
      success: true,
      status: 200,
      riskScore: riskScore,
      message: "Domain search completed successfully",
      CriminalData:
        CriminalResult._tag === "Left"
          ? CriminalResult.left
          : CriminalResult.right,
      // IsMaliCiousData:
      //   IsMaliciousresult._tag === "Left"
      //     ? IsMaliciousresult.left
      //     : IsMaliciousresult.right,
      NeutrinoData:
        NeutrinoResult._tag === "Left"
          ? NeutrinoResult.left
          : NeutrinoResult.right,
      UrlVoidData:
        UrlVoidresult._tag === "Left"
          ? UrlVoidresult.left
          : UrlVoidresult.right,
      virusTotalData:
        Virusresult._tag === "Left" ? Virusresult.left : Virusresult.right,
    }
  } catch (error: unknown) {
    if (error instanceof AppError) {
      return handleError(error.statusCode, error.message);
    }
    return handleError(
      500,
      error instanceof Error
        ? `Internal Error: ${error.message}`
        : "Unknown internal error"
    );
  }
}

async function searchAsset({
  params,
}: {
  params: { asset: string };
}): Promise<ApiResponse | searchAssetResponse> {
  try {
    if (!params.asset) {
      throw new AppError(404, "Asset name must be provided!");
    }
    const assetResult = await fetchAsset(params.asset);
    return assetResult._tag === "Left" ? assetResult.left : assetResult.right;
  } catch (error: unknown) {
    if (error instanceof AppError) {
      return handleError(error.statusCode, error.message);
    }
    return handleError(
      500,
      error instanceof Error
        ? `Internal Error: ${error.message}`
        : "Unknown internal error"
    );
  }
}

export { searchIP, searchDomain, searchAsset };
