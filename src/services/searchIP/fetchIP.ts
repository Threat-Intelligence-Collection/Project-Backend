import fetch from "node-fetch";
import { ApiResponse } from "../../../types/ApiResponse/ApiResponse";
import { handleError } from "../handler/error_handling";
import { parseResponse } from "../function/parseResponse/parseResponse";
import { buildUrl, isValidApiKey } from "../function/buildUrl/buildUrl";
import { generateHeaders } from "../function/generateHeaders/generateHeaders";

type ResponseTypes =
  | "VirusTotal"
  | "DBIP"
  | "CriminalIP"
  | "BlockList"
  | "AbuseIPDB";

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
  const url = buildUrl(ipAddress, sourceType);

  let headers: Record<string, string> | undefined;

  const sourcesRequiringApiKey: ResponseTypes[] = [
    "VirusTotal",
    "CriminalIP",
    "AbuseIPDB",
  ];

  if (sourcesRequiringApiKey.includes(sourceType)) {
    if (!API_KEY || !isValidApiKey(API_KEY)) {
      return handleError(404, `${sourceType} API Key not found!!`);
    }
    headers = generateHeaders(API_KEY, sourceType);
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

    const result = await parseResponse<T>(response, sourceType, ipAddress);

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

export { fetchIPReport };