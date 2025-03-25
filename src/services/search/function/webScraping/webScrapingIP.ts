import { Response } from "node-fetch";
import * as cheerio from "cheerio";

/**
 * Scraping web site that we use.
 * @param response Response that use to scraping
 * @param companyName Company that provide source
 * @param ipAddress Target IP that we want to check
 * @returns 
 */
const scraping = async <T>(
  response: Response,
  companyName: string,
  ipAddress?: string
): Promise<T> => {
  switch (companyName) {
    case "BlockList": {
      const htmlContent = await response.text();

      const attackMatch = htmlContent.match(/attacks:\s*(\d+)/);
      const reportsMatch = htmlContent.match(/reports:\s*(\d+)/);

      const attacks = attackMatch ? parseInt(attackMatch[1]) : 0;
      const reports = reportsMatch ? parseInt(reportsMatch[1]) : 0;
      return {
        ipAddress,
        attacks,
        reports,
      } as T;
    }
    case "DBIP": {
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
        const result = {
          title: ipTitle,
          riskLevel: riskLevel,
          info: infoDetails,
        };

        return result as T;
      }else {
       return {} as T; 
      }
    }
    case "UrlVoid": {
      const htmlContent = await response.text();
      const $ = cheerio.load(htmlContent);
  
      const result = {
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
        securityProviders: [] as { name: string; status: string }[],
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
          result.securityProviders.push({
            name: providerName,
            status,
          });
        }
      });

      return result as T;
    }
    default:
      return {} as T;
  }
};

export { scraping };
