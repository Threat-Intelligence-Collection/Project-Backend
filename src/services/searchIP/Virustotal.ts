import fetch from "node-fetch";
import "dotenv/config";
import {
  VirusTotalIPreport,
} from "../../../types/searchIPResponse/VirusTotalType";
import { ApiResponse } from "../../../types/ApiResponse/ApiResponse";
import { parseResponse } from "./../function/parseResponse/parseResponse";
import { isValidApiKey, buildUrl } from "../function/buildUrl/buildUrl";
import { generateHeaders } from "../function/generateHeaders/generateHeaders";

async function fetchVirusTotalData(
  ipAddress: string, API_KEY: string
): Promise<VirusTotalIPreport | ApiResponse> {
  const URL = buildUrl(ipAddress, "VirusTotal");
  const headers = generateHeaders(API_KEY, "VirusTotal");
  try {
    if (!isValidApiKey(API_KEY)) {
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
    return await parseResponse<VirusTotalIPreport>(response, "VirusTotal");
  } catch (error: any) {
    console.error("Error fetching VirusTotal data:", error);
    return { success: false, status: 503, message: error.message };
  }
}

export { fetchVirusTotalData };
