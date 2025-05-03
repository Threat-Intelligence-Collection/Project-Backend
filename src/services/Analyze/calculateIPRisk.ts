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
