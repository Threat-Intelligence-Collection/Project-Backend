import { fetchAbuseReport } from "@src/services/searchIP/AbuseIPDB";
import { fetchCriminalReport } from "@src/services/searchIP/CriminalIP";
import { fetchDBIP } from "@src/services/searchIP/DBIP";
import { fetchVirusTotalData } from "@src/services/searchIP/Virustotal";
import { ApiResponse, searchIPresponse, errResponse } from "../../types/ApiResponse/ApiResponse";
import { fetchCriminalDomainReport } from "@src/services/searchDomain/CriminalIP";
import { fetchVirusTotalDomainData } from "@src/services/searchDomain/Virustotal";
async function searchIP({ params }: { params: { ip: string } }): Promise <ApiResponse | searchIPresponse>{
    try {
        const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}$/;
        if (!params.ip) {
            return { success: false, message: "IP must be provided!" };
        }
        if (!ipv4Regex.test(params.ip)) {
            return { success: false, message: "Invalid IP format!" };
        }
        const Abuseresult = await fetchAbuseReport(params.ip);
        const Virusresult = await fetchVirusTotalData(params.ip);
        const DBIPresult = await fetchDBIP(params.ip);
        const Criminalresult = await fetchCriminalReport(params.ip);
        // Now search only on AbuseIPDB, VirusTotal, DBIP, CriminalIP and doesn't provide to database
        // Waiting for database schema and implementation
        return { success: true, abuseData: Abuseresult, virusTotalData: Virusresult, IPDBData: DBIPresult, CriminalData: Criminalresult};

    } catch (error: unknown) {
        console.error("Error:", error);
        let errorMessage = "An unknown error occurred";
        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === "string") {
            errorMessage = error;
        }
        return { success: false, message: errorMessage };
    }
}

async function searchDomain({ params }: { params: { domainName: string } }): Promise <ApiResponse | searchIPresponse>{
    try {
        const domainRegex = /^(?!-)([A-Za-z0-9-]{1,63}\.)+[A-Za-z]{2,63}$/;
        if(!params.domainName) {
            return { success: false, message: "Domain name must be provided!" };
        }
        if (!domainRegex.test(params.domainName)) {
            return { success: false, message: "Invalid Domain format!" };
        }
        const CriminalResult = await fetchCriminalDomainReport(params.domainName);
        const Virusresult = await fetchVirusTotalDomainData(params.domainName);

        return { success: true, abuseData: undefined, virusTotalData: Virusresult, IPDBData: undefined, CriminalData: CriminalResult};
    } catch (error: unknown) {
        console.error("Error:", error);
        let errorMessage = "An unknown error occurred";
        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === "string") {
            errorMessage = error;
        }
        return { success: false, message: errorMessage };
    }
} 
export { searchIP, searchDomain }