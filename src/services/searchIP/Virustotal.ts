import fetch from "node-fetch";
import "dotenv/config";
import {
  VirusTotalResponse,
  VirusTotalIPreport,
} from "../../../types/searchIPResponse/VirusTotalType";
import { ApiResponse } from "../../../types/ApiResponse/ApiResponse";

const API_KEY = process.env.VIRUS_TOTAL_API_KEY || "";

const headers = {
  "x-apikey": API_KEY,
};

async function fetchVirusTotalData(
  ipAddress: string
): Promise<VirusTotalIPreport | ApiResponse> {
  const URL = `https://www.virustotal.com/api/v3/ip_addresses/${ipAddress}`;
  try {
    if (API_KEY == "") {
      return {
        success: false,
        status: 404,
        message: "Virus total API Key not found!!",
      };
    }

    const response = await fetch(URL, { headers });
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const VirusTotalresponse = (await response.json()) as VirusTotalResponse;
    const filteredData: VirusTotalIPreport = {
      IP_Address: VirusTotalresponse.data.id,
      Continent: VirusTotalresponse.data.attributes.continent,
      Reputation: VirusTotalresponse.data.attributes.reputation,
      Harmless_from_VirusTotal:
        VirusTotalresponse.data.attributes.total_votes.harmless,
      Malicious_from_VirusTotal:
        VirusTotalresponse.data.attributes.total_votes.malicious,
      Country: VirusTotalresponse.data.attributes.country,
      Analysis_stats: VirusTotalresponse.data.attributes.last_analysis_stats,
    };

    return filteredData;
  } catch (error: any) {
    console.error("Error fetching VirusTotal data:", error);
    return { success: false, status: 503, message: error.message };
  }
}

export { fetchVirusTotalData };
