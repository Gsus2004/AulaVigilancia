import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Check, X, Clock, Filter } from "lucide-react";
import { AlertWithDetails } from "@/lib/types";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Alerts() {
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: alerts, isLoading } = useQuery<AlertWithDetails[]>({
    queryKey: ['/api/alerts'],
  });

  const resolveAlertMutation = useMutation({
    mutationFn: async (alertId: string) => {
      return apiRequest('PUT', `/api/alerts/${alertId}/resolve`, {
        resolvedBy: 'current-user' // In a real app, this would be the current user ID
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/alerts'] });
      toast({
        title: "Alerta resuelta",
        description: "La alerta ha sido marcada como resuelta.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo resolver la alerta. Inténtalo de nuevo.",
        variant: "destructive",
      });
    },
  });

  const filteredAlerts = alerts?.filter(alert => {
    const matchesSeverity = severityFilter === "all" || alert.severity === severityFilter;
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" && !alert.isResolved) ||
      (statusFilter === "resolved" && alert.isResolved);
    return matchesSeverity && matchesStatus;
  }) || [];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'Alta';
      case 'medium':
        return 'Media';
      case 'low':
        return 'Baja';
      default:
        return 'Desconocida';
    }
  };

  const getAlertIcon = (alertType: string) => {
    switch (alertType) {
      case 'inappropriate_content':
        return '⚠️';
      case 'excessive_time':
        return '⏰';
      case 'blocked_download':
        return '🚫';
      case 'unauthorized_app':
        return '📱';
      default:
        return '❓';
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 overflow-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Sistema de Alertas</h2>
            <p className="text-sm text-muted-foreground">
              Gestiona y revisa las alertas de seguridad del sistema
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-red-100 text-red-800" data-testid="badge-active-alerts">
              {filteredAlerts.filter(a => !a.isResolved).length} alertas activas
            </Badge>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-6">
        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filtros:</span>
          </div>
          
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-40" data-testid="select-severity-filter">
              <SelectValue placeholder="Severidad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las severidades</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
              <SelectItem value="medium">Media</SelectItem>
              <SelectItem value="low">Baja</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40" data-testid="select-status-filter">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="active">Activas</SelectItem>
              <SelectItem value="resolved">Resueltas</SelectItem>
            </SelectContent>
          </Select>

          <div className="text-sm text-muted-foreground ml-auto">
            Mostrando {filteredAlerts.length} de {alerts?.length || 0} alertas
          </div>
        </div>

        {/* Alerts List */}
        <div className="space-y-4">
          {filteredAlerts.length > 0 ? (
            filteredAlerts.map((alert) => (
              <Card 
                key={alert.id}
                className={`${getSeverityColor(alert.severity)} ${alert.isResolved ? 'opacity-60' : ''}`}
                data-testid={`alert-card-${alert.id}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="text-2xl" role="img" aria-label={alert.alertType}>
                        {getAlertIcon(alert.alertType)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold" data-testid={`text-alert-title-${alert.id}`}>
                            {alert.title}
                          </h3>
                          <Badge 
                            className={getSeverityColor(alert.severity)}
                            data-testid={`badge-severity-${alert.id}`}
                          >
                            {getSeverityText(alert.severity)}
                          </Badge>
                          {alert.isResolved && (
                            <Badge className="bg-green-100 text-green-800" data-testid={`badge-resolved-${alert.id}`}>
                              Resuelta
                            </Badge>
                          )}
                        </div>
                        
                        {alert.description && (
                          <p className="text-sm text-gray-700 mb-3" data-testid={`text-alert-description-${alert.id}`}>
                            {alert.description}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span data-testid={`text-alert-student-${alert.id}`}>
                            Estudiante: {alert.student.name}
                          </span>
                          <span data-testid={`text-alert-tablet-${alert.id}`}>
                            Tablet: {alert.tablet.tabletNumber}
                          </span>
                          <span className="flex items-center gap-1" data-testid={`text-alert-time-${alert.id}`}>
                            <Clock className="w-3 h-3" />
                            {new Date(alert.createdAt).toLocaleString('es-ES')}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {!alert.isResolved ? (
                        <>
                          <Button
                            size="sm"
                            onClick={() => resolveAlertMutation.mutate(alert.id)}
                            disabled={resolveAlertMutation.isPending}
                            data-testid={`button-resolve-${alert.id}`}
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Resolver
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            data-testid={`button-dismiss-${alert.id}`}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Descartar
                          </Button>
                        </>
                      ) : (
                        <Badge className="bg-green-100 text-green-800">
                          <Check className="w-3 h-3 mr-1" />
                          Resuelta
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-12 text-center text-muted-foreground">
                <AlertTriangle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No hay alertas</h3>
                <p className="text-sm">
                  {alerts?.length === 0 
                    ? "No se han registrado alertas en el sistema" 
                    : "No se encontraron alertas que coincidan con los filtros seleccionados"
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
