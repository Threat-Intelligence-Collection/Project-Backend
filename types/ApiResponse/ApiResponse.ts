import { CriminalObject } from "types/searchIPResponse/CriminalIP";
import { CriminalDomain } from "types/searchDomainResponse/CriminalDomainType";
import { AbuseIPObject } from "types/searchIPResponse/AbuseIPDBType";
import { IPInfo } from "types/searchIPResponse/DBIPType";
import { VirusTotalIPreport } from "types/searchIPResponse/VirusTotalType";
import { VirusTotalDomain } from "types/searchDomainResponse/VirusTotalDomainType";
interface ApiResponse {
    success: boolean;
    message?: string;
  }

interface searchIPresponse {
    success : boolean,
    data1: AbuseIPObject | ApiResponse | undefined, 
    data2: VirusTotalIPreport | ApiResponse | VirusTotalDomain, 
    data3: IPInfo | ApiResponse | undefined, 
    data4: CriminalObject | ApiResponse | CriminalDomain,
}

interface errResponse {
    success : boolean,
    error : string
}
export { ApiResponse, searchIPresponse, errResponse}