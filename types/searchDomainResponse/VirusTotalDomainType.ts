interface last_analysis_stats {
  malicious: number;
  suspicious: number;
  undetected: number;
  harmless: number;
  timeout: number;
}

interface VirusTotalDomain {
    domainName : string,
    last_analysis_stats : last_analysis_stats
} 

interface VirusTotalDomainResponseType {
  data: {
    attributes : {
        last_analysis_stats : last_analysis_stats
    }
  };
}

export { VirusTotalDomainResponseType, VirusTotalDomain }