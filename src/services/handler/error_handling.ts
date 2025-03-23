import { ApiResponse } from "../../../types/ApiResponse/ApiResponse";

/**
 * Error handling for fetching data from AbuseIPDB
 * @param status The status code of the response
 * @param message The error message that occurs during fetching data
 * @returns object that contains status of success and error message
 */
const handleError = (status: number, message: string): ApiResponse => {
  return {
    success: false,
    status: status,
    message: message,
  };
};

export { handleError };