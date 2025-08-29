import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Shield, Plus, Trash2, Globe, Ban, Settings, Download } from "lucide-react";
import { BlockedSite } from "@shared/schema";
import { useState } from "react";

export default function Security() {
  const [newSiteUrl, setNewSiteUrl] = useState("");
  const [newSiteCategory, setNewSiteCategory] = useState("inappropriate");
  
  const { data: blockedSites, isLoading } = useQuery<BlockedSite[]>({
    queryKey: ['/api/blocked-sites'],
  });

  const handleAddSite = () => {
    // In a real app, this would make an API call
    console.log("Adding site:", newSiteUrl, newSiteCategory);
    setNewSiteUrl("");
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'inappropriate':
        return 'bg-red-100 text-red-800';
      case 'social':
        return 'bg-blue-100 text-blue-800';
      case 'entertainment':
        return 'bg-yellow-100 text-yellow-800';
      case 'gaming':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'inappropriate':
        return 'Contenido Inapropiado';
      case 'social':
        return 'Redes Sociales';
      case 'entertainment':
        return 'Entretenimiento';
      case 'gaming':
        return 'Juegos';
      default:
        return 'Otros';
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 overflow-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64 bg-muted rounded-lg"></div>
            <div className="h-64 bg-muted rounded-lg"></div>
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
            <h2 className="text-xl font-semibold">Seguridad Digital</h2>
            <p className="text-sm text-muted-foreground">
              Configura las políticas de seguridad y control de contenido
            </p>
          </div>
          <Button data-testid="button-emergency-lock">
            <Shield className="w-4 h-4 mr-2" />
            Bloqueo de Emergencia
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-6 space-y-6">
        {/* Security Policies */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <div className="p-6 border-b border-border">
              <h3 className="font-semibold flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Políticas de Seguridad
              </h3>
            </div>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="content-filter" className="font-medium">Filtro de Contenido</Label>
                  <p className="text-sm text-muted-foreground">Bloquear contenido inapropiado automáticamente</p>
                </div>
                <Switch id="content-filter" defaultChecked data-testid="switch-content-filter" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="time-limits" className="font-medium">Límites de Tiempo</Label>
                  <p className="text-sm text-muted-foreground">Establecer límites de tiempo por aplicación</p>
                </div>
                <Switch id="time-limits" defaultChecked data-testid="switch-time-limits" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="download-control" className="font-medium">Control de Descargas</Label>
                  <p className="text-sm text-muted-foreground">Bloquear descargas no autorizadas</p>
                </div>
                <Switch id="download-control" defaultChecked data-testid="switch-download-control" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="app-restrictions" className="font-medium">Restricción de Apps</Label>
                  <p className="text-sm text-muted-foreground">Controlar instalación de aplicaciones</p>
                </div>
                <Switch id="app-restrictions" defaultChecked data-testid="switch-app-restrictions" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="real-time-monitoring" className="font-medium">Monitoreo en Tiempo Real</Label>
                  <p className="text-sm text-muted-foreground">Seguimiento continuo de actividades</p>
                </div>
                <Switch id="real-time-monitoring" defaultChecked data-testid="switch-real-time-monitoring" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <div className="p-6 border-b border-border">
              <h3 className="font-semibold flex items-center gap-2">
                <Ban className="w-5 h-5" />
                Agregar Sitio Bloqueado
              </h3>
            </div>
            <CardContent className="p-6 space-y-4">
              <div>
                <Label htmlFor="site-url">URL del Sitio</Label>
                <Input
                  id="site-url"
                  placeholder="ejemplo.com"
                  value={newSiteUrl}
                  onChange={(e) => setNewSiteUrl(e.target.value)}
                  data-testid="input-site-url"
                />
              </div>

              <div>
                <Label htmlFor="site-category">Categoría</Label>
                <select 
                  id="site-category"
                  className="w-full border border-input rounded-md px-3 py-2 bg-background"
                  value={newSiteCategory}
                  onChange={(e) => setNewSiteCategory(e.target.value)}
                  data-testid="select-site-category"
                >
                  <option value="inappropriate">Contenido Inapropiado</option>
                  <option value="social">Redes Sociales</option>
                  <option value="entertainment">Entretenimiento</option>
                  <option value="gaming">Juegos</option>
                  <option value="other">Otros</option>
                </select>
              </div>

              <Button 
                onClick={handleAddSite}
                disabled={!newSiteUrl.trim()}
                className="w-full"
                data-testid="button-add-blocked-site"
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar Sitio Bloqueado
              </Button>

              <div className="text-center">
                <Button variant="outline" size="sm" data-testid="button-import-blocklist">
                  <Download className="w-4 h-4 mr-2" />
                  Importar Lista
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Blocked Sites List */}
        <Card>
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Sitios Bloqueados ({blockedSites?.length || 0})
              </h3>
              <Badge className="bg-red-100 text-red-800" data-testid="badge-blocked-count">
                {blockedSites?.filter(site => site.isActive).length || 0} activos
              </Badge>
            </div>
          </div>
          <CardContent className="p-6">
            {blockedSites && blockedSites.length > 0 ? (
              <div className="space-y-3">
                {blockedSites.map((site) => (
                  <div 
                    key={site.id}
                    className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                    data-testid={`blocked-site-${site.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium" data-testid={`text-site-url-${site.id}`}>
                          {site.url}
                        </p>
                        {site.reason && (
                          <p className="text-sm text-muted-foreground" data-testid={`text-site-reason-${site.id}`}>
                            {site.reason}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge 
                        className={getCategoryColor(site.category)}
                        data-testid={`badge-category-${site.id}`}
                      >
                        {getCategoryText(site.category)}
                      </Badge>
                      
                      <Badge 
                        className={site.isActive ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"}
                        data-testid={`badge-status-${site.id}`}
                      >
                        {site.isActive ? 'Activo' : 'Inactivo'}
                      </Badge>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        data-testid={`button-delete-site-${site.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Ban className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No hay sitios bloqueados</h3>
                <p className="text-sm">
                  Agrega sitios web para bloquear el acceso de los estudiantes
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <div className="p-6 border-b border-border">
            <h3 className="font-semibold">Acciones Rápidas</h3>
          </div>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="destructive" 
                className="h-20 flex flex-col items-center justify-center gap-2"
                data-testid="button-block-all-social"
              >
                <Ban className="w-6 h-6" />
                <span className="text-sm">Bloquear Redes Sociales</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center gap-2"
                data-testid="button-enable-safe-mode"
              >
                <Shield className="w-6 h-6" />
                <span className="text-sm">Modo Seguro</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center gap-2"
                data-testid="button-reset-policies"
              >
                <Settings className="w-6 h-6" />
                <span className="text-sm">Restablecer Políticas</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
