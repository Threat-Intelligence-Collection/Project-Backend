import fetch from "node-fetch";
import * as cheerio from "cheerio";
import { ApiResponse } from "../../../types/ApiResponse/ApiResponse";
import type { URLVoidData } from "../../../types/searchDomainResponse/UrlVoidDomainType";

async function fetchUrlVoid(
  domainname: string
): Promise<URLVoidData | ApiResponse> {
  const url = `https://www.urlvoid.com/scan/${domainname}/`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch data. HTTP Status Code: ${response.status}`
      );
    }

    const htmlContent = await response.text();
    const $ = cheerio.load(htmlContent);

    const data: URLVoidData = {
      website: $("td:contains('Website Address')").next().text().trim(),
      lastAnalysis: $("td:contains('Last Analysis')")
        .next()
        .text()
        .trim()
        .split("|")[0]
        .trim(),
      detectionCounts: $("td:contains('Detections Counts')")
        .next()
        .text()
        .trim(),
      domainRegistration: $("td:contains('Domain Registration')")
        .next()
        .text()
        .trim(),
      ipAddress: $("td:contains('IP Address')")
        .next()
        .find("strong")
        .text()
        .trim(),
      asn: $("td:contains('ASN')").next().text().trim(),
      serverLocation: $("td:contains('Server Location')").next().text().trim(),
      securityProviders: [],
    };

    $("tbody tr").each((_, element) => {
      const providerName = $(element)
        .find("td:first-child span.font-bold")
        .text()
        .trim();
      if (providerName) {
        const statusElement = $(element).find("td:nth-child(2) span");
        const status = statusElement.hasClass("text-danger")
          ? "Detected"
          : "Nothing Found";
        data.securityProviders.push({
          name: providerName,
          status,
        });
      }
    });
    if (data) {
      return data;
    } else {
      return {
        success: false,
        message: "Info not found",
      };
    }
  } catch (error) {
    console.error("Error fetching URLVoid data:", error);
    return { success: false, message: "Failed to fetch data from URLVoid!" };
  }
}
export { fetchUrlVoid };
