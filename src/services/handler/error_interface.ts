class AppError extends Error {
  constructor(
    public statusCode: number = 500,
    message: string,
  ) {
    super(message);
    this.name = "AppError";
    Error.captureStackTrace(this, this.constructor);
  }

  static async fromApiResponse(response: any, source: string): Promise<AppError> {
    return new AppError(
      response.status,
      `${source} API Error: ${response.statusText || "Unknown error"}`,
    );
  }
}

export { AppError };
