import { Response } from "node-fetch";
import * as cheerio from "cheerio";

const scrapiingIP = async <T>(
  response: Response,
  companyName: string,
  ipAddress: string
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
    default:
      return {} as T;
  }
};

export { scrapiingIP };
