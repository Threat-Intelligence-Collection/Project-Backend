import fetch from "node-fetch";
import "dotenv/config";
import { ApiResponse } from "../../../types/ApiResponse/ApiResponse";
import {
  IsMaliciousData,
} from "../../../types/searchDomainResponse/IsMaliciousType";
const API_KEY = process.env.ISMALICIOUS_API_KEY || "";
const API_SECRET = process.env.ISMALICIOUS_API_SECRET || "";

async function createAuthHeaders(api_key: string, api_secret: string) {
  const authString = `${api_key}:${api_secret}`;
  const encodedAuth = Buffer.from(authString).toString("base64");
  return {
    "X-API-KEY": encodedAuth,
  };
}

async function fetchIsMalicious(
  domainName: string
): Promise<IsMaliciousData | ApiResponse> {
  const URL = `https://ismalicious.com/api/check?query=${domainName}`;

  try {
    if (!API_KEY || !API_SECRET) {
      throw new Error("API credentials are not configured");
    }

    const headers = await createAuthHeaders(API_KEY, API_SECRET);
    const response = await fetch(URL, { headers });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const result = (await response.json()) as IsMaliciousData;
    if (result) {
      return result;
    } else {
      return {
        success: false,
        status: 503,
        message: "Data fetched failures",
      };
    }
  } catch (error) {
    console.error("Error fetching isMalicious data:", error);
    return {
      success: false,
      status: 503,
      message:
        error instanceof Error
          ? error.message
          : "Error fetching isMalicious data",
    };
  }
}
export { fetchIsMalicious };
