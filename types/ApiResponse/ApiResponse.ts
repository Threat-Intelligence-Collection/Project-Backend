import { CriminalObject } from "types/searchIPResponse/CriminalIP";
import { CriminalDomain } from "types/searchDomainResponse/CriminalDomainType";
import { AbuseIPObject } from "types/searchIPResponse/AbuseIPDBType";
import { IPInfo } from "types/searchIPResponse/DBIPType";
import { VirusTotalIPreport } from "types/searchIPResponse/VirusTotalType";
interface ApiResponse {
    success: boolean;
    data?: CriminalDomain;
    message?: string;
  }

interface searchIPresponse {
    success : boolean,
    data1: AbuseIPObject | ApiResponse, 
    data2: VirusTotalIPreport | ApiResponse | undefined, 
    data3: IPInfo | ApiResponse, 
    data4: CriminalObject | ApiResponse
}

interface errResponse {
    success : boolean,
    error : string
}
export { ApiResponse, searchIPresponse, errResponse}