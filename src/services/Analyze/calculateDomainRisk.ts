import { VirusTotalDomain } from "../../../types/searchDomainResponse/VirusTotalDomainType";
import {
  CriminalDomainResponseType,
  reportData,
} from "../../../types/searchDomainResponse/CriminalDomainType";
import { URLVoidData } from "../../../types/searchDomainResponse/UrlVoidDomainType";
import { IsMaliciousData } from "../../../types/searchDomainResponse/IsMaliciousType";
import { NeutrinoData } from "../../../types/searchDomainResponse/NeutrinoType";

/**
 * Calculate the VirusTotal score based on the analysis stats.
 * @param virusTotalData - VirusTotal domain data
 * @returns Malicious Score + Suspicious Score - Harmless Reduction + Undetected Increase
 */
function calculateVirusTotalScore(virusTotalData: VirusTotalDomain): number {
  const vtMalicious: number = virusTotalData.last_analysis_stats.malicious || 0;
  const vtSuspicious: number =
    virusTotalData.last_analysis_stats.suspicious || 0;
  const vtHarmless: number = virusTotalData.last_analysis_stats.harmless || 0;
  const vtUndetected: number =
    virusTotalData.last_analysis_stats.undetected || 0;

  const Malicious: number = Math.min(vtMalicious * 1.5, 10);
  const Suspicious: number = Math.min(vtSuspicious * 1.0, 5);
  const harmlessReduction: number =
    vtHarmless > vtMalicious + vtSuspicious ? Math.min(vtHarmless / 10, 5) : 0;
  const undetectedIncrease: number = vtUndetected < 5 ? 2 : 0;
  return Malicious + Suspicious - harmlessReduction + undetectedIncrease;
}

/**
 * Calculate the criminal Score based on the reports.
 * @param criminalData - Criminal domain data
 * @returns returns Criminal Score based on the reports
 */
function calculateCriminalScore(
  criminalData: CriminalDomainResponseType
): number {
  type RiskLevel = "critical" | "dangerous" | "moderate" | "low" | "safe";

  const criminalMapping: Record<RiskLevel, number> = {
    critical: 10,
    dangerous: 7,
    moderate: 4,
    low: 2,
    safe: 0,
  };

  function isRiskLevel(value: string): value is RiskLevel {
    return ["critical", "dangerous", "moderate", "low", "safe"].includes(value);
  }

  const reports = criminalData.data.reports || [];
  const totalCriminalScore = reports.reduce(
    (acc: number, report: reportData) => {
      const scoreLevel = report.score?.trim().toLowerCase();
      const score = isRiskLevel(scoreLevel) ? criminalMapping[scoreLevel] : 0;
      return acc + score;
    },
    0
  );
  const criminalScore: number =
    reports.length > 0 ? totalCriminalScore / reports.length : 0;
  return criminalScore;
}

/**
 * Calculate the URLVoid Score based on the detection counts.
 * @param UrlVoidData - UrlVoid domain data
 * @returns The score based on the detection counts.
 */
function calculateUrlVoidScore(UrlVoidData: URLVoidData): number {
  return parseFloat(UrlVoidData.detectionCounts) * 10;
}

/**
 * Calculate the Neutrino Score based on the blocklists.
 * @param NeutrinoData - Neutrino domain data
 * @returns score based on the Blocklists
 */
function calculateNeutrinoScore(NeutrinoData: NeutrinoData): number {
  const blocklists = NeutrinoData.blocklists || [];
  const malwareCount = blocklists.filter(
    (item: string) => item === "malware"
  ).length;
  return malwareCount == 0 ? 0 : 1;
}

/**
 * Calculate the IsMalicious Score based on the reputation counts.
 * @param IsMaliCiousData - IsMalicious domain data
 * @returns Score based on the reputation counts.
 */
function calculateIsMaliciousScore(IsMaliCiousData: IsMaliciousData): number {
  const isMaMalicious: number = IsMaliCiousData.reputation.malicious || 0;
  const isMaSuspicious: number = IsMaliCiousData.reputation.suspicious || 0;
  const isMaHarmless: number = IsMaliCiousData.reputation.harmless || 0;
  const isMaUndetected: number = IsMaliCiousData.reputation.undetected || 0;

  const Malicious: number = Math.min(isMaMalicious * 1.5, 10);
  const Suspicious: number = Math.min(isMaSuspicious * 1.0, 5);
  const harmlessReduction: number =
    isMaHarmless > isMaMalicious + isMaSuspicious
      ? Math.min(isMaHarmless / 10, 5)
      : 0;
  const undetectedIncrease: number = isMaUndetected < 5 ? 2 : 0;
  return Malicious + Suspicious - harmlessReduction + undetectedIncrease;
}

/**
 * Calculate the raw score based on the individual Scores.
 * @param virusTotalScore VirusTotal Score
 * @param criminalScore Criminal Score
 * @param urlVoidScore urlVoid Score
 * @param neutrinoScore Neutrino Score
 * @param isMaliCiousScore isMaliCious Score
 * @returns Raw Score that combines all the scores that are calculated from the APIs
 */
function calculateRawScore(
  virusTotalScore: number,
  criminalScore: number,
  urlVoidScore: number,
  neutrinoScore: number,
  // isMaliCiousScore: number
): number {
  return (
    virusTotalScore * 0.5 +
    criminalScore * 0.3 +
    urlVoidScore * 0.2 +
    neutrinoScore * 0.1
    // isMaliCiousScore * 0.5
  );
}

/**
 * Calculate the final risk score for a domain based on various API results.
 * @param data - The data object containing the results from various APIs.
 * @returns The final risk score for the domain, ranging from 1 to 10.
 */
function calculateDomainRisk(data: {
  UrlVoidData: URLVoidData;
  virusTotalData: VirusTotalDomain;
  IsMaliCiousData: IsMaliciousData;
  CriminalData: CriminalDomainResponseType;
  NeutrinoData: NeutrinoData;
}): number {
  const virusTotalScore: number = calculateVirusTotalScore(data.virusTotalData);
  const criminalScore: number = calculateCriminalScore(data.CriminalData);
  const urlVoidScore: number = calculateUrlVoidScore(data.UrlVoidData);
  const neutrinoScore: number = calculateNeutrinoScore(data.NeutrinoData);
  // const isMaliCiousScore: number = calculateIsMaliciousScore(
  //   data.IsMaliCiousData
  // );
  const rawScore: number = calculateRawScore(
    virusTotalScore,
    criminalScore,
    urlVoidScore,
    neutrinoScore,
    // isMaliCiousScore
  );
  const roundScore: number = Math.round(Math.min(rawScore, 10) * 10) / 10;
  const finalScore: number = Math.max(roundScore, 1);
  return finalScore;
}

export { calculateDomainRisk };
