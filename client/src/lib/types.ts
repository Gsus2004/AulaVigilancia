export interface DashboardStats {
  activeTablets: number;
  totalTablets: number;
  activeAlerts: number;
  averageTime: number;
  blockedSites: number;
}

export interface TabletWithStudent {
  id: string;
  tabletNumber: string;
  status: 'online' | 'offline' | 'warning' | 'blocked';
  lastActivity: string | null;
  currentApp: string | null;
  currentUrl: string | null;
  screenTime: number;
  isBlocked: boolean;
  student?: {
    id: string;
    name: string;
    grade: string;
  };
}

export interface ActivityWithDetails {
  id: string;
  activityType: string;
  application: string | null;
  url: string | null;
  title: string | null;
  category: string | null;
  duration: number;
  isBlocked: boolean;
  timestamp: string;
  student: {
    id: string;
    name: string;
  };
}

export interface AlertWithDetails {
  id: string;
  alertType: string;
  severity: 'low' | 'medium' | 'high';
  title: string;
  description: string | null;
  isResolved: boolean;
  createdAt: string;
  student: {
    id: string;
    name: string;
  };
  tablet: {
    id: string;
    tabletNumber: string;
  };
}
