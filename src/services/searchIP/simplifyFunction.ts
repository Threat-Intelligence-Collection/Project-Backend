import { Response } from "node-fetch";
import "dotenv/config";
import type { AbuseIPDBResponseType } from "../../../types/searchIPResponse/AbuseIPDBType";
import { ApiResponse } from "../../../types/ApiResponse/ApiResponse";
import { CriminalResponseType } from "../../../types/searchIPResponse/CriminalIPType";
import { VirusTotalResponse } from "../../../types/searchIPResponse/VirusTotalType";

/**
 * Generate headers for fetching data from AbuseIPDB
 * @param ipAddress Generate headers for fetching data from AbuseIPDB
 * @returns Headers for fetching data from AbuseIPDBs
 */
const generateHeaders = (
  apikey: string,
  companyName: string
): Record<string, string> => {
  switch (companyName) {
    case "AbuseIPDB":
      return {
        Accept: "application/json",
        Key: apikey,
      };
    case "CriminalIP":
      return {
        Accept: "application/json",
        "x-api-key": apikey,
      };
    case "VirusTotal":
      return {
        "x-apikey": apikey,
      };
    default:
      return {};
  }
};

/**
 * Parse the response from AbuseIPDB
 * @param response Response from AbuseIPDB
 * @returns data in abuseipdb object
 */
const parseResponse = async <T>(
  response: Response,
  companyName: string
): Promise<T> => {
  switch (companyName) {
    case "AbuseIPDB": {
      const AbuseIPDBResponse =
        (await response.json()) as AbuseIPDBResponseType;
      return AbuseIPDBResponse.data as T;
    }
    case "CriminalIP": {
      const Criminalresponse = (await response.json()) as CriminalResponseType;
      const result = {
        ip: Criminalresponse.ip,
        score: Criminalresponse.score,
        whois: Criminalresponse.whois,
      };
      return result as T;
    }
    case "VirusTotal": {
      const VirusTotalresponse = (await response.json()) as VirusTotalResponse;
      const filteredData = {
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
      return filteredData as T;
    }
    default:
      throw new Error("Unsupported company");
  }
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

export { generateHeaders, parseResponse, handleError };
