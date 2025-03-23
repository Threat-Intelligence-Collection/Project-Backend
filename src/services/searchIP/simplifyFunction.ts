import { Response } from "node-fetch";
import "dotenv/config";
import type {
  AbuseIPDBResponseType,
  AbuseIPObject,
} from "../../../types/searchIPResponse/AbuseIPDBType";
import { ApiResponse } from "../../../types/ApiResponse/ApiResponse";
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

export { isValidApiKey, buildAbuseIPDBUrl, generateHeaders, parseAbuseIPDBResponse, handleError };