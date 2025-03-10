import fetch from "node-fetch";
import "dotenv/config";
import {
  CriminalResponseType,
  CriminalObject,
} from "../../../types/searchIPResponse/CriminalIPType";
import { ApiResponse } from "../../../types/ApiResponse/ApiResponse";

const API_KEY = process.env.CRIMINAL_IP_API_KEY || "";

async function fetchCriminalReport(ipAddress: string) : Promise <CriminalObject | ApiResponse> {
  const url = `https://api.criminalip.io/v1/asset/ip/report?ip=${ipAddress}`;
  try {
    if (API_KEY == "") {
      return { success: false, message: "Abuse IPDB API Key not found!!" };
    }
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "x-api-key": API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch data: ${response.status} ${response.statusText}`
      );
    }
    const Criminalresponse = (await response.json()) as CriminalResponseType;

    const result: CriminalObject = {
      ip: Criminalresponse.ip,
      score: Criminalresponse.score,
      whois: Criminalresponse.whois,
    };

    return result;
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: "Fetch data fail from Abuse!!" };
  }
}

export { fetchCriminalReport };
