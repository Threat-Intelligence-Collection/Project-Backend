import { fetchAbuseReport } from "@src/services/searchIP/AbuseIPDB";
import { fetchCriminalReport } from "@src/services/searchIP/CriminalIP";
import { fetchDBIP } from "@src/services/searchIP/DBIP";
import { fetchVirusTotalData } from "@src/services/searchIP/Virustotal";
import {
  ApiResponse,
  searchIPresponse,
  searchDomainResponse,
} from "../../types/ApiResponse/ApiResponse";
import { fetchCriminalDomainReport } from "@src/services/searchDomain/CriminalIP";
import { fetchVirusTotalDomainData } from "@src/services/searchDomain/Virustotal";
import { fetchBlockList } from "@src/services/searchIP/blockList";
import { fetchUrlVoid } from "@src/services/searchDomain/UrlVoid";
import { fetchIsMalicious } from "@src/services/searchDomain/IsMalicious";
import { fetchNeutrino } from "@src/services/searchDomain/Neutrino";
import { reportData } from "types/searchDomainResponse/CriminalDomainType";
import "dotenv/config";

function calculateIPRisk(data: any): number {
  let score = 0;

  // 1) Abuse IP
  const abuseScore = data.abuseData.abuseConfidenceScore / 10;
  const totalReports = Math.min(data.abuseData.totalReports / 500, 10);

  if (data.abuseData.totalReports > 0) {
    score = Math.max(score, 1);
  }

  const AbuseIPScore = abuseScore * 0.4 + totalReports * 0.2;

  // 2) VirusTotal
  const vtReputation = Math.max(-data.virusTotalData.Reputation / 10, 0);
  const vtMalicious = Math.min(
    data.virusTotalData.Analysis_stats.malicious / 5,
    10
  );
  const vtSuspicious = Math.min(
    data.virusTotalData.Analysis_stats.suspicious / 3,
    10
  );

  const virusTotalScore =
    vtReputation * 0.1 + vtMalicious * 0.2 + vtSuspicious * 0.1;

  // 3) DBIP Risk Level
  const dbipRisk = data.DBIPData.riskLevel === "High" ? 10 : 0;

  const dbipScore = dbipRisk * 0.3;

  // 4) Criminal IP
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

  // Type Guard สำหรับตรวจสอบว่าค่าเป็น RiskLevel หรือไม่
  function isRiskLevel(value: any): value is RiskLevel {
    return ["critical", "dangerous", "moderate", "low", "safe"].includes(value);
  }

  const inbound = data.CriminalData.score.inbound?.trim().toLowerCase();
  const outbound = data.CriminalData.score.outbound?.trim().toLowerCase();

  const inboundScore = isRiskLevel(inbound) ? criminalInbound[inbound] : 0;
  const outboundScore = isRiskLevel(outbound) ? criminalOutbound[outbound] : 0;

  const maxInorOut = Math.max(inboundScore, outboundScore);

  const criminalScore = maxInorOut * 0.3;

  // 5) Block list data
  const BLDattack = Math.min(data.BlockListData.attacks / 1000, 10);
  const BLDreport = Math.min(data.BlockListData.reports / 100, 10);

  const blockListScore = BLDattack * 0.2 + BLDreport * 0.1;
  // รวมคะแนนทั้งหมด
  const finalScore =
    AbuseIPScore + virusTotalScore + dbipScore + criminalScore + blockListScore;

  // ถ้ามีความเสี่ยงจากแหล่งใดแหล่งหนึ่ง ให้คะแนนขั้นต่ำ 1
  const adjustedScore = finalScore > 0 ? Math.max(finalScore, 1) : 0;

  return Math.round(Math.min(adjustedScore, 10) * 10) / 10;
}

async function searchIP({
  params,
}: {
  params: { ip: string };
}): Promise<ApiResponse | searchIPresponse> {
  try {
    const ipv4Regex =
      /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}$/;
    if (!params.ip) {
      return { success: false, status: 400, message: "IP must be provided!" };
    }
    if (!ipv4Regex.test(params.ip)) {
      return { success: false, status: 400, message: "Invalid IP format!" };
    }
    const Abuseresult = await fetchAbuseReport(
      params.ip,
      process.env.ABUSE_IPDB_API_KEY || ""
    );
    const Virusresult = await fetchVirusTotalData(
      params.ip,
      process.env.VIRUS_TOTAL_API_KEY || ""
    );
    const DBIPresult = await fetchDBIP(params.ip);
    const Criminalresult = await fetchCriminalReport(
      params.ip,
      process.env.CRIMINAL_IP_API_KEY || ""
    );
    const BlockListresult = await fetchBlockList(params.ip);

    const riskScore = calculateIPRisk({
      abuseData: Abuseresult,
      virusTotalData: Virusresult,
      DBIPData: DBIPresult,
      CriminalData: Criminalresult,
      BlockListData: BlockListresult,
    });

    return {
      success: true,
      riskScore: riskScore,
      abuseData: Abuseresult,
      virusTotalData: Virusresult,
      DBIPData: DBIPresult,
      CriminalData: Criminalresult,
      BlockListData: BlockListresult,
    };
  } catch (error: unknown) {
    console.error("Error:", error);
    let errorMessage = "An unknown error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }
    return { success: false, status: 500, message: errorMessage };
  }
}

