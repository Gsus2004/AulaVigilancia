import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RefreshCw, Users } from "lucide-react";
import TabletCard from "@/components/tablet-card";
import { TabletWithStudent } from "@/lib/types";
import { useState } from "react";

export default function LiveMonitoring() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  const { data: tablets, isLoading, refetch } = useQuery<TabletWithStudent[]>({
    queryKey: ['/api/tablets'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const filteredTablets = tablets?.filter(tablet => {
    if (statusFilter === "all") return true;
    if (statusFilter === "online") return tablet.status === "online";
    if (statusFilter === "warning") return tablet.status === "warning";
    if (statusFilter === "blocked") return tablet.status === "blocked";
    return true;
  }) || [];

  const handleRefresh = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex-1 overflow-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="tablet-grid">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-48 bg-muted rounded-lg"></div>
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
            <h2 className="text-xl font-semibold">Monitoreo en Tiempo Real</h2>
            <p className="text-sm text-muted-foreground">
              Vista en vivo de todas las tablets activas
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-muted-foreground">Dispositivos activos:</span>
              <span className="font-medium" data-testid="text-active-devices">
                {filteredTablets.filter(t => t.status === 'online').length}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-6">
        {/* Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48" data-testid="select-status-filter">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="online">En línea</SelectItem>
                <SelectItem value="warning">Con alertas</SelectItem>
                <SelectItem value="blocked">Bloqueados</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="text-sm text-muted-foreground">
              Mostrando {filteredTablets.length} de {tablets?.length || 0} tablets
            </div>
          </div>
          
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            data-testid="button-refresh-tablets"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizar
          </Button>
        </div>

        {/* Tablets Grid */}
        <Card>
          <CardContent className="p-6">
            {filteredTablets.length > 0 ? (
              <div className="tablet-grid">
                {filteredTablets.map((tablet) => (
                  <TabletCard key={tablet.id} tablet={tablet} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No hay tablets disponibles</h3>
                <p className="text-sm">
                  {statusFilter !== "all" 
                    ? "No se encontraron tablets con el filtro seleccionado"
                    : "No hay tablets registradas en el sistema"
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
