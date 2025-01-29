interface issues {
    is_vpn: boolean,
    is_cloud: boolean,
    is_tor: boolean,
    is_proxy: boolean,
    is_hosting: boolean,
    is_mobile: boolean,
    is_darkweb: boolean,
    is_scanner: boolean,
    is_snort: boolean
}

interface score {
    inbound: string,
    outbound: string
}

interface whois {
    count : number,
    data: [
        whoisData
    ]
}

interface whoisData {
        as_name: string,
        as_no: number,
        city: string,
        region: string,
        org_name: string,
        postal_code: string,
        latitude: number,
        longitude: number,
        org_country_code: string,
        confirmed_time: string
}

interface CriminalObject {
    ip: string,
    score : score,
    whois : whois
}
interface CriminalResponseType {
    ip : string,
    issues: issues
    score : score
    whois : whois
}

export { CriminalResponseType, CriminalObject }