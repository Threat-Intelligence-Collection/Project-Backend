/**
 * Generate headers for fetching data from AbuseIPDB
 * @param ipAddress Generate headers for fetching data from AbuseIPDB
 * @returns Headers for fetching data from AbuseIPDBs
 */
const generateHeaders = (
  apikey: string,
  companyName: string
): Record<string, string> => {
  switch (companyName) {
    case "AbuseIPDB":
      return {
        Accept: "application/json",
        Key: apikey,
      };
    case "CriminalIP":
      return {
        Accept: "application/json",
        "x-api-key": apikey,
      };
    case "VirusTotal":
      return {
        "x-apikey": apikey,
      };
    default:
      return {};
  }
};

export { generateHeaders };
