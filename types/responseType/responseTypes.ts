type DomainResponseTypes =
  | "CriminalIP"
  | "IsMalicious"
  | "Neutrino"
  | "UrlVoid"
  | "VirusTotal";

type IPResponseTypes =
  | "AbuseIPDB"
  | "BlockList"
  | "CriminalIP"
  | "DBIP"
  | "VirusTotal";

type SearchType = "IP" | "Domain" | "Asset";

type ResponseTypes = DomainResponseTypes | IPResponseTypes;

export { ResponseTypes, DomainResponseTypes, IPResponseTypes, SearchType };
