import fetch from "node-fetch";
import { VirusTotalResponse } from "../../../types/VirusTotalType";

const API_KEY = process.env.VIRUS_TOTAL_API_KEY || "";

const headers = {
    "x-apikey": API_KEY
};

async function fetchVirusTotalData(ipAddress: string) {
    const URL = `https://www.virustotal.com/api/v3/ip_addresses/${ipAddress}`;
    try {
        if(API_KEY == ""){
            return { success : false, message : "Virus total API Key not found!!"};
        }

        const response = await fetch(URL, { headers });
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const VirusTotalresponse = await response.json() as VirusTotalResponse;
        const filteredData = {
            "IP Address": VirusTotalresponse.data.id,
            "Continent": VirusTotalresponse.data.attributes.continent,
            "Reputation": VirusTotalresponse.data.attributes.reputation,
            "Harmless from VirusTotal": VirusTotalresponse.data.attributes.total_votes.harmless,
            "Malicious from VirusTotal": VirusTotalresponse.data.attributes.total_votes.malicious,
            "Country": VirusTotalresponse.data.attributes.country,
            "Analysis stats": VirusTotalresponse.data.attributes.last_analysis_stats
        };
        return filteredData;
    } catch (error) {
        console.error("Error fetching VirusTotal data:", error);
    }
}

export { fetchVirusTotalData }