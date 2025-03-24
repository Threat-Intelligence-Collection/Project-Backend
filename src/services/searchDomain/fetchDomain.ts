import fetch from "node-fetch";
import "dotenv/config";
import * as cheerio from "cheerio";
import { ApiResponse } from "../../../types/ApiResponse/ApiResponse";
import { CriminalDomainResponseType } from "../../../types/searchDomainResponse/CriminalDomainType";
import { IsMaliciousData } from "../../../types/searchDomainResponse/IsMaliciousType";
import { NeutrinoData } from "../../../types/searchDomainResponse/NeutrinoType";
import { URLVoidData } from "../../../types/searchDomainResponse/UrlVoidDomainType";
import { VirusTotalDomain } from "../../../types/searchDomainResponse/VirusTotalDomainType";
import {
  buildUrlForDomainSearching,
  isValidApiKey,
  isValidApiSecret,
} from "../function/buildUrl/buildUrl";
import { generateDomainSearchingHeaders } from "../function/generateHeaders/generateHeaders";
import { parseDomainResponse } from "../function/parseResponse/parseResponse";
import { handleError } from "../handler/error_handling";
import { AppError } from "../handler/error_interface";

type ResponseTypes =
  | "CriminalIP"
  | "IsMalicious"
  | "Neutrino"
  | "UrlVoid"
  | "VirusTotal";

/**
 * Unified function to fetch domain information from various API sources
 * @param options Object containing parameters for the domain search
 * @returns Promise with domain data or API error response
 */
async function fetchDomainData<T>(
  domainName: string,
  sourceType: ResponseTypes,
  API_KEY?: string,
  API_SECRET?: string,
  USER_ID?: string
): Promise<T | ApiResponse> {
  try {
    const url = buildUrlForDomainSearching(domainName, sourceType);
    let headers: Record<string, string> | undefined;
    const sourcesRequiringApiKey: ResponseTypes[] = [
      "CriminalIP",
      "IsMalicious",
      "Neutrino",
      "VirusTotal",
    ];

    if(sourcesRequiringApiKey.includes(sourceType)){
      if(!API_KEY || !isValidApiKey(API_KEY)){
        return handleError(404, `${sourceType} API Key not found!!`);
      }
      if((!API_SECRET || !isValidApiSecret(API_SECRET)) && sourceType == "IsMalicious"){
        return handleError(404, `${sourceType} API Secret not found!!`);
      }
      if((!USER_ID || !isValidApiSecret(USER_ID)) && sourceType == "Neutrino"){
        console.log(USER_ID)
        return handleError(404, `${sourceType} User ID not found!!`);
      }
      headers = generateDomainSearchingHeaders(
        API_KEY,
        sourceType,
        USER_ID,
        API_SECRET
      );
    }

    // Neutrino uses a different endpoint and requires POST with form data
    let method: "GET" | "POST" = "GET";
    let body: URLSearchParams | undefined;

    if (sourceType === "Neutrino") {
      method = "POST";
      body = new URLSearchParams();
      body.append("host", domainName);
      body.append("live", "true");
    }

    // Make the request
    const response = await fetch(url, {
      method,
      headers,
      body,
    });

    if (!response.ok) {
      throw AppError.fromApiResponse(response, sourceType);
    }

    // Parse response based on source type
    const result = await parseDomainResponse<T>(
      response,
      sourceType,
      domainName
    );

    if (!result) {
      return handleError(503, `Failed to fetch data from ${sourceType}`);
    }

    return result;
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

export { fetchDomainData };
