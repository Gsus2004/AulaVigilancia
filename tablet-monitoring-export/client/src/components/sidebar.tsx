import { Link, useLocation } from "wouter";
import { MonitorSpeaker, Users, BarChart3, AlertTriangle, Shield, Settings, LogOut } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";

export default function Sidebar() {
  const [location] = useLocation();

  const { data: alerts } = useQuery({
    queryKey: ['/api/alerts', { resolved: false }],
  });

  const activeAlertCount = alerts?.length || 0;

  const menuItems = [
    { 
      href: "/dashboard", 
      icon: BarChart3, 
      label: "Dashboard",
      isActive: location === "/" || location === "/dashboard"
    },
    { 
      href: "/live-monitoring", 
      icon: MonitorSpeaker, 
      label: "Monitoreo en Vivo",
      isActive: location === "/live-monitoring"
    },
    { 
      href: "/students", 
      icon: Users, 
      label: "Estudiantes",
      isActive: location === "/students"
    },
    { 
      href: "/reports", 
      icon: BarChart3, 
      label: "Reportes",
      isActive: location === "/reports"
    },
    { 
      href: "/alerts", 
      icon: AlertTriangle, 
      label: "Alertas",
      badge: activeAlertCount > 0 ? activeAlertCount : undefined,
      isActive: location === "/alerts"
    },
    { 
      href: "/security", 
      icon: Shield, 
      label: "Seguridad Digital",
      isActive: location === "/security"
    },
    { 
      href: "/settings", 
      icon: Settings, 
      label: "Configuración",
      isActive: location === "/settings"
    },
  ];

  return (
    <div className="bg-sidebar border-r border-sidebar-border w-64 flex-shrink-0 flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
            <MonitorSpeaker className="w-4 h-4 text-sidebar-primary-foreground" />
          </div>
          <h1 className="font-bold text-lg text-sidebar-foreground">EduMonitor</h1>
        </div>
      </div>
      
      <nav className="px-4 space-y-2 flex-1">
        {menuItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <div className={`flex items-center justify-between gap-3 px-3 py-2 rounded-md transition-colors ${
              item.isActive 
                ? "bg-sidebar-primary text-sidebar-primary-foreground" 
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            }`} data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}>
              <div className="flex items-center gap-3">
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <Badge variant="destructive" className="text-xs" data-testid={`badge-${item.label.toLowerCase().replace(/\s+/g, '-')}`}>
                  {item.badge}
                </Badge>
              )}
            </div>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
            <Users className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground">Prof. María González</p>
            <p className="text-xs text-muted-foreground">Informática 3° A</p>
          </div>
          <button 
            className="text-muted-foreground hover:text-sidebar-foreground transition-colors"
            data-testid="button-logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
