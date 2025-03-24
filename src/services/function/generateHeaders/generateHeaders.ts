/**
 * Generate headers for fetching data from AbuseIPDB
 * @param ipAddress Generate headers for fetching data from AbuseIPDB
 * @returns Headers for fetching data from AbuseIPDBs
 */
const generateIPSearchingHeaders = (
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

const generateDomainSearchingHeaders = (
  apiKey: string,
  companyName: string,
  userID?: string,
  apiSecret?: string
): Record<string, string> => {
  switch (companyName) {
    case "CriminalIP":
      return {
        Accept: "application/json",
        "x-api-key": apiKey,
      };
    case "IsMalicious":
      const authString = `${apiKey}:${apiSecret}`;
      const encodedAuth = Buffer.from(authString).toString("base64");
      return {
        "X-API-KEY": encodedAuth,
      };
    case "Neutrino":
      return {
        "User-ID": userID ?? "",
        "API-Key": apiKey,
        "Content-Type": "application/x-www-form-urlencoded",
      };
    case "VirusTotal":
      return {
        "x-apikey": apiKey,
      };
    default:
      return {};
  }
};

export { generateIPSearchingHeaders, generateDomainSearchingHeaders };
