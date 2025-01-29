import fetch from "node-fetch";
import "dotenv/config";
import type { AbuseIPDBResponseType } from "../../types/AbuseIPDBType";

const API_KEY = process.env.ABUSE_IPDB_API_KEY || "";

async function fetchAbuseReport(ipAddress: string) {
  const url = `https://api.abuseipdb.com/api/v2/check?ipAddress=${ipAddress}&maxAgeInDays=90`;
  try {
    if (API_KEY == ""){
      return { success : false, message : "Abuse IPDB API Key not found!!"};
    }
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Key: API_KEY
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
    }
    const Abuseresponse = await response.json() as AbuseIPDBResponseType;
    const reportData = Abuseresponse.data;
    return reportData;
  } catch (error) {
    console.error("Error:", error);
    return { success : false, message : "Fetch data fail from Abuse!!"}
  }
}

export { fetchAbuseReport }