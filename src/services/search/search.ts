import fetch, { Response } from "node-fetch";
import "dotenv/config";
import { Either, left, right } from "fp-ts/lib/Either";
import { ApiResponse } from "../../../types/ApiResponse/ApiResponse";
import {
  buildUrlForDomainSearching,
  buildUrlForIPSearching,
  isValidApiKey,
  isValidApiSecret,
} from "../function/buildUrl/buildUrl";
import {
  generateDomainSearchingHeaders,
  generateIPSearchingHeaders,
} from "../function/generateHeaders/generateHeaders";
import {
  parseDomainResponse,
  parseIPResponse,
} from "../function/parseResponse/parseResponse";
import { AppError } from "../handler/error_interface";
import { handleError } from "../handler/error_handling";
import {
  ResponseTypes,
  DomainResponseTypes,
  IPResponseTypes,
  SearchType,
} from "../../../types/responseType/responseTypes";

const domainSourcesRequiringApiKey: DomainResponseTypes[] = [
  "CriminalIP",
  "IsMalicious",
  "Neutrino",
  "VirusTotal",
];

const ipSourcesRequiringApiKey: IPResponseTypes[] = [
  "AbuseIPDB",
  "CriminalIP",
  "VirusTotal",
];

const validateKey = (
  sourceType: ResponseTypes,
  API_KEY?: string,
  API_SECRET?: string,
  USER_ID?: string
): Either<ApiResponse, Record<string, string> | undefined> => {
  const isDomainSource = (domainSourcesRequiringApiKey as string[]).includes(
    sourceType
  );
  const isIpSource = (ipSourcesRequiringApiKey as string[]).includes(
    sourceType
  );

  if (isDomainSource || isIpSource) {
    if (!API_KEY || !isValidApiKey(API_KEY)) {
      return left(handleError(404, `${sourceType} API Key not found!!`));
    }

    if (
      sourceType === "IsMalicious" &&
      (!API_SECRET || !isValidApiSecret(API_SECRET))
    ) {
      return left(handleError(404, `${sourceType} API Secret not found!!`));
    }

    if (sourceType === "Neutrino" && (!USER_ID || !isValidApiSecret(USER_ID))) {
      return left(handleError(404, `${sourceType} User ID not found!!`));
    }

    // Generate headers based on source type
    return isDomainSource
      ? right(
          generateDomainSearchingHeaders(
            API_KEY,
            sourceType,
            USER_ID,
            API_SECRET
          )
        )
      : right(generateIPSearchingHeaders(API_KEY, sourceType));
  }

  return right(undefined);
};

const fetchData = async (
  url: string,
  sourceType: ResponseTypes,
  headers?: Record<string, string>,
  domainName?: string
): Promise<Either<ApiResponse, Response>> => {
  try {
    const method = sourceType === "Neutrino" ? "POST" : "GET";
    const body =
      sourceType === "Neutrino"
        ? new URLSearchParams({ host: domainName ?? "", live: "true" })
        : undefined;

    const response = await fetch(url, {
      method,
      headers,
      body,
    });
    if (!response.ok) {
      const error = await AppError.fromApiResponse(response, sourceType);
      return left(handleError(error.statusCode, error.message));
    }

    return right(response);
  } catch (error) {
    return left(
      handleError(
        500,
        error instanceof Error
          ? `Internal Error: ${error.message}`
          : "Unknown internal error"
      )
    );
  }
};

async function fetchSearchData<T>(
  searchType: SearchType,
  searchTarget: string,
  sourceType: ResponseTypes,
  API_KEY?: string,
  API_SECRET?: string,
  USER_ID?: string
): Promise<Either<ApiResponse, T>> {
  try {
    const url =
      searchType == "Domain"
        ? buildUrlForDomainSearching(searchTarget, sourceType)
        : buildUrlForIPSearching(searchTarget, sourceType);

    const headersResult = validateKey(sourceType, API_KEY, API_SECRET, USER_ID);

    if (headersResult._tag === "Left") return headersResult;

    const responseResult = await fetchData(
      url,
      sourceType,
      headersResult.right,
      sourceType === "Neutrino" ? searchTarget : undefined
    );

    if (responseResult._tag === "Left") return responseResult;

    const result = await (searchType == "Domain"
      ? parseDomainResponse<T>
      : parseIPResponse<T>)(responseResult.right, sourceType, searchTarget);

    if (!result) {
      return left(handleError(503, `Failed to fetch data from ${sourceType}`));
    }

    return right(result);
  } catch (error) {
    return left(
      handleError(
        500,
        error instanceof Error
          ? `Internal Error: ${error.message}`
          : "Unknown internal error"
      )
    );
  }
}

export { fetchSearchData };
