import { CriminalResponseType } from "../../../types/searchIPResponse/CriminalIPType";

class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public source?: string,
    public details?: any
  ) {
    super(message);
    this.name = "AppError";
    Error.captureStackTrace(this, this.constructor);
  }

  static async fromApiResponse(response: any, source: string): Promise<AppError> {
    switch (source) {
      case "AbuseIPDB": {
        return new AppError(
          `AbuseIPDB API Error: ${response.statusText || "Unknown error"}`,
          response.status,
          source
        );
      }
      case "VirusTotal": {
          return new AppError(
            `${source} API Error: ${response.statusText || "Unknown error"}`,
            response.status,
            source,
            response.error
          );
        }
      case "CriminalIP": {
        const Criminalresponse = (await response.json()) as CriminalResponseType;
        return new AppError(
          `CriminalIP API Error: ${Criminalresponse.message || "Unknown error"}`,
          Criminalresponse.status,
          source
        );
      }
      default:
        return new AppError(`${source} API Error: Unknown error`, 500, source);
    }
  }
}

export { AppError };