import fetch, { Response } from "node-fetch";
import "dotenv/config";
import type {
  AbuseIPDBResponseType,
  AbuseIPObject,
} from "../../../types/searchIPResponse/AbuseIPDBType";
import { ApiResponse } from "../../../types/ApiResponse/ApiResponse";

const API_KEY = process.env.ABUSE_IPDB_API_KEY || "";

/**
 * Check API key is valid or not
 * @param key is an API key of AbuseIPDB
 * @returns boolean that indicates key is valid or not
 */
const isValidApiKey = (key: string): boolean => key.trim() !== "";

/**
 * Build the URL for fetching data from AbuseIPDB
 * @param ipAddress is an IP address that we want to check
 * @param maxAgeInDays is number of days that we want to check the IP address
 * @returns URL for fetching data from AbuseIPDB
 */
const buildAbuseIPDBUrl = (
  ipAddress: string,
  maxAgeInDays: number = 90
): string =>
  `https://api.abuseipdb.com/api/v2/check?ipAddress=${ipAddress}&maxAgeInDays=${maxAgeInDays}`;

/**
 * Generate headers for fetching data from AbuseIPDB
 * @param ipAddress Generate headers for fetching data from AbuseIPDB
 * @returns Headers for fetching data from AbuseIPDBs
 */
const generateHeaders = (apikey: string): Record<string, string> => ({
  Accept: "application/json",
  Key: apikey,
});

/**
 * Parse the response from AbuseIPDB
 * @param response Response from AbuseIPDB
 * @returns data in abuseipdb object
 */
const parseAbuseIPDBResponse = async (
  response: Response
): Promise<AbuseIPObject> => {
  const data = (await response.json()) as AbuseIPDBResponseType;
  return data.data;
};

/**
 * Error handling for fetching data from AbuseIPDB
 * @param error The error that occurs during fetching data
 * @returns object that contains status of success and error message
 */
const handleError = (error: unknown): ApiResponse => {
  console.error("Error:", error);
  return { success: false, status: 503 ,message: "Fetch data fail from AbuseIPDB!" };
};

/**
 * Fetch data from AbuseIPDB
 * @param ipAddress IP address that we want to check
 * @returns AbuseIPObject or ApiResponse
 */
const fetchAbuseReport = async (
  ipAddress: string
): Promise<AbuseIPObject | ApiResponse> => {
  if (!isValidApiKey(API_KEY)) {
    return { success: false, status: 404, message: "AbuseIPDB API Key not found!" };
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
