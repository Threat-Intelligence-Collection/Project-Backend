interface AbuseIPObject {
    ipAddress: string,
    isPublic: boolean,
    ipVersion: number,
    isWhitelisted: boolean,
    abuseConfidenceScore: number,
    countryCode: string,
    usageType: string,
    isp: string,
    domain: string,
    hostnames: [ string ],
    isTor: string,
    totalReports: number,
    numDistinctUsers: number,
    lastReportedAt: string
}

interface AbuseIPDBResponseType {
    data: AbuseIPObject
}

export { AbuseIPObject, AbuseIPDBResponseType }