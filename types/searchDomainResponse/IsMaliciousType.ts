interface Source {
  status: string;
  name: string;
  type: string;
  category: string;
  url: string;
}

interface Reputation {
  malicious: number;
  suspicious: number;
  undetected: number;
  harmless: number;
  timeout: number;
}

interface Datacenter {
  datacenter: string;
  domain: string;
  network: string;
}

interface Company {
  name: string;
  abuser_score: string;
  domain: string;
  type: string;
  network: string;
  whois: string;
}

interface ASN {
  asn: number;
  abuser_score: string;
  route: string;
  descr: string;
  country: string;
  active: boolean;
  org: string;
  domain: string;
  abuse: string;
  type: string;
  created: string;
  updated: string;
  rir: string;
  whois: string;
}

interface Location {
  is_eu_member: boolean;
  calling_code: string;
  currency_code: string;
  continent: string;
  country: string;
  country_code: string;
  state: string;
  city: string;
  latitude: number;
  longitude: number;
  zip: string;
  timezone: string;
  local_time: string;
  local_time_unix: number;
  is_dst: boolean;
}

interface Whois {
  ip: string;
  rir: string;
  is_bogon: boolean;
  is_mobile: boolean;
  is_satellite: boolean;
  is_crawler: boolean;
  is_datacenter: boolean;
  is_tor: boolean;
  is_proxy: boolean;
  is_vpn: boolean;
  is_abuser: boolean;
  datacenter: Datacenter;
  company: Company;
  asn: ASN;
  location: Location;
  elapsed_ms: number;
}

interface Geo {
  status: string;
  message: string;
  query: string;
}

interface Certificate {
  issuer_ca_id: number;
  issuer_name: string;
  common_name: string;
  name_value: string;
  id: number;
  entry_timestamp: string;
  not_before: string;
  not_after: string;
  serial_number: string;
  result_count: number;
}

interface SimilarDomains {
  total_hits: number;
  keywords: string;
  hits: string[];
}

interface IsMaliciousData {
  sources: Source[];
  type: string;
  value: string;
  malicious: boolean;
  reputation: Reputation;
  whois: Whois;
  geo: Geo;
  certificates: Certificate[];
  similar_domains: SimilarDomains;
}

export { IsMaliciousData };
