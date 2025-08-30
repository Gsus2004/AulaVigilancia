import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Download, FileSpreadsheet, Calendar } from "lucide-react";

export default function Reports() {
  const [reportType, setReportType] = useState("student-activity");
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedStudent, setSelectedStudent] = useState("all");

  const handleGenerateReport = (format: 'pdf' | 'excel') => {
    const params = new URLSearchParams({
      type: reportType,
      format,
      startDate,
      endDate,
      ...(selectedStudent !== 'all' && { studentId: selectedStudent })
    });
    
    window.open(`/api/reports/export?${params.toString()}`, '_blank');
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Generador de Reportes</h2>
            <p className="text-sm text-muted-foreground">
              Crea reportes detallados de actividad y estadísticas
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Report Configuration */}
          <Card>
            <div className="p-6 border-b border-border">
              <h3 className="font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Configuración del Reporte
              </h3>
            </div>
            <CardContent className="p-6 space-y-4">
              <div>
                <Label htmlFor="report-type">Tipo de Reporte</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger data-testid="select-report-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student-activity">Actividad por Estudiante</SelectItem>
                    <SelectItem value="class-summary">Resumen de Clase</SelectItem>
                    <SelectItem value="website-visits">Sitios Web Visitados</SelectItem>
                    <SelectItem value="app-usage">Aplicaciones Utilizadas</SelectItem>
                    <SelectItem value="alerts-blocks">Alertas y Bloqueos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Rango de Fechas</Label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div>
                    <Label htmlFor="start-date" className="text-xs text-muted-foreground">Desde</Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      data-testid="input-start-date"
                    />
                  </div>
                  <div>
                    <Label htmlFor="end-date" className="text-xs text-muted-foreground">Hasta</Label>
                    <Input
                      id="end-date"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      data-testid="input-end-date"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="student-select">Estudiantes</Label>
                <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                  <SelectTrigger data-testid="select-students">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estudiantes</SelectItem>
                    <SelectItem value="selected">Estudiantes seleccionados</SelectItem>
                    <SelectItem value="alerts-only">Solo estudiantes con alertas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Formato de Exportación</Label>
                <div className="flex gap-2 mt-1">
                  <Button 
                    variant="outline" 
                    className="flex-1 flex items-center justify-center gap-2"
                    onClick={() => handleGenerateReport('pdf')}
                    data-testid="button-generate-pdf"
                  >
                    <FileText className="w-4 h-4 text-red-600" />
                    PDF
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 flex items-center justify-center gap-2"
                    onClick={() => handleGenerateReport('excel')}
                    data-testid="button-generate-excel"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-green-600" />
                    Excel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Report Preview */}
          <Card>
            <div className="p-6 border-b border-border">
              <h3 className="font-semibold">Vista Previa</h3>
            </div>
            <CardContent className="p-6">
              <div className="bg-muted/50 rounded-lg p-4 h-80 overflow-auto">
                <div className="space-y-3">
                  <div className="bg-card rounded p-3 border border-border">
                    <h5 className="font-medium text-sm mb-2">Resumen de Actividad - Ejemplo</h5>
                    <div className="text-xs space-y-1">
                      <p><span className="text-muted-foreground">Período:</span> {startDate} a {endDate}</p>
                      <p><span className="text-muted-foreground">Estudiantes incluidos:</span> 25</p>
                      <p><span className="text-muted-foreground">Total de actividades:</span> 1,247</p>
                      <p><span className="text-muted-foreground">Alertas registradas:</span> 12</p>
                    </div>
                  </div>
                  
                  <div className="bg-card rounded p-3 border border-border">
                    <h5 className="font-medium text-sm mb-2">Sitios Web Más Visitados</h5>
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span>Google Classroom</span>
                        <span className="text-green-600">2h 45min</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Khan Academy</span>
                        <span className="text-green-600">1h 20min</span>
                      </div>
                      <div className="flex justify-between">
                        <span>YouTube</span>
                        <span className="text-yellow-600">45min</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-card rounded p-3 border border-border">
                    <h5 className="font-medium text-sm mb-2">Aplicaciones Utilizadas</h5>
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span>Calculadora</span>
                        <span className="text-blue-600">32 veces</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Editor de texto</span>
                        <span className="text-blue-600">18 veces</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Navegador web</span>
                        <span className="text-blue-600">156 veces</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Reports */}
        <Card className="mt-6">
          <div className="p-6 border-b border-border">
            <h3 className="font-semibold">Reportes Rápidos</h3>
          </div>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center gap-2"
                data-testid="button-daily-summary"
              >
                <Calendar className="w-6 h-6" />
                <span className="text-sm">Resumen Diario</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center gap-2"
                data-testid="button-weekly-activity"
              >
                <FileText className="w-6 h-6" />
                <span className="text-sm">Actividad Semanal</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center gap-2"
                data-testid="button-security-report"
              >
                <FileText className="w-6 h-6" />
                <span className="text-sm">Reporte de Seguridad</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center gap-2"
                data-testid="button-usage-statistics"
              >
                <FileSpreadsheet className="w-6 h-6" />
                <span className="text-sm">Estadísticas de Uso</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
