import { ApiResponse } from "../../../types/ApiResponse/ApiResponse";
import { BlockList } from "../../../types/searchIPResponse/blockListType";
import fetch from "node-fetch";

async function fetchBlockList(ipAddress: string) : Promise<BlockList | ApiResponse>{
  const url = `http://api.blocklist.de/api.php?ip=${ipAddress}&start=1`;
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
      message: "Fetch data failed from Blocklist.de!",
      ipAddress,
    };
  }
}

export { fetchBlockList };
