import { ApiResponse } from "../../../types/ApiResponse/ApiResponse";
import { BlockList } from "../../../types/searchIPResponse/blockListType";
import fetch from "node-fetch";
import { buildUrl } from "../function/buildUrl/buildUrl";
import { parseResponse } from "../function/parseResponse/parseResponse";
import { handleError } from "../handler/error_handling";

/**
 * Fetch data from BlockList
 * @param ipAddress ipaddress that we want to check
 * @returns Blocklist data or API response
 */

async function fetchBlockList(
  ipAddress: string
): Promise<BlockList | ApiResponse> {
  const url = buildUrl(ipAddress, "BlockList");
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch data. HTTP Status Code: ${response.status}`
      );
    }
    return await parseResponse<BlockList>(response, "BlockList", ipAddress);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return handleError(500, `Internal Error: ${error.message}`);
    } else {
      return handleError(500, "Unknown internal error");
    }
  }
}

export { fetchBlockList };
