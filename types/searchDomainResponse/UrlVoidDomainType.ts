interface SecurityProvider {
  name: string;
  status: "Detected" | "Nothing Found";
}

interface URLVoidData {
  website: string;
  lastAnalysis: string;
  detectionCounts: string;
  domainRegistration: string;
  ipAddress: string;
  asn: string;
  serverLocation: string;
  securityProviders: SecurityProvider[];
}

export { URLVoidData };
