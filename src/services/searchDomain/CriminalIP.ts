import fetch from "node-fetch";
import "dotenv/config";
import { CriminalDomainResponseType } from "../../../types/searchDomainResponse/CriminalDomainType";
import { ApiResponse } from "../../../types/ApiResponse/ApiResponse";
import {
  buildUrlForDomainSearching,
  isValidApiKey,
} from "../function/buildUrl/buildUrl";
import { generateDomainSearchingHeaders } from "../function/generateHeaders/generateHeaders";
import { handleError } from "../handler/error_handling";
import { parseDomainResponse } from "../function/parseResponse/parseResponse";
import { AppError } from "../handler/error_interface";

type ResponseTypes =
  | "CriminalIP"
  | "IsMalicious"
  | "Neutrino"
  | "UrlVoid"
  | "VirusTotal";

async function fetchCriminalDomainReport(
  domainName: string,
  sourceType: ResponseTypes,
  API_KEY: string
): Promise<CriminalDomainResponseType | ApiResponse> {
  const url = buildUrlForDomainSearching(domainName, sourceType);
  const headers = generateDomainSearchingHeaders(API_KEY, sourceType);
  try {
    if (!API_KEY || !isValidApiKey(API_KEY)) {
      return handleError(404, `${sourceType} API Key not found!!`);
    }
    const response = await fetch(url, {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      throw new AppError(
        `Failed to fetch data from ${sourceType}. HTTP Status Code: ${response.status}`,
        response.status
      );
    }
    const result = await parseDomainResponse<CriminalDomainResponseType>(
      response,
      sourceType
    );
    if (
      sourceType === "CriminalIP" &&
      result &&
      (result as any).status !== 200
    ) {
      throw new AppError(
        `Failed to fetch data from ${sourceType}. API status: ${
          (result as any).status
        } Message: ${(result as any).message}`,
        (result as any).status
      );
    }
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

export { fetchCriminalDomainReport };