// ฟังก์ชันคำนวณความเสี่ยงของ Domain
function calculateDomainRisk(data: any): number {
  // ข้อมูลจาก VirusTotal
  const vtMalicious = data.virusTotalData.last_analysis_stats.malicious || 0;
  const vtSuspicious = data.virusTotalData.last_analysis_stats.suspicious || 0;
  const vtHarmless = data.virusTotalData.last_analysis_stats.harmless || 0;
  const vtUndetected = data.virusTotalData.last_analysis_stats.undetected || 0;

  // คำนวณคะแนน VirusTotal
  let vtScore = 0;
  vtScore += Math.min(vtMalicious * 1.5, 10);
  vtScore += Math.min(vtSuspicious * 1.0, 5);
  if (vtHarmless > vtMalicious + vtSuspicious) {
    vtScore -= Math.min(vtHarmless / 10, 5);
  }
  if (vtUndetected < 5) {
    vtScore += 2;
  }

  type RiskLevel = "critical" | "dangerous" | "moderate" | "low" | "safe";

  const criminalMapping: Record<RiskLevel, number> = {
    critical: 10,
    dangerous: 7,
    moderate: 4,
    low: 2,
    safe: 0,
  };

  // Type Guard สำหรับตรวจสอบว่าค่าเป็น RiskLevel หรือไม่
  function isRiskLevel(value: any): value is RiskLevel {
    return ["critical", "dangerous", "moderate", "low", "safe"].includes(value);
  }

  // ข้อมูลจาก Criminal IP
  const reports = data.CriminalData.data.reports || [];
  const totalCriminalScore = reports.reduce(
    (acc: number, report: reportData) => {
      const scoreLevel = report.score?.trim().toLowerCase();
      const score = isRiskLevel(scoreLevel) ? criminalMapping[scoreLevel] : 0;
      return acc + score;
    },
    0
  );
  const criminalScore =
    reports.length > 0 ? totalCriminalScore / reports.length : 0;

  // 3) urlVoid
  const urlVoidScore = data.UrlVoidData.detectionCounts * 10;

  // 4) Neutrino
  const neutrinoScore = data.NeutrinoData.blocklists.some(
    (item: string) => item === "malware"
  )
    ? 1
    : 0;

  //5)isMaliCious
  const isMaMalicious = data.IsMaliCiousData.reputation.malicious || 0;
  const isMaSuspicious = data.IsMaliCiousData.reputation.suspicious || 0;
  const isMaHarmless = data.IsMaliCiousData.reputation.harmless || 0;
  const isMaUndetected = data.IsMaliCiousData.reputation.undetected || 0;

  // คำนวณคะแนน VirusTotal
  let isMaliCiousScore = 0;
  isMaliCiousScore += Math.min(isMaMalicious * 1.5, 10);
  isMaliCiousScore += Math.min(isMaSuspicious * 1.0, 5);
  if (isMaHarmless > isMaMalicious + isMaSuspicious) {
    isMaliCiousScore -= Math.min(vtHarmless / 10, 5);
  }
  if (isMaUndetected < 5) {
    isMaliCiousScore += 2;
  }
  // รวมคะแนนจากสองแหล่ง
  let finalScore =
    vtScore * 0.5 +
    criminalScore * 0.3 +
    urlVoidScore * 0.2 +
    neutrinoScore * 0.1 +
    isMaliCiousScore * 0.5;
  finalScore = Math.round(Math.min(finalScore, 10) * 10) / 10;

  if (finalScore > 0) {
    finalScore = Math.max(finalScore, 1);
  }

  return finalScore;
}

async function searchDomain({
  params,
}: {
  params: { domainName: string };
}): Promise<ApiResponse | searchDomainResponse> {
  try {
    const domainRegex = /^(?!-)([A-Za-z0-9-]{1,63}\.)+[A-Za-z]{2,63}$/;
    if (!params.domainName) {
      return {
        success: false,
        status: 404,
        message: "Domain name must be provided!",
      };
    }
    if (!domainRegex.test(params.domainName)) {
      return {
        success: false,
        status: 400,
        message: "Invalid Domain format!",
      };
    }
    const CriminalResult = await fetchCriminalDomainReport(params.domainName);
    const Virusresult = await fetchVirusTotalDomainData(params.domainName);
    const UrlVoidresult = await fetchUrlVoid(params.domainName);
    const IsMaliciousresult = await fetchIsMalicious(params.domainName);
    const NeutrinoResult = await fetchNeutrino(params.domainName);

    const riskScore = calculateDomainRisk({
      UrlVoidData: UrlVoidresult,
      virusTotalData: Virusresult,
      IsMaliCiousData: IsMaliciousresult,
      CriminalData: CriminalResult,
      NeutrinoData: NeutrinoResult,
    });

    return {
      success: true,
      status: 200,
      UrlVoidData: UrlVoidresult,
      virusTotalData: Virusresult,
      IsMaliCiousData: IsMaliciousresult,
      CriminalData: CriminalResult,
      NeutrinoData: NeutrinoResult,
    };
  } catch (error: unknown) {
    console.error("Error:", error);
    let errorMessage = "An unknown error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }
    return { success: false, status: 500, message: errorMessage };
  }
}

export { searchIP, searchDomain };
