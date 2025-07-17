// Models for backend dashboard API responses

export interface DashboardMetricsResponse {
  stats: Array<{
    title: string;
    value: number;
    change: number;
    changeType: 'increase' | 'decrease';
    icon: string;
    color: string;
    route: string;
  }>;
}

