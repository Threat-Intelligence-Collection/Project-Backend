interface reportData {
  connected_ip_cnt: number;
  country_code: [string];
  issue: [string];
  jarm: string;
  reg_dtime: string;
  scan_id: string;
  score: string;
  technologies: [
    {
      logo_url: string;
      tech_name: string;
    }
  ];
  title: string;
  url: string;
}


interface CriminalDomainResponseType {
  status: number;
  message: string;
  data: {
    count: number;
    reports: [reportData];
  };
}

export { CriminalDomainResponseType, reportData };