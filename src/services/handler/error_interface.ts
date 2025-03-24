import { CriminalResponseType } from "../../../types/searchIPResponse/CriminalIPType";

class AppError extends Error {
  constructor(
    public statusCode: number = 500,
    message: string,
    public source?: string,
    public details?: any
  ) {
    super(message);
    this.name = "AppError";
    Error.captureStackTrace(this, this.constructor);
  }

  static async fromApiResponse(
    response: any,
    source: string
  ): Promise<AppError> {
    switch (source) {
      case "AbuseIPDB": {
        return new AppError(
          response.status,
          `AbuseIPDB API Error: ${response.statusText || "Unknown error"}`,
          source
        );
      }
      case "VirusTotal": {
        return new AppError(
          response.status,
          `${source} API Error: ${response.statusText || "Unknown error"}`,
          source,
          response.error
        );
      }
      case "CriminalIP": {
        const Criminalresponse =
          (await response.json()) as CriminalResponseType;
        return new AppError(
          Criminalresponse.status,
          `CriminalIP API Error: ${
            Criminalresponse.message || "Unknown error"
          }`,
          source
        );
      }
      default:
        return new AppError(500, `${source} API Error: Unknown error`, source);
    }
  }
}

export { AppError };
