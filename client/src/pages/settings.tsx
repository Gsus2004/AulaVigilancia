import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Shield, Bell, Users, Database, Save, RefreshCw } from "lucide-react";
import { SecurityPolicy } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // General Settings State
  const [generalSettings, setGeneralSettings] = useState({
    schoolName: "Instituto Educativo San Martín",
    className: "Informática 3° A",
    teacherName: "Prof. María González",
    maxStudentsPerClass: 25,
    sessionTimeout: 30,
    autoRefreshInterval: 30,
  });

  // Security Settings State
  const [securitySettings, setSecuritySettings] = useState({
    contentFilterEnabled: true,
    timeLimitsEnabled: true,
    downloadControlEnabled: true,
    appRestrictionsEnabled: true,
    realTimeMonitoringEnabled: true,
    automaticBlockingEnabled: true,
    parentalControlLevel: "strict",
  });

  // Notification Settings State
  const [notificationSettings, setNotificationSettings] = useState({
    emailAlertsEnabled: true,
    soundAlertsEnabled: true,
    desktopNotificationsEnabled: true,
    alertCooldown: 5,
    emergencyContactEmail: "admin@instituto.edu",
  });

  const { data: securityPolicies } = useQuery<SecurityPolicy[]>({
    queryKey: ['/api/security-policies'],
  });

  const saveSettingsMutation = useMutation({
    mutationFn: async (settings: any) => {
      // In a real app, this would save to backend
      return new Promise(resolve => setTimeout(resolve, 1000));
    },
    onSuccess: () => {
      toast({
        title: "Configuración guardada",
        description: "Los cambios han sido aplicados correctamente.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudieron guardar los cambios.",
        variant: "destructive",
      });
    },
  });

  const handleSaveSettings = () => {
    saveSettingsMutation.mutate({
      general: generalSettings,
      security: securitySettings,
      notifications: notificationSettings,
    });
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Configuración del Sistema</h2>
            <p className="text-sm text-muted-foreground">
              Gestiona las preferencias y políticas del sistema de monitoreo
            </p>
          </div>
          <Button 
            onClick={handleSaveSettings}
            disabled={saveSettingsMutation.isPending}
            data-testid="button-save-settings"
          >
            <Save className="w-4 h-4 mr-2" />
            {saveSettingsMutation.isPending ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general" data-testid="tab-general">
              <Settings className="w-4 h-4 mr-2" />
              General
            </TabsTrigger>
            <TabsTrigger value="security" data-testid="tab-security">
              <Shield className="w-4 h-4 mr-2" />
              Seguridad
            </TabsTrigger>
            <TabsTrigger value="notifications" data-testid="tab-notifications">
              <Bell className="w-4 h-4 mr-2" />
              Notificaciones
            </TabsTrigger>
            <TabsTrigger value="users" data-testid="tab-users">
              <Users className="w-4 h-4 mr-2" />
              Usuarios
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <div className="p-6 border-b border-border">
                <h3 className="font-semibold">Información Institucional</h3>
              </div>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="school-name">Nombre de la Institución</Label>
                    <Input
                      id="school-name"
                      value={generalSettings.schoolName}
                      onChange={(e) => setGeneralSettings(prev => ({ ...prev, schoolName: e.target.value }))}
                      data-testid="input-school-name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="class-name">Nombre de la Clase</Label>
                    <Input
                      id="class-name"
                      value={generalSettings.className}
                      onChange={(e) => setGeneralSettings(prev => ({ ...prev, className: e.target.value }))}
                      data-testid="input-class-name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="teacher-name">Nombre del Docente</Label>
                    <Input
                      id="teacher-name"
                      value={generalSettings.teacherName}
                      onChange={(e) => setGeneralSettings(prev => ({ ...prev, teacherName: e.target.value }))}
                      data-testid="input-teacher-name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="max-students">Máximo de Estudiantes</Label>
                    <Input
                      id="max-students"
                      type="number"
                      value={generalSettings.maxStudentsPerClass}
                      onChange={(e) => setGeneralSettings(prev => ({ ...prev, maxStudentsPerClass: parseInt(e.target.value) }))}
                      data-testid="input-max-students"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <div className="p-6 border-b border-border">
                <h3 className="font-semibold">Configuración del Sistema</h3>
              </div>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="session-timeout">Tiempo de Sesión (minutos)</Label>
                    <Input
                      id="session-timeout"
                      type="number"
                      value={generalSettings.sessionTimeout}
                      onChange={(e) => setGeneralSettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
                      data-testid="input-session-timeout"
                    />
                  </div>
                  <div>
                    <Label htmlFor="refresh-interval">Intervalo de Actualización (segundos)</Label>
                    <Input
                      id="refresh-interval"
                      type="number"
                      value={generalSettings.autoRefreshInterval}
                      onChange={(e) => setGeneralSettings(prev => ({ ...prev, autoRefreshInterval: parseInt(e.target.value) }))}
                      data-testid="input-refresh-interval"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <div className="p-6 border-b border-border">
                <h3 className="font-semibold">Políticas de Seguridad</h3>
              </div>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="content-filter" className="font-medium">Filtro de Contenido Automático</Label>
                      <p className="text-sm text-muted-foreground">Detecta y bloquea contenido inapropiado en tiempo real</p>
                    </div>
                    <Switch 
                      id="content-filter"
                      checked={securitySettings.contentFilterEnabled}
                      onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, contentFilterEnabled: checked }))}
                      data-testid="switch-content-filter"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="time-limits" className="font-medium">Límites de Tiempo por Aplicación</Label>
                      <p className="text-sm text-muted-foreground">Establece límites de uso para aplicaciones no educativas</p>
                    </div>
                    <Switch 
                      id="time-limits"
                      checked={securitySettings.timeLimitsEnabled}
                      onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, timeLimitsEnabled: checked }))}
                      data-testid="switch-time-limits"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="download-control" className="font-medium">Control de Descargas</Label>
                      <p className="text-sm text-muted-foreground">Impide descargas no autorizadas</p>
                    </div>
                    <Switch 
                      id="download-control"
                      checked={securitySettings.downloadControlEnabled}
                      onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, downloadControlEnabled: checked }))}
                      data-testid="switch-download-control"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="app-restrictions" className="font-medium">Restricción de Aplicaciones</Label>
                      <p className="text-sm text-muted-foreground">Controla qué aplicaciones pueden ejecutarse</p>
                    </div>
                    <Switch 
                      id="app-restrictions"
                      checked={securitySettings.appRestrictionsEnabled}
                      onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, appRestrictionsEnabled: checked }))}
                      data-testid="switch-app-restrictions"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="automatic-blocking" className="font-medium">Bloqueo Automático</Label>
                      <p className="text-sm text-muted-foreground">Bloquea tablets automáticamente ante infracciones</p>
                    </div>
                    <Switch 
                      id="automatic-blocking"
                      checked={securitySettings.automaticBlockingEnabled}
                      onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, automaticBlockingEnabled: checked }))}
                      data-testid="switch-automatic-blocking"
                    />
                  </div>

                  <div>
                    <Label htmlFor="parental-control">Nivel de Control Parental</Label>
                    <Select 
                      value={securitySettings.parentalControlLevel} 
                      onValueChange={(value) => setSecuritySettings(prev => ({ ...prev, parentalControlLevel: value }))}
                    >
                      <SelectTrigger data-testid="select-parental-control">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Básico</SelectItem>
                        <SelectItem value="moderate">Moderado</SelectItem>
                        <SelectItem value="strict">Estricto</SelectItem>
                        <SelectItem value="custom">Personalizado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <div className="p-6 border-b border-border">
                <h3 className="font-semibold">Horarios de Restricción</h3>
              </div>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start-time">Hora de Inicio</Label>
                    <Input
                      id="start-time"
                      type="time"
                      defaultValue="08:00"
                      data-testid="input-start-time"
                    />
                  </div>
                  <div>
                    <Label htmlFor="end-time">Hora de Finalización</Label>
                    <Input
                      id="end-time"
                      type="time"
                      defaultValue="15:00"
                      data-testid="input-end-time"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="weekend-restrictions" data-testid="switch-weekend-restrictions" />
                  <Label htmlFor="weekend-restrictions">Aplicar restricciones los fines de semana</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <div className="p-6 border-b border-border">
                <h3 className="font-semibold">Preferencias de Notificación</h3>
              </div>
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-alerts" className="font-medium">Alertas por Email</Label>
                    <p className="text-sm text-muted-foreground">Recibe notificaciones por correo electrónico</p>
                  </div>
                  <Switch 
                    id="email-alerts"
                    checked={notificationSettings.emailAlertsEnabled}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, emailAlertsEnabled: checked }))}
                    data-testid="switch-email-alerts"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sound-alerts" className="font-medium">Alertas Sonoras</Label>
                    <p className="text-sm text-muted-foreground">Reproducir sonidos para alertas importantes</p>
                  </div>
                  <Switch 
                    id="sound-alerts"
                    checked={notificationSettings.soundAlertsEnabled}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, soundAlertsEnabled: checked }))}
                    data-testid="switch-sound-alerts"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="desktop-notifications" className="font-medium">Notificaciones de Escritorio</Label>
                    <p className="text-sm text-muted-foreground">Mostrar notificaciones en el navegador</p>
                  </div>
                  <Switch 
                    id="desktop-notifications"
                    checked={notificationSettings.desktopNotificationsEnabled}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, desktopNotificationsEnabled: checked }))}
                    data-testid="switch-desktop-notifications"
                  />
                </div>

                <div>
                  <Label htmlFor="alert-cooldown">Tiempo de Espera entre Alertas (minutos)</Label>
                  <Input
                    id="alert-cooldown"
                    type="number"
                    min="1"
                    max="60"
                    value={notificationSettings.alertCooldown}
                    onChange={(e) => setNotificationSettings(prev => ({ ...prev, alertCooldown: parseInt(e.target.value) }))}
                    data-testid="input-alert-cooldown"
                  />
                </div>

                <div>
                  <Label htmlFor="emergency-email">Email de Contacto de Emergencia</Label>
                  <Input
                    id="emergency-email"
                    type="email"
                    value={notificationSettings.emergencyContactEmail}
                    onChange={(e) => setNotificationSettings(prev => ({ ...prev, emergencyContactEmail: e.target.value }))}
                    data-testid="input-emergency-email"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Management */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Gestión de Usuarios</h3>
                  <Button data-testid="button-add-user">
                    <Users className="w-4 h-4 mr-2" />
                    Agregar Usuario
                  </Button>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <p className="font-medium">Prof. María González</p>
                      <p className="text-sm text-muted-foreground">Administrador Principal</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Activo</span>
                      <Button variant="outline" size="sm" data-testid="button-edit-user-admin">
                        Editar
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <p className="font-medium">Prof. Juan Pérez</p>
                      <p className="text-sm text-muted-foreground">Docente</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">Inactivo</span>
                      <Button variant="outline" size="sm" data-testid="button-edit-user-teacher">
                        Editar
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <div className="p-6 border-b border-border">
                <h3 className="font-semibold">Permisos y Roles</h3>
              </div>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Rol: Administrador</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Acceso completo al sistema</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Gestión de usuarios</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Configuración de políticas</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Exportación de reportes</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Rol: Docente</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Monitoreo de tablets</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Gestión de alertas</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Reportes básicos</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        <span className="text-muted-foreground">Sin acceso a configuración</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* System Status */}
        <Card className="mt-6">
          <div className="p-6 border-b border-border">
            <h3 className="font-semibold flex items-center gap-2">
              <Database className="w-5 h-5" />
              Estado del Sistema
            </h3>
          </div>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Database className="w-8 h-8 text-green-600" />
                </div>
                <p className="font-medium">Base de Datos</p>
                <p className="text-sm text-green-600">Conectado</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <p className="font-medium">Sistema de Seguridad</p>
                <p className="text-sm text-green-600">Activo</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <RefreshCw className="w-8 h-8 text-green-600" />
                </div>
                <p className="font-medium">Sincronización</p>
                <p className="text-sm text-green-600">En línea</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
