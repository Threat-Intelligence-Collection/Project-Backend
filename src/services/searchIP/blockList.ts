import { ApiResponse } from "../../../types/ApiResponse/ApiResponse";
import { BlockList } from "../../../types/searchIPResponse/blockListType";
import fetch from "node-fetch";
import { buildUrl } from "./simplifyFunction";

async function fetchBlockList(ipAddress: string) : Promise<BlockList | ApiResponse>{
  const url = buildUrl(ipAddress, "BlockList");
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch data. HTTP Status Code: ${response.status}`
      );
    }
    const htmlContent = await response.text();

    const attackMatch = htmlContent.match(/attacks:\s*(\d+)/);
    const reportsMatch = htmlContent.match(/reports:\s*(\d+)/);

    const attacks = attackMatch ? parseInt(attackMatch[1]) : 0;
    const reports = reportsMatch ? parseInt(reportsMatch[1]) : 0;

    return {
      ipAddress,
      attacks,
      reports,
    };
  } catch (error) {
    console.error("Error fetching IP info:", error);
    return {
      success: false,
      status: 503,
      message: "Fetch data failed from Blocklist.de!",
      ipAddress,
    };
  }
}

export { fetchBlockList };
