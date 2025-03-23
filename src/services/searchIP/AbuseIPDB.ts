import fetch from "node-fetch";
import type { AbuseIPObject } from "../../../types/searchIPResponse/AbuseIPDBType";
import { ApiResponse } from "../../../types/ApiResponse/ApiResponse";
import {
  isValidApiKey,
  buildAbuseIPDBUrl,
  generateHeaders,
  handleError,
  parseAbuseIPDBResponse,
} from "./simplifyFunction";

/**
 * Fetch data from AbuseIPDB
 * @param ipAddress IP address that we want to check
 * @returns AbuseIPObject or ApiResponse
 */
const fetchAbuseReport = async (
  API_KEY: string,
  ipAddress: string
): Promise<AbuseIPObject | ApiResponse> => {
  if (!isValidApiKey(API_KEY)) {
    return {
      success: false,
      status: 404,
      message: "AbuseIPDB API Key not found!",
    };
  }

  const URL = buildAbuseIPDBUrl(ipAddress);
  const headers = generateHeaders(API_KEY);

  try {
    const response = await fetch(URL, { method: "GET", headers });

    if (!response.ok) {
      return handleError(
        `Failed to fetch data: ${response.status} - ${response.statusText}`
      );
    }

    return await parseAbuseIPDBResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

export { fetchAbuseReport };
