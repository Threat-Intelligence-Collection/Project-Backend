import { Response } from "node-fetch";
import "dotenv/config";
import type { AbuseIPDBResponseType } from "../../../../types/searchIPResponse/AbuseIPDBType";
import { CriminalResponseType } from "../../../../types/searchIPResponse/CriminalIPType";
import { VirusTotalResponse } from "../../../../types/searchIPResponse/VirusTotalType";
import { scrapiingIP } from "../webScraping/webScrapingIP";

/**
 * Parse the response from AbuseIPDB
 * @param response Response from AbuseIPDB
 * @param companyName Name of provider
 * @param ipAddress IP address
 * @returns data in abuseipdb object
 */
const parseIPResponse = async <T>(
  response: Response,
  companyName: string,
  ipAddress?: string
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
    case "BlockList": {
      return (await scrapiingIP<T>(response, companyName, ipAddress || "")) as T;
    }
    case "DBIP": {
      return (await scrapiingIP<T>(response, companyName, ipAddress || "")) as T;
    }
    default:
      throw new Error("Unsupported company");
  }
};

/**
 * Parse the response from AbuseIPDB
 * @param response Response from AbuseIPDB
 * @returns data in abuseipdb object
 */
const parseDomainResponse = async <T>(
  response: Response,
  companyName: string,
): Promise<T> => {
  switch (companyName) {
    case "CriminalIP": {
      return (await response.json()) as T;
    }
    case "IsMalicious": {
      return (await response.json()) as T;
    }
    default:
      throw new Error("Unsupported company");
  }
};

export { parseIPResponse, parseDomainResponse};
