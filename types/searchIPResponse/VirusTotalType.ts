interface VirusTotalResponse {
  data: {
    id: string;
    attributes: {
      continent: string;
      reputation: number;
      total_votes: {
        harmless: number;
        malicious: number;
      };
      country: string;
      last_analysis_stats: Analysis_stats;
    };
  };
}

interface VirusTotalIPreport {
  IP_Address: string;
  Continent: string;
  Reputation: number;
  Harmless_from_VirusTotal: number;
  Malicious_from_VirusTotal: number;
  Country: string;
  Analysis_stats: Analysis_stats;
}

interface Analysis_stats {
  malicious: number;
  suspicious: number;
  undetected: number;
  harmless: number;
  timeout: number;
}

export { VirusTotalResponse, VirusTotalIPreport};
