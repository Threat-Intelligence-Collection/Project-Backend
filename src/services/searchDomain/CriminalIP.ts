import fetch from "node-fetch";
import "dotenv/config";
import { CriminalDomainResponseType } from "../../../types/searchDomainResponse/CriminalDomainType";
import { ApiResponse } from "../../../types/ApiResponse/ApiResponse";
const API_KEY = process.env.CRIMINAL_IP_API_KEY || "";

async function fetchCriminalDomainReport(
  query: string
): Promise<CriminalDomainResponseType | ApiResponse> {
  const url = `https://api.criminalip.io/v1/domain/reports?query=${query}&offset=0`;
  try {
    if (API_KEY === "") {
      return {
        success: false,
        message: "Criminal IP API Key not found!",
      };
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "x-api-key": API_KEY,
      },
    });

    if (!response.ok) {
      return {
        success: false,
        message: `API Error: ${response.status} - ${response.statusText}`,
      };
    }

    const criminalResponse =
      (await response.json()) as CriminalDomainResponseType;
    if (!criminalResponse?.data?.reports) {
      return {
        success: false,
        message: "Invalid response structure from Criminal IP API",
      };
    }
    return criminalResponse;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return {
      success: false,
      message: `Error fetching Criminal IP data: ${errorMessage}`,
    };
  }
}
fetchCriminalDomainReport("werdotx.shop");
export { fetchCriminalDomainReport };
