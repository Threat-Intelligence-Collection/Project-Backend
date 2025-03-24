import fetch from "node-fetch";
import "dotenv/config";
import { ApiResponse } from "../../../types/ApiResponse/ApiResponse";
import { NeutrinoData } from "../../../types/searchDomainResponse/NeutrinoType";
import { handleError } from "../handler/error_handling";
import { AppError } from "../handler/error_interface";

type ResponseTypes =
  | "CriminalIP"
  | "IsMalicious"
  | "Neutrino"
  | "UrlVoid"
  | "VirusTotal";

async function fetchNeutrino(
  domainName: string,
  sourceType: ResponseTypes,
  API_KEY: string,
  USER_ID: string
): Promise<NeutrinoData | ApiResponse> {
  const URL = "https://neutrinoapi.net/domain-lookup";
  const headers = {
    "User-ID": USER_ID,
    "API-Key": API_KEY,
    "Content-Type": "application/x-www-form-urlencoded",
  };  
  const formData = new URLSearchParams();
  formData.append("host", domainName);
  formData.append("live", "true");

  if (!API_KEY || !USER_ID) {
    throw new Error("API credentials are not configured");
  }

  try {
    const response = await fetch(URL, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!response.ok) {
      throw new AppError(
        `Failed to fetch data from ${sourceType}. HTTP Status Code: ${response.status}`,
        response.status
      );
    }

    const result = (await response.json()) as NeutrinoData;
    if (result) {
      return result;
    } else {
      return {
        success: false,
        status: 503,
        message: "Data fetched failed",
      };
    }
  } catch (error: unknown) {
    if (error instanceof AppError) {
      return handleError(error.statusCode, error.message);
    }
    return handleError(
      500,
      error instanceof Error
        ? `Internal Error: ${error.message}`
        : "Unknown internal error"
    );
  }
}

export { fetchNeutrino };
