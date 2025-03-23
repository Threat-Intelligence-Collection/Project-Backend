import fetch from "node-fetch";
import { CriminalObject } from "../../../types/searchIPResponse/CriminalIPType";
import { ApiResponse } from "../../../types/ApiResponse/ApiResponse";
import { handleError } from "./simplifyFunction";
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
      return {
        success: false,
        status: 404,
        message: "Criminal IP API Key not found!!",
      };
    }
    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      return handleError(
        `Failed to fetch data: ${response.status} - ${response.statusText}`
      );
    }
    return await parseResponse<CriminalObject>(response, "CriminalIP");
  } catch (error) {
    return handleError(error);
  }
}

export { fetchCriminalReport };
