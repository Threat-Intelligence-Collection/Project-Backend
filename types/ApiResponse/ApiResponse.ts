import { CriminalObject } from "types/searchIPResponse/CriminalIPType";
import { CriminalDomainResponseType } from "types/searchDomainResponse/CriminalDomainType";
import { AbuseIPObject } from "types/searchIPResponse/AbuseIPDBType";
import { IPInfo } from "types/searchIPResponse/DBIPType";
import { VirusTotalIPreport } from "types/searchIPResponse/VirusTotalType";
import { VirusTotalDomain } from "types/searchDomainResponse/VirusTotalDomainType";
import { BlockList } from "types/searchIPResponse/blockListType";
import { URLVoidData } from "types/searchDomainResponse/UrlVoidDomainType";
import { IsMaliciousData } from "types/searchDomainResponse/IsMaliciousType";
import { NeutrinoData } from "types/searchDomainResponse/NeutrinoType";
interface ApiResponse {
  success: boolean;
  status: number;
  message?: string;
}

interface searchIPresponse {
  success: boolean;
  abuseData: AbuseIPObject | ApiResponse;
  virusTotalData: VirusTotalIPreport | ApiResponse;
  DBIPData: IPInfo | ApiResponse;
  CriminalData: CriminalObject | ApiResponse;
  BlockListData: BlockList | ApiResponse;
  riskScore?: number;
}

interface searchDomainResponse {
  success: boolean;
  UrlVoidData: URLVoidData | ApiResponse;
  virusTotalData: VirusTotalDomain | ApiResponse;
  IsMaliCiousData: IsMaliciousData | ApiResponse;
  CriminalData: CriminalDomainResponseType | ApiResponse;
  BlockListData: BlockList | ApiResponse;
  NeutrinoData: NeutrinoData | ApiResponse;
}

interface errResponse {
  success: boolean;
  error: string;
}
export { ApiResponse, searchIPresponse, errResponse, searchDomainResponse };
