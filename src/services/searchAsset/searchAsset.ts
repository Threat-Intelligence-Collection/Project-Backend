import { searchAssetResponse } from "../../../types/searchAssetResponse/NDV";
import { ApiResponse } from "../../../types/ApiResponse/ApiResponse";
import { Either, left, right } from "fp-ts/lib/Either";
import "dotenv/config";
import { handleError } from "../handler/error_handling";

const fetchAsset = async (asset: string) : Promise<Either<ApiResponse, searchAssetResponse>> => {
    const response = await fetch(`https://services.nvd.nist.gov/rest/json/cves/2.0?keywordSearch=${asset}`, {
        method: "GET",
        headers: {
        "apiKey": process.env.NVD_API_KEY || "",
        "Content-Type": "application/json",
        },
    });
    
    if(response.status !== 200){
        throw new Error(`Error fetching data: ${response.statusText}`);
    }
    
    const data = await response.json() as searchAssetResponse;
    if (!data) {
        return left(handleError(503, `Failed to fetch data from NVD`));
      }
  
    return right(data);
}

export { fetchAsset };