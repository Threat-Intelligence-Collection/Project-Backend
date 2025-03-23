import fetch from "node-fetch";
import type { AbuseIPObject } from "../../../types/searchIPResponse/AbuseIPDBType";
import { ApiResponse } from "../../../types/ApiResponse/ApiResponse";
import {
  generateHeaders,
  handleError,
  parseResponse,
} from "./simplifyFunction";
import { isValidApiKey, buildUrl } from "./../buildUrl/buildUrl";

/**
 * Fetch data from AbuseIPDB
 * @param ipAddress IP address that we want to check
 * @returns AbuseIPObject or ApiResponse
 */
const fetchAbuseReport = async (
  ipAddress: string,
  API_KEY: string
): Promise<AbuseIPObject | ApiResponse> => {
  if (!isValidApiKey(API_KEY)) {
    return {
      success: false,
      status: 404,
      message: "AbuseIPDB API Key not found!",
    };
  }

  const url = buildUrl(ipAddress, "AbuseIPDB");
  const headers = generateHeaders(API_KEY, "AbuseIPDB");
  try {
    const response = await fetch(url, { method: "GET", headers });

    if (!response.ok) {
      return handleError(
        `Failed to fetch data: ${response.status} - ${response.statusText}`
      );
    }
    return await parseResponse<AbuseIPObject>(response, "AbuseIPDB");
  } catch (error) {
    return handleError(error);
  }
};

export { fetchAbuseReport };
