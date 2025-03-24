import {
  ApiResponse,
  searchIPresponse,
  searchDomainResponse,
} from "../../types/ApiResponse/ApiResponse";
import { CriminalDomainResponseType } from "types/searchDomainResponse/CriminalDomainType";
import "dotenv/config";
import { fetchIPReport } from "@src/services/searchIP/fetchIP";
import { AbuseIPObject } from "../../types/searchIPResponse/AbuseIPDBType";
import { VirusTotalIPreport } from "../../types/searchIPResponse/VirusTotalType";
import { IPInfo } from "../../types/searchIPResponse/DBIPType";
import { CriminalObject } from "../../types/searchIPResponse/CriminalIPType";
import { BlockList } from "../../types/searchIPResponse/blockListType";
import { fetchDomainData } from "@src/services/searchDomain/fetchDomain";
import { IsMaliciousData } from "../../types/searchDomainResponse/IsMaliciousType";
import { NeutrinoData } from "../../types/searchDomainResponse/NeutrinoType";
import { URLVoidData } from "../../types/searchDomainResponse/UrlVoidDomainType";
import { VirusTotalDomain } from "../../types/searchDomainResponse/VirusTotalDomainType";
import { handleError } from "@src/services/handler/error_handling";
import { AppError } from "@src/services/handler/error_interface";

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
    const Abuseresult = await fetchIPReport<AbuseIPObject>(
      params.ip,
      "AbuseIPDB",
      process.env.ABUSE_IPDB_API_KEY || ""
    );
    const Virusresult = await fetchIPReport<VirusTotalIPreport>(
      params.ip,
      "VirusTotal",
      process.env.VIRUS_TOTAL_API_KEY || ""
    );
    const DBIPresult = await fetchIPReport<IPInfo>(params.ip, "DBIP");
    const Criminalresult = await fetchIPReport<CriminalObject>(
      params.ip,
      "CriminalIP",
      process.env.CRIMINAL_IP_API_KEY || ""
    );
    const BlockListresult = await fetchIPReport<BlockList>(
      params.ip,
      "BlockList"
    );

    // const riskScore = calculateIPRisk({
    //   abuseData: Abuseresult,
    //   virusTotalData: Virusresult,
    //   DBIPData: DBIPresult,
    //   CriminalData: Criminalresult,
    //   BlockListData: BlockListresult,
    // });

    return {
      success: true,
      abuseData: Abuseresult,
      virusTotalData: Virusresult,
      DBIPData: DBIPresult,
      CriminalData: Criminalresult,
      BlockListData: BlockListresult,
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
    const CriminalResult = await fetchDomainData<CriminalDomainResponseType>(
      params.domainName,
      "CriminalIP",
      process.env.CRIMINAL_IP_API_KEY || ""
    );
    const IsMaliciousresult = await fetchDomainData<IsMaliciousData>(
      params.domainName,
      "IsMalicious",
      process.env.ISMALICIOUS_API_KEY || "",
      process.env.ISMALICIOUS_API_SECRET || ""
    );
    const NeutrinoResult = await fetchDomainData<NeutrinoData>(
      params.domainName,
      "Neutrino",
      process.env.NEUTRINO_API_KEY || "",
      "",
      process.env.NEUTRINO_USER_ID || ""
    );
    const UrlVoidresult = await fetchDomainData<URLVoidData>(
      params.domainName,
      "UrlVoid"
    );
    const Virusresult = await fetchDomainData<VirusTotalDomain>(
      params.domainName,
      "VirusTotal",
      process.env.VIRUS_TOTAL_API_KEY || ""
    );

    // const riskScore = calculateDomainRisk({
    //   UrlVoidData: UrlVoidresult,
    //   virusTotalData: Virusresult,
    //   IsMaliCiousData: IsMaliciousresult,
    //   CriminalData: CriminalResult,
    //   NeutrinoData: NeutrinoResult,
    // });

    return {
      success: true,
      status: 200,
      CriminalData: CriminalResult,
      IsMaliCiousData: IsMaliciousresult,
      NeutrinoData: NeutrinoResult,
      UrlVoidData: UrlVoidresult,
      virusTotalData: Virusresult,
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

export { searchIP, searchDomain };
