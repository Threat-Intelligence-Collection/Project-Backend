import { AbuseIPObject } from "../../../types/searchIPResponse/AbuseIPDBType";
import { BlockList } from "../../../types/searchIPResponse/blockListType";
import { CriminalObject } from "../../../types/searchIPResponse/CriminalIPType";
import { IPInfo } from "../../../types/searchIPResponse/DBIPType";
import { VirusTotalIPreport } from "../../../types/searchIPResponse/VirusTotalType";

/**
 * Calculate AbuseIPDB score based on the AbuseIPDB data.
 * @param abuseData - AbuseIPDB data
 * @returns AbuseIPDB Score based on confidence and total reports values.
 */
function calculateAbuseIPScore(abuseData: AbuseIPObject): number {
  const confidentScore = abuseData.abuseConfidenceScore / 10;
  const totalReports = Math.min(abuseData.totalReports / 500, 10);

  return confidentScore * 0.4 + totalReports * 0.2;
}

/**
 * Calculate virusTotal Score based on the analysis stats.
 * @param virusTotalData - VirusTotal data
 * @returns VirusTotal Score based on reputaion, malicious, and suspicious values.
 */
function calculateVirusTotalScore(virusTotalData: VirusTotalIPreport): number {
  const vtReputation = Math.max(-virusTotalData.Reputation / 10, 0);
  const vtMalicious = Math.min(virusTotalData.Analysis_stats.malicious / 5, 10);
  const vtSuspicious = Math.min(
    virusTotalData.Analysis_stats.suspicious / 3,
    10
  );
  return vtReputation * 0.1 + vtMalicious * 0.2 + vtSuspicious * 0.1;
}

/**
 * Calculate DBIP score based on the risk level.
 * @param dbipScore - DBIP data
 * @returns DBIP Score based on risk level.
 */
function calculateDBIPScore(dbipScore: IPInfo): number {
  const dbipRiskLevel = dbipScore.riskLevel === "High" ? 10 : 0;
  return dbipRiskLevel * 0.3;
}

/**
 * Calculate BlockList Score based on attacks and reports values.
 * @param BlockListData - BlockList data
 * @returns BlockList Score based on attacks and reports values.
 */
function calculateBlockListScore(BlockListData: BlockList): number {
  const BLDattack = Math.min(BlockListData.attacks / 1000, 10);
  const BLDreport = Math.min(BlockListData.reports / 100, 10);
  return BLDattack * 0.2 + BLDreport * 0.1;
}

/**
 * Calculate Criminal Score based on inbound and outbound values.
 * @param CriminalData - Criminal data
 * @returns Criminal Score based on inbound and outbound values.
 */
function calculateCriminalScore(CriminalData: CriminalObject): number {
  type RiskLevel = "critical" | "dangerous" | "moderate" | "low" | "safe";

  const criminalInbound: Record<RiskLevel, number> = {
    critical: 10,
    dangerous: 7,
    moderate: 4,
    low: 2,
    safe: 0,
  };

  const criminalOutbound: Record<RiskLevel, number> = {
    critical: 8,
    dangerous: 6,
    moderate: 3,
    low: 1,
    safe: 0,
  };

  function isRiskLevel(value: any): value is RiskLevel {
    return ["critical", "dangerous", "moderate", "low", "safe"].includes(value);
  }

  const inbound = CriminalData.score.inbound?.trim().toLowerCase();
  const outbound = CriminalData.score.outbound?.trim().toLowerCase();

  const inboundScore = isRiskLevel(inbound) ? criminalInbound[inbound] : 0;
  const outboundScore = isRiskLevel(outbound) ? criminalOutbound[outbound] : 0;

  const maxInorOut = Math.max(inboundScore, outboundScore);
  return maxInorOut * 0.3;
}

/**
 * Calculate the final score based on all scores.
 * @param AbuseIPScore AbuseIPDB score
 * @param virusTotalScore VirusTotal score
 * @param dbipScore DBIP score
 * @param criminalScore Criminal score
 * @param blockListScore BlockList score
 * @returns Final score based on the sum of all Scores.
 */
function calculateFinalScore(
  AbuseIPScore: number,
  virusTotalScore: number,
  dbipScore: number,
  criminalScore: number,
  blockListScore: number
): number {
  return (
    AbuseIPScore + virusTotalScore + dbipScore + criminalScore + blockListScore
  );
}

/**
 * Calculate the IP risk score based on various data sources.
 * @param data - Object containing data from various sources.
 * @returns IP Risk score based on the analysis of the data from various sources APIs.
 */
function calculateIPRisk(data: {
  abuseData: AbuseIPObject;
  virusTotalData: VirusTotalIPreport;
  DBIPData: IPInfo;
  CriminalData: CriminalObject;
  BlockListData: BlockList;
}): number {
  const AbuseIPScore = calculateAbuseIPScore(data.abuseData);
  const virusTotalScore = calculateVirusTotalScore(data.virusTotalData);
  const dbipScore = calculateDBIPScore(data.DBIPData);
  const criminalScore = calculateCriminalScore(data.CriminalData);
  const blockListScore = calculateBlockListScore(data.BlockListData);
  const finalScore = calculateFinalScore(
    AbuseIPScore,
    virusTotalScore,
    dbipScore,
    criminalScore,
    blockListScore
  );
  const adjustedScore = finalScore > 0 ? Math.max(finalScore, 1) : 0;

  return Math.round(Math.min(adjustedScore, 10) * 10) / 10;
}

export { calculateIPRisk };
