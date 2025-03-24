import fetch from "node-fetch";
import "dotenv/config";
import { ApiResponse } from "../../../types/ApiResponse/ApiResponse";
import { IsMaliciousData } from "../../../types/searchDomainResponse/IsMaliciousType";
import {
  buildUrlForDomainSearching,
  isValidApiKey,
  isValidApiSecret,
} from "../function/buildUrl/buildUrl";
import { handleError } from "../handler/error_handling";
import { generateDomainSearchingHeaders } from "../function/generateHeaders/generateHeaders";
import { parseDomainResponse } from "../function/parseResponse/parseResponse";
import { AppError } from "../handler/error_interface";

type ResponseTypes =
  | "CriminalIP"
  | "IsMalicious"
  | "Neutrino"
  | "UrlVoid"
  | "VirusTotal";

async function fetchIsMalicious(
  domainName: string,
  sourceType: ResponseTypes,
  API_KEY: string,
  API_SECRET: string
): Promise<IsMaliciousData | ApiResponse> {
  const URL = buildUrlForDomainSearching(domainName, sourceType);
  const userID = undefined;

  try {
    if (!API_KEY || !isValidApiKey(API_KEY)) {
      return handleError(404, `${sourceType} API Key not found!!`);
    }
    if (!API_SECRET || !isValidApiSecret(API_SECRET)) {
      return handleError(404, `${sourceType} API Secret not found!!`);
    }

    const headers = generateDomainSearchingHeaders(
      API_KEY,
      sourceType,
      userID,
      API_SECRET
    );
    const response = await fetch(URL, { headers });

    if (!response.ok) {
      throw new AppError(
        `Failed to fetch data from ${sourceType}. HTTP Status Code: ${response.status}`,
        response.status
      );
    }
    const result = await parseDomainResponse<IsMaliciousData>(
      response,
      sourceType
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
export { fetchIsMalicious };
