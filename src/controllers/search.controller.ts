import { fetchAbuseReport } from "@src/services/searchIP/AbuseIPDB";
import { fetchCriminalReport } from "@src/services/searchIP/CriminalIP";
import { fetchDBIP } from "@src/services/searchIP/DBIP";
import { fetchVirusTotalData } from "@src/services/searchIP/Virustotal";
import { ApiResponse, searchIPresponse, errResponse } from "../../types/ApiResponse/ApiResponse";
async function searchIP({ params }: { params: { ip: string } }): Promise <ApiResponse | searchIPresponse | errResponse>{
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
        return { success: true, data1: Abuseresult, data2: Virusresult, data3: DBIPresult, data4: Criminalresult};

    } catch (error: unknown) {
        console.error("Error:", error);
        let errorMessage = "An unknown error occurred";
        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === "string") {
            errorMessage = error;
        }
        return { success: false, error: errorMessage };
    }
}

async function searchDomain({ params }: { params: { domainName: string } }){
    try {
        
    } catch (error: unknown) {
        console.error("Error:", error);
        let errorMessage = "An unknown error occurred";
        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === "string") {
            errorMessage = error;
        }
        return { success: false, error: errorMessage };
    }
} 
export { searchIP }