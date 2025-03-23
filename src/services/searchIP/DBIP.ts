import fetch from "node-fetch";
import * as cheerio from "cheerio";
import { IPInfo } from "../../../types/searchIPResponse/DBIPType";
import { ApiResponse } from "../../../types/ApiResponse/ApiResponse";
import { buildUrl } from "./simplifyFunction";
async function fetchDBIP(
  ipAddress: string
): Promise<IPInfo | ApiResponse> {
  const url = buildUrl(ipAddress, "DBIP");
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch data. HTTP Status Code: ${response.status}`
      );
    }
    const htmlContent = await response.text();
    const $ = cheerio.load(htmlContent);

    const ipTitle = $("h1.main").text().trim();
    const riskLevel = $("span.label.badge-danger").text().trim();
    const infoTable = $("table.table.light");

    const infoDetails: { [key: string]: string } = {};

    if (infoTable.length) {
      infoTable.find("tr").each((_index, row) => {
        const header = $(row).find("th").text().trim();
        const data = $(row).find("td").text().trim();
        if (header && data) {
          infoDetails[header] = data;
        }
      });
      const result: IPInfo = {
        title: ipTitle,
        riskLevel: riskLevel,
        info: infoDetails,
      };

      return result;
    } else {
      return { success: false, status:404, message: "Info not found!" };
    }
  } catch (error) {
    console.error("Error fetching IP info:", error);
    return { success: false, status: 503, message: "Fetch data fail from DBIP!" };
  }
}

export { fetchDBIP };
