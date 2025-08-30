import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TabletWithStudent, ActivityWithDetails } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { Ban, MessageSquare, ExternalLink, Lock, Youtube, Calculator, GraduationCap } from "lucide-react";

interface StudentDetailModalProps {
  tablet: TabletWithStudent;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function StudentDetailModal({ tablet, open, onOpenChange }: StudentDetailModalProps) {
  const { data: activities, isLoading } = useQuery<ActivityWithDetails[]>({
    queryKey: ['/api/tablets', tablet.id, 'activity'],
    enabled: open,
  });

  const getAppIcon = (app: string | null) => {
    if (!app) return GraduationCap;
    
    const appLower = app.toLowerCase();
    if (appLower.includes('youtube')) return Youtube;
    if (appLower.includes('calculadora') || appLower.includes('calculator')) return Calculator;
    return GraduationCap;
  };

  const getCategoryColor = (category: string | null) => {
    switch (category) {
      case 'educational':
        return 'bg-green-100 text-green-800';
      case 'entertainment':
        return 'bg-yellow-100 text-yellow-800';
      case 'inappropriate':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getCategoryText = (category: string | null) => {
    switch (category) {
      case 'educational':
        return 'Educativo';
      case 'entertainment':
        return 'Entretenimiento';
      case 'inappropriate':
        return 'Inapropiado';
      default:
        return 'Herramienta';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="bg-primary text-primary-foreground px-6 py-4 -mx-6 -mt-6">
          <DialogTitle>Detalle de Actividad - {tablet.tabletNumber}</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto space-y-6 px-1">
          {/* Student Info */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-semibold mb-2">Información del Estudiante</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Nombre:</span>
                <span className="ml-2 font-medium">{tablet.student?.name || 'Sin asignar'}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Grado:</span>
                <span className="ml-2 font-medium">{tablet.student?.grade || 'N/A'}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Tablet ID:</span>
                <span className="ml-2 font-medium">{tablet.tabletNumber}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Estado:</span>
                <Badge 
                  className={`ml-2 text-xs ${
                    tablet.status === 'online' ? 'bg-green-100 text-green-800' :
                    tablet.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                    tablet.status === 'blocked' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}
                >
                  {tablet.status === 'online' ? 'En línea' :
                   tablet.status === 'warning' ? 'Advertencia' :
                   tablet.status === 'blocked' ? 'Bloqueado' : 'Desconectado'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Current Activity */}
          {tablet.currentApp && (
            <div>
              <h4 className="font-semibold mb-3">Actividad Actual</h4>
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    tablet.status === 'warning' ? 'bg-red-100' : 'bg-blue-100'
                  }`}>
                    {(() => {
                      const IconComponent = getAppIcon(tablet.currentApp);
                      return <IconComponent className={`w-4 h-4 ${
                        tablet.status === 'warning' ? 'text-red-600' : 'text-blue-600'
                      }`} />;
                    })()}
                  </div>
                  <div>
                    <p className="font-medium">{tablet.currentApp}</p>
                    {tablet.currentUrl && (
                      <p className="text-sm text-muted-foreground">{tablet.currentUrl}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Tiempo en actividad:</span>
                    <span className="ml-2 font-medium">{Math.floor(tablet.screenTime / 60)}h {tablet.screenTime % 60}min</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Categoría:</span>
                    <span className={`ml-2 font-medium ${
                      tablet.status === 'warning' ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {tablet.status === 'warning' ? 'Entretenimiento' : 'Educativo'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Recent Activity Timeline */}
          <div>
            <h4 className="font-semibold mb-3">Historial de Actividad (Últimas 2 horas)</h4>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center gap-4 p-3 border border-border rounded-lg">
                    <div className="w-8 h-8 bg-muted rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-1/2"></div>
                      <div className="h-3 bg-muted rounded w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : activities && activities.length > 0 ? (
              <div className="space-y-3">
                {activities.slice(0, 5).map((activity) => {
                  const IconComponent = getAppIcon(activity.application);
                  return (
                    <div 
                      key={activity.id}
                      className={`flex items-center gap-4 p-3 border rounded-lg ${
                        activity.category === 'inappropriate' ? 'border-red-200 bg-red-50' :
                        activity.category === 'entertainment' ? 'border-yellow-200 bg-yellow-50' :
                        'border-border'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        activity.category === 'inappropriate' ? 'bg-red-100' :
                        activity.category === 'entertainment' ? 'bg-yellow-100' :
                        'bg-green-100'
                      }`}>
                        <IconComponent className={`w-4 h-4 ${
                          activity.category === 'inappropriate' ? 'text-red-600' :
                          activity.category === 'entertainment' ? 'text-yellow-600' :
                          'text-green-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{activity.title || activity.application}</p>
                        {activity.url && (
                          <p className="text-xs text-muted-foreground">{activity.url}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {new Date(activity.timestamp).toLocaleTimeString('es-ES')} ({activity.duration} min)
                        </p>
                      </div>
                      <Badge className={`text-xs ${getCategoryColor(activity.category)}`}>
                        {getCategoryText(activity.category)}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <GraduationCap className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No hay actividad reciente</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="border-t border-border pt-6">
            <h4 className="font-semibold mb-3">Acciones Disponibles</h4>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="destructive" 
                className="flex items-center justify-center gap-2 py-3"
                data-testid="button-block-current-site"
              >
                <Ban className="w-4 h-4" />
                Bloquear Sitio
              </Button>
              <Button 
                className="flex items-center justify-center gap-2 py-3 bg-yellow-500 hover:bg-yellow-600"
                data-testid="button-send-warning"
              >
                <MessageSquare className="w-4 h-4" />
                Enviar Advertencia
              </Button>
              <Button 
                className="flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700"
                data-testid="button-redirect-to-educational"
              >
                <ExternalLink className="w-4 h-4" />
                Redirigir
              </Button>
              <Button 
                variant="secondary"
                className="flex items-center justify-center gap-2 py-3 bg-gray-600 text-white hover:bg-gray-700"
                data-testid="button-lock-tablet"
              >
                <Lock className="w-4 h-4" />
                Bloquear Tablet
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
