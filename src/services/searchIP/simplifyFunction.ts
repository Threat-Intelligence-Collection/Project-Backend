import { ApiResponse } from "../../../types/ApiResponse/ApiResponse";

/**
 * Error handling for fetching data from AbuseIPDB
 * @param error The error that occurs during fetching data
 * @returns object that contains status of success and error message
 */
const handleError = (error: unknown): ApiResponse => {
  console.error("Error:", error);
  return {
    success: false,
    status: 503,
    message: "Fetch data fail from AbuseIPDB!",
  };
};

export { handleError };
