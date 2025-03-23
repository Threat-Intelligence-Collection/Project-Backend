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
 * Build the URL for fetching data from provider url
 * @param ipAddress is an IP address that we want to check
 * @param companyName is a name of the company that we want to check
 * @param maxAgeInDays is number of days that we want to check the IP address
 * @returns URL for fetching data from provider
 */
const buildUrl = (
  ipAddress: string,
  companyName: string,
  maxAgeInDays: number = 90
): string => {
  switch (companyName) {
    case "AbuseIPDB":
      return `https://api.abuseipdb.com/api/v2/check?ipAddress=${ipAddress}&maxAgeInDays=${maxAgeInDays}`;
    case "BlockList":
      return `http://api.blocklist.de/api.php?ip=${ipAddress}&start=1`;
    case "CriminalIP" :
      return `https://api.criminalip.io/v1/asset/ip/report?ip=${ipAddress}`;
    case "DBIP" :
      return `https://db-ip.com/${ipAddress}`;
    case "VirusTotal" :
      return `https://www.virustotal.com/api/v3/ip_addresses/${ipAddress}`;
    default:
      return "";
  }
};

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
  return {
    success: false,
    status: 503,
    message: "Fetch data fail from AbuseIPDB!",
  };
};

export {
  isValidApiKey,
  buildUrl,
  generateHeaders,
  parseAbuseIPDBResponse,
  handleError,
};
