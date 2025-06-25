import { searchAssetResponse } from "../../../types/searchAssetResponse/NDV";
import { ApiResponse } from "../../../types/ApiResponse/ApiResponse";
import { Either, left, right } from "fp-ts/lib/Either";
import "dotenv/config";
import { handleError } from "../handler/error_handling";

const fetchAsset = async (
  asset: string
): Promise<Either<ApiResponse, searchAssetResponse>> => {
  const response = await fetch(
    `https://services.nvd.nist.gov/rest/json/cves/2.0?cpeName=${asset}`,
    {
      method: "GET",
      headers: {
        apiKey: process.env.NVD_API_KEY || "",
        "Content-Type": "application/json",
      },
    }
  );

  if (response.status !== 200) {
    throw new Error(`Error fetching data: ${response.statusText}`);
  }

  const data = (await response.json()) as searchAssetResponse;
  if (!data) {
    return left(handleError(503, `Failed to fetch data from NVD`));
  }

  return right(data);
};

const constructAsset = async ({
  params,
}: {
  params: {
    part: string;
    vendor: string;
    product: string;
    version: string;
    update: string;
    edition: string;
    language: string;
    sw_edition: string;
    target_sw: string;
    target_hw: string;
    other: string;
  };
}): Promise<Either<ApiResponse, string>> => {
  const cpeName = `cpe:2.3:${params.part}:${params.vendor}:${params.product}:${params.version}:${params.update}:${params.edition}:${params.language}:${params.sw_edition}:${params.target_sw}:${params.target_hw}:${params.other}`;
  const regex =
    /^cpe:2\.3:[aoh]:[^:]*:[^:]*:[^:]*:[^:]*:[^:]*:[^:]*:[^:]*:[^:]*:[^:]*:[^:]*$/;
  console.log("Constructed CPE Name:", cpeName);
  if (regex.test(cpeName)) {
    return right(cpeName);
  } else {
    return left(handleError(400, "Invalid CPE name format"));
  }
};
export { fetchAsset, constructAsset };
