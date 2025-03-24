/**
 * Check API key is valid or not
 * @param key is an API key of AbuseIPDB
 * @returns boolean that indicates key is valid or not
 */
const isValidApiKey = (key: string): boolean => key.trim() !== "";

/**
 * Check API key is valid or not
 * @param key is an API key of AbuseIPDB
 * @returns boolean that indicates key is valid or not
 */
const isValidApiSecret = (key: string): boolean => key.trim() !== "";

/**
 * Build the URL for fetching data from provider url
 * @param ipAddress is an IP address that we want to check
 * @param companyName is a name of the company that we want to check
 * @param maxAgeInDays is number of days that we want to check the IP address
 * @returns URL for fetching data from provider
 */
const buildUrlForIPSearching = (
  ipAddress: string,
  companyName: string,
  maxAgeInDays: number = 90
): string => {
  switch (companyName) {
    case "AbuseIPDB":
      return `https://api.abuseipdb.com/api/v2/check?ipAddress=${ipAddress}&maxAgeInDays=${maxAgeInDays}`;
    case "BlockList":
      return `http://api.blocklist.de/api.php?ip=${ipAddress}&start=1`;
    case "CriminalIP":
      return `https://api.criminalip.io/v1/asset/ip/report?ip=${ipAddress}`;
    case "DBIP":
      return `https://db-ip.com/${ipAddress}`;
    case "VirusTotal":
      return `https://www.virustotal.com/api/v3/ip_addresses/${ipAddress}`;
    default:
      return "";
  }
};

const buildUrlForDomainSearching = (
  domainName: string,
  companyName: string
): string => {
  switch (companyName) {
    case "CriminalIP":
      return `https://api.criminalip.io/v1/domain/reports?query=${domainName}&offset=0`;
    case "IsMalicious":
      return `https://ismalicious.com/api/check?query=${domainName}`;
    case "Neutrino":
      return `https://neutrinoapi.net/domain-lookup`;
    case "UrlVoid":
      return `https://www.urlvoid.com/scan/${domainName}/`;
    case "VirusTotal":
      return `https://www.virustotal.com/api/v3/domains/${domainName}`;
    default:
      return "";
  }
};

export {
  buildUrlForIPSearching,
  buildUrlForDomainSearching,
  isValidApiKey,
  isValidApiSecret,
};
