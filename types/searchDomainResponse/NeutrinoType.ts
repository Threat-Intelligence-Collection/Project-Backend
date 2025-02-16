export interface Sensor {
  blocklist: string;
  description: string;
  id: number;
}

export interface NeutrinoData {
  fqdn: string;
  "dns-provider": string;
  blocklists: string[];
  "mail-provider": string;
  tld: string;
  "is-adult": boolean;
  "registered-date": string;
  valid: boolean;
  "tld-cc": string;
  sensors: Sensor[];
  "is-pending": boolean;
  domain: string;
  rank: number;
  "registrar-id": number;
  "is-malicious": boolean;
  "is-gov": boolean;
  "is-opennic": boolean;
  "is-subdomain": boolean;
  age: number;
  "registrar-name": string;
}
