import { reportData } from "../../../types/searchDomainResponse/CriminalDomainType";

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
