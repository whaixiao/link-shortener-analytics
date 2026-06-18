export interface URLResponse {
  original_url: string;
  short_code: string;
  short_url: string;
}

export interface ClickStat {
  date: string;
  clicks: number;
}

export interface AnalyticsResponse {
  short_code: string;
  total_clicks: number;
  timeline: ClickStat[];
}