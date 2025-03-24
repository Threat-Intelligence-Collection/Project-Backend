import fetch from "node-fetch";
import { ApiResponse } from "../../../types/ApiResponse/ApiResponse";
import { handleError } from "../handler/error_handling";
import { parseIPResponse } from "../function/parseResponse/parseResponse";
import {
  buildUrlForIPSearching,
  isValidApiKey,
} from "../function/buildUrl/buildUrl";
import { generateIPSearchingHeaders } from "../function/generateHeaders/generateHeaders";
import { AppError } from "../handler/error_interface";

type ResponseTypes =
  | "AbuseIPDB"
  | "BlockList"
  | "CriminalIP"
  | "DBIP"
  | "VirusTotal";

/**
 * Generalized fetch function for multiple IP reporting services
 * @param ipAddress IP address to check
 * @param sourceType Source type name
 * @param API_KEY Optional API Key
 * @returns Parsed response or ApiResponse error
 */
async function fetchIPReport<T>(
  ipAddress: string,
  sourceType: ResponseTypes,
  API_KEY?: string
): Promise<T | ApiResponse> {
  const url = buildUrlForIPSearching(ipAddress, sourceType);

  let headers: Record<string, string> | undefined;

  const sourcesRequiringApiKey: ResponseTypes[] = [
    "AbuseIPDB",
    "CriminalIP",
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

    // Check for the general HTTP status
    if (!response.ok) {
      throw AppError.fromApiResponse(response, sourceType);
    }

    const result = await parseIPResponse<T>(response, sourceType, ipAddress);

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

export { fetchIPReport };
