import fetch from "node-fetch";
import "dotenv/config";
import { VirusTotalDomain, VirusTotalDomainResponseType } from "../../../types/searchDomainResponse/VirusTotalDomainType";

const API_KEY = process.env.VIRUS_TOTAL_API_KEY || "";

const headers = {
  "x-apikey": API_KEY,
};

async function fetchVirusTotalDomainData(domainName: string) {
  const URL = `https://www.virustotal.com/api/v3/domains/${domainName}`;
  try {
    if (API_KEY == "") {
      return { success: false, message: "Virus total API Key not found!!" };
    }
    const response = await fetch(URL, { headers });
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const VirusTotalresponse = (await response.json()) as VirusTotalDomainResponseType;
    const filteredData : VirusTotalDomain = {
        domainName : domainName,
        last_analysis_stats : VirusTotalresponse.data.attributes.last_analysis_stats
    }

    return filteredData;
  } catch (error) {
    console.error("Error fetching VirusTotal data:", error);
  }
}
fetchVirusTotalDomainData("sodiumlaurethsulfatedesyroyer.com")
export { fetchVirusTotalDomainData };
