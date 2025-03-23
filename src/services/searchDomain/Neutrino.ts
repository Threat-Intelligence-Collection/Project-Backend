import fetch from "node-fetch";
import "dotenv/config";
import { ApiResponse } from "../../../types/ApiResponse/ApiResponse";
import { NeutrinoData } from "../../../types/searchDomainResponse/NeutrinoType"

const API_KEY = process.env.NEUTRINO_API_KEY || "";
const USER_ID = process.env.NEUTRINO_USER_ID || "";

const headers = {
  "User-ID": USER_ID,
  "API-Key": API_KEY,
  "Content-Type": "application/x-www-form-urlencoded",
};

async function fetchNeutrino(domainName: string): Promise<NeutrinoData | ApiResponse> {
  const URL = "https://neutrinoapi.net/domain-lookup";
  const formData = new URLSearchParams();
  formData.append("host", domainName);
  formData.append("live", "true");

  if (!API_KEY || !USER_ID) {
    throw new Error("API credentials are not configured");
  }

  try {
    const response = await fetch(URL, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const result = await response.json() as NeutrinoData;
    if(result){
      return result
    }else{
      return {
        success: false,
        status: 503,
        message: "Data fetched failed",
      };
    }
  } catch (error) {
    console.error("Error fetching domain lookup data:", error);
    return {
      success: false,
      status: 503,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
fetchNeutrino("werdotx.shop");

export { fetchNeutrino };
