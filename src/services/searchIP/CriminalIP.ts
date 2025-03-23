import fetch from "node-fetch";
import { CriminalObject } from "../../../types/searchIPResponse/CriminalIPType";
import { ApiResponse } from "../../../types/ApiResponse/ApiResponse";
import { handleError } from "../handler/error_handling";
import { parseResponse } from "./../function/parseResponse/parseResponse";
import { isValidApiKey, buildUrl } from "../function/buildUrl/buildUrl";
import { generateHeaders } from "../function/generateHeaders/generateHeaders";

async function fetchCriminalReport(
  ipAddress: string,
  API_KEY: string
): Promise<CriminalObject | ApiResponse> {
  const url = buildUrl(ipAddress, "CriminalIP");
  const headers = generateHeaders(API_KEY, "CriminalIP");
  try {
    if (!isValidApiKey(API_KEY)) {
      return handleError(404, "CriminalIP API Key not found!!");
    }
    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch data. HTTP Status Code: ${response.status}`
      );
    }
    return await parseResponse<CriminalObject>(
      response,
      "CriminalIP",
      ipAddress
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      return handleError(500, `Internal Error: ${error.message}`);
    } else {
      return handleError(500, "Unknown internal error");
    }
  }
}

export { fetchCriminalReport };
