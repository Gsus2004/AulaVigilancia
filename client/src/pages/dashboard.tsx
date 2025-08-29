import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Download, Tablet, Clock, Ban, Users } from "lucide-react";
import TabletCard from "@/components/tablet-card";
import { DashboardStats, TabletWithStudent, AlertWithDetails } from "@/lib/types";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ['/api/dashboard/stats'],
  });

  const { data: tablets, isLoading: tabletsLoading } = useQuery<TabletWithStudent[]>({
    queryKey: ['/api/tablets'],
  });

  const { data: recentAlerts, isLoading: alertsLoading } = useQuery<AlertWithDetails[]>({
    queryKey: ['/api/alerts', { resolved: false }],
  });

  const handleExportReport = () => {
    window.open('/api/reports/export?type=dashboard&format=pdf', '_blank');
  };

  if (statsLoading || tabletsLoading || alertsLoading) {
    return (
      <div className="flex-1 overflow-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const onlineTablets = tablets?.filter(t => t.status === 'online') || [];
  const warningTablets = tablets?.filter(t => t.status === 'warning') || [];
  const blockedTablets = tablets?.filter(t => t.status === 'blocked') || [];

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Dashboard de Monitoreo</h2>
            <p className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString('es-ES', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-muted-foreground">En línea:</span>
              <span className="font-medium" data-testid="text-online-count">
                {stats?.activeTablets || 0}/{stats?.totalTablets || 0}
              </span>
            </div>
            <Button 
              onClick={handleExportReport}
              className="flex items-center gap-2"
              data-testid="button-export-report"
            >
              <Download className="w-4 h-4" />
              Exportar Reporte
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tablets Activas</p>
                  <p className="text-2xl font-bold text-foreground" data-testid="text-active-tablets">
                    {stats?.activeTablets || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Tablet className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Alertas Activas</p>
                  <p className="text-2xl font-bold text-destructive" data-testid="text-active-alerts">
                    {stats?.activeAlerts || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tiempo Promedio</p>
                  <p className="text-2xl font-bold text-foreground" data-testid="text-average-time">
                    {stats?.averageTime || 0}min
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Sitios Bloqueados</p>
                  <p className="text-2xl font-bold text-foreground" data-testid="text-blocked-sites">
                    {stats?.blockedSites || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Ban className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Alerts */}
        <Card className="mb-6">
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Alertas Recientes</h3>
              <Button variant="link" className="text-sm" data-testid="button-view-all-alerts">
                Ver todas
              </Button>
            </div>
          </div>
          <CardContent className="p-6">
            {recentAlerts && recentAlerts.length > 0 ? (
              <div className="space-y-4">
                {recentAlerts.slice(0, 3).map((alert) => (
                  <div 
                    key={alert.id} 
                    className={`flex items-center gap-4 p-4 rounded-lg border ${
                      alert.severity === 'high' ? 'bg-destructive/10 border-destructive/20' :
                      alert.severity === 'medium' ? 'bg-yellow-50 border-yellow-200' :
                      'bg-orange-50 border-orange-200'
                    }`}
                    data-testid={`alert-${alert.id}`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      alert.severity === 'high' ? 'bg-destructive/20' :
                      alert.severity === 'medium' ? 'bg-yellow-100' :
                      'bg-orange-100'
                    }`}>
                      <AlertTriangle className={`w-5 h-5 ${
                        alert.severity === 'high' ? 'text-destructive' :
                        alert.severity === 'medium' ? 'text-yellow-600' :
                        'text-orange-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{alert.title}</p>
                      <p className="text-sm text-muted-foreground">
                        Estudiante: {alert.student.name} - {alert.tablet.tabletNumber}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(alert.createdAt).toLocaleString('es-ES')}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      data-testid={`button-resolve-alert-${alert.id}`}
                    >
                      Resolver
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No hay alertas activas</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Live Tablet Monitoring */}
        <Card>
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Monitoreo en Tiempo Real</h3>
              <div className="flex items-center gap-2">
                <select 
                  className="border border-input rounded-md px-3 py-1 text-sm bg-background"
                  data-testid="select-filter-status"
                >
                  <option>Todos los estados</option>
                  <option>En línea</option>
                  <option>Con alertas</option>
                  <option>Bloqueados</option>
                </select>
                <Button 
                  variant="secondary" 
                  size="sm"
                  data-testid="button-refresh-view"
                >
                  <Users className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <CardContent className="p-6">
            {tablets && tablets.length > 0 ? (
              <div className="tablet-grid">
                {[...onlineTablets, ...warningTablets, ...blockedTablets].slice(0, 6).map((tablet) => (
                  <TabletCard key={tablet.id} tablet={tablet} />
                ))}
                
                {tablets.length > 6 && (
                  <div className="bg-muted/50 border-2 border-dashed border-muted rounded-lg p-4 flex items-center justify-center">
                    <div className="text-center">
                      <Users className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Ver más tablets<br />
                        <span className="text-xs">(+{tablets.length - 6} dispositivos)</span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Tablet className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No hay tablets registradas</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
