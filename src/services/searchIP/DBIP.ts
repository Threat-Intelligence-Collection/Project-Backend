import fetch from "node-fetch";
import { IPInfo } from "../../../types/searchIPResponse/DBIPType";
import { ApiResponse } from "../../../types/ApiResponse/ApiResponse";
import { buildUrl } from "../function/buildUrl/buildUrl";
import { parseResponse } from "../function/parseResponse/parseResponse";
import { handleError } from "../handler/error_handling";
async function fetchDBIP(ipAddress: string): Promise<IPInfo | ApiResponse> {
  const url = buildUrl(ipAddress, "DBIP");
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch data. HTTP Status Code: ${response.status}`
      );
    }
    const result = await parseResponse<IPInfo>(response, "DBIP", ipAddress);
    if (result == null) {
      return handleError(503, "Failed to fetch data from DBIP");
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

export { fetchDBIP };
