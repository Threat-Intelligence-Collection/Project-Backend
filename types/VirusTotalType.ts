interface VirusTotalResponse {
    data: {
        id: string;
        attributes: {
            continent: string;
            reputation: number;
            total_votes: {
                harmless: number;
                malicious: number;
            };
            country: string;
            last_analysis_stats: Record<string, number>;
        };
    };
}

export { VirusTotalResponse }