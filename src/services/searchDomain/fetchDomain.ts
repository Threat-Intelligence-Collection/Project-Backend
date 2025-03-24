import fetch from "node-fetch";
import { ApiResponse } from "../../../types/ApiResponse/ApiResponse";
import { handleError } from "../handler/error_handling";
import { parseDomainResponse } from "../function/parseResponse/parseResponse";
import {
  buildUrlForDomainSearching,
  isValidApiKey,
} from "../function/buildUrl/buildUrl";
import { generateIPSearchingHeaders } from "../function/generateHeaders/generateHeaders";

type ResponseTypes =
  | "CriminalIP"
  | "IsMalicious"
  | "Neutrino"
  | "UrlVoid"
  | "VirusTotal";

/**
 * Generalized fetch function for multiple IP reporting services
 * @param domainName Domain name to check
 * @param sourceType Source type name
 * @param API_KEY Optional API Key
 * @returns Parsed response or ApiResponse error
 */
async function fetchDomainReport<T>(
  ipAddress: string,
  sourceType: ResponseTypes,
  API_KEY?: string
): Promise<T | ApiResponse> {
  const url = buildUrlForDomainSearching(ipAddress, sourceType);

  let headers: Record<string, string> | undefined;

  const sourcesRequiringApiKey: ResponseTypes[] = [
    "CriminalIP",
    "IsMalicious",
    "Neutrino",
    "VirusTotal",
  ];

  if (sourcesRequiringApiKey.includes(sourceType)) {
    if (!API_KEY || !isValidApiKey(API_KEY)) {
      return handleError(404, `${sourceType} API Key not found!!`);
    }
    headers = generateIPSearchingHeaders(API_KEY, sourceType);
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch data. HTTP Status Code: ${response.status}`
      );
    }

    const result = await parseDomainResponse<T>(response, sourceType);

    if (!result) {
      return handleError(503, `Failed to fetch data from ${sourceType}`);
    }

    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return handleError(500, `Internal Error: ${error.message}`);
    } else {
      return handleError(500, "Unknown internal error");
    }
  }
}

export { fetchDomainReport };
