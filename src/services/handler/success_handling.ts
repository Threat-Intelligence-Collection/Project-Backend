import { ApiResponse } from "../../../types/ApiResponse/ApiResponse";

/**
 * Error handling for fetching data from AbuseIPDB
 * @param status The status code of the response
 * @param message The success message that occurs during fetching data
 * @returns object that contains status of success and error message
 */
const handleSuccess = (status: number, message: string): ApiResponse => {
  return {
    success: true,
    status: status,
    message: message,
  };
};

export { handleSuccess };