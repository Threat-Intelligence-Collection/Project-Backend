interface searchAssetResponse {
  resultsPerPage: number;
  startIndex: number;
  totalResults: number;
  format: string;
  version: string;
  timestamp: string;
  vulnerabilities: cve_data[];
}

interface cve_data {
  id: string;
  sourceIdentifier: string;
  published: string;
  lastModified: string;
  cveTags: string[];
  descriptions: description[];
  metrics: {
    cvssMetricV31?: cvssMetricV31[];
    cvssMetricV2?: cvssMetricV2[];
  };
  weaknesses: weakness[];
  configurations: configuration[];
  references: reference[];
}

interface description {
  lang: string;
  value: string;
}

interface cvssMetricV31 {
  source: string;
  type: string;
  cvssData: {
    version: string;
    vectorString: string;
    baseScore: number;
    baseSeverity: string;
    attackVector: string;
    attackComplexity: string;
    privilegesRequired: string;
    userInteraction: string;
    scope: string;
    confidentialityImpact: string;
    integrityImpact: string;
    availabilityImpact: string;
  };
  exploitabilityScore: number;
  impactScore: number;
}

interface cvssMetricV2 {
  source: string;
  type: string;
  cvssData: {
    version: string;
    vectorString: string;
    baseScore: number;
    baseSeverity: string;
    attackVector: string;
    attackComplexity: string;
    privilegesRequired: string;
    userInteraction: string;
    scope: string;
    confidentialityImpact: string;
    integrityImpact: string;
    availabilityImpact: string;
  };
  baseSevirity: string;
  exploitabilityScore: number;
  impactScore: number;
  acInsufInfo: boolean;
  obtainAllPrivilege: boolean;
  obtainUserPrivilege: boolean;
  obtainOtherPrivilege: boolean;
  userInteractionRequired: boolean;
}

interface weakness {
  source: string;
  type: string;
  description: description[];
}

interface configuration {
    operator: string;
    nodes: node[];
}

interface node {
    operator: string;
    negate: boolean;
    cpeMatch: cpeMatch[];
}

interface cpeMatch {
    vulnerable: boolean;
    criteria: string;
    versionStartIncluding: string;
    versionEndExcluding: string;
    matchCriteriaId: string;
}

interface reference {
    url: string;
    source: string;
    tags: string[];
}
export { searchAssetResponse };
