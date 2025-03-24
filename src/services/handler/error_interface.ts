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

  static fromApiResponse(response: any, source: string): AppError {
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
        return new AppError(
          `CriminalIP API Error: ${response.message || "Unknown error"}`,
          response.status,
          source
        );
      }
      default:
        return new AppError(`${source} API Error: Unknown error`, 500, source);
    }
  }
}

export { AppError };