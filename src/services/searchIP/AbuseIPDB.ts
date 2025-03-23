import fetch from "node-fetch";
import type { AbuseIPObject } from "../../../types/searchIPResponse/AbuseIPDBType";
import { ApiResponse } from "../../../types/ApiResponse/ApiResponse";
import { handleError } from "../handler/error_handling";
import { parseResponse } from "./../function/parseResponse/parseResponse";
import { isValidApiKey, buildUrl } from "../function/buildUrl/buildUrl";
import { generateHeaders } from "../function/generateHeaders/generateHeaders";

/**
 * Fetch data from AbuseIPDB
 * @param ipAddress IP address that we want to check
 * @param API_KEY API key for AbuseIPDB
 * @returns AbuseIPObject or ApiResponse
 */
const fetchAbuseReport = async (
  ipAddress: string,
  API_KEY: string
): Promise<AbuseIPObject | ApiResponse> => {
  if (!isValidApiKey(API_KEY)) {
    return handleError(404, "AbuseIPDB API Key not found!!");
  }
  const url = buildUrl(ipAddress, "AbuseIPDB");
  const headers = generateHeaders(API_KEY, "AbuseIPDB");
  try {
    const response = await fetch(url, { method: "GET", headers });
    if (!response.ok) {
      throw new Error(
        `Failed to fetch data. HTTP Status Code: ${response.status}`
      );
    }
    return await parseResponse<AbuseIPObject>(response, "AbuseIPDB", ipAddress);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return handleError(500, `Internal Error: ${error.message}`);
    } else {
      return handleError(500, "Unknown internal error");
    }
  }
};

export { fetchAbuseReport };
