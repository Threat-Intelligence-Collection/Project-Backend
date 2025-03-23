import fetch from "node-fetch";
import "dotenv/config";
import { VirusTotalIPreport } from "../../../types/searchIPResponse/VirusTotalType";
import { ApiResponse } from "../../../types/ApiResponse/ApiResponse";
import { parseResponse } from "./../function/parseResponse/parseResponse";
import { isValidApiKey, buildUrl } from "../function/buildUrl/buildUrl";
import { generateHeaders } from "../function/generateHeaders/generateHeaders";
import { handleError } from "../handler/error_handling";

async function fetchVirusTotalData(
  ipAddress: string,
  API_KEY: string
): Promise<VirusTotalIPreport | ApiResponse> {
  const URL = buildUrl(ipAddress, "VirusTotal");
  const headers = generateHeaders(API_KEY, "VirusTotal");
  try {
    if (!isValidApiKey(API_KEY)) {
      return handleError(404, "VirusTotal API Key not found!!");
    }

    const response = await fetch(URL, { headers });
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    return await parseResponse<VirusTotalIPreport>(
      response,
      "VirusTotal",
      ipAddress
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      return handleError(500, `Internal Error: ${error.message}`);
    } else {
      return handleError(500, "Unknown internal error");
    }
  }
}

export { fetchVirusTotalData };
