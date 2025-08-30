import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Download, FileSpreadsheet, BarChart3 } from "lucide-react";

interface ReportsModalProps {
  children: React.ReactNode;
}

export default function ReportsModal({ children }: ReportsModalProps) {
  const [open, setOpen] = useState(false);
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
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="bg-primary text-primary-foreground px-6 py-4 -mx-6 -mt-6">
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Generador de Reportes
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-1">
            {/* Report Configuration */}
            <div className="space-y-4">
              <h4 className="font-semibold">Configuración del Reporte</h4>
              
              <div>
                <Label htmlFor="report-type">Tipo de Reporte</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger data-testid="select-report-type-modal">
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
                    <Label htmlFor="start-date-modal" className="text-xs text-muted-foreground">Desde</Label>
                    <Input
                      id="start-date-modal"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      data-testid="input-start-date-modal"
                    />
                  </div>
                  <div>
                    <Label htmlFor="end-date-modal" className="text-xs text-muted-foreground">Hasta</Label>
                    <Input
                      id="end-date-modal"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      data-testid="input-end-date-modal"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="student-select-modal">Estudiantes</Label>
                <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                  <SelectTrigger data-testid="select-students-modal">
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
                    data-testid="button-generate-pdf-modal"
                  >
                    <FileText className="w-4 h-4 text-red-600" />
                    PDF
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 flex items-center justify-center gap-2"
                    onClick={() => handleGenerateReport('excel')}
                    data-testid="button-generate-excel-modal"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-green-600" />
                    Excel
                  </Button>
                </div>
              </div>
            </div>

            {/* Report Preview */}
            <div className="space-y-4">
              <h4 className="font-semibold">Vista Previa del Reporte</h4>
              <div className="bg-muted/50 rounded-lg p-4 h-80 overflow-auto">
                <div className="space-y-3">
                  <div className="bg-card rounded p-3 border border-border">
                    <h5 className="font-medium text-sm mb-2">Resumen de {reportType.replace('-', ' ')}</h5>
                    <div className="text-xs space-y-1">
                      <p><span className="text-muted-foreground">Período:</span> {startDate} a {endDate}</p>
                      <p><span className="text-muted-foreground">Estudiantes incluidos:</span> {selectedStudent === 'all' ? '25' : '1'}</p>
                      <p><span className="text-muted-foreground">Tipo de reporte:</span> {reportType}</p>
                    </div>
                  </div>
                  
                  <div className="bg-card rounded p-3 border border-border">
                    <h5 className="font-medium text-sm mb-2">Datos a incluir</h5>
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span>Actividades registradas</span>
                        <span className="text-blue-600">1,247</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tiempo total de uso</span>
                        <span className="text-blue-600">45h 32min</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Alertas generadas</span>
                        <span className="text-yellow-600">12</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sitios bloqueados</span>
                        <span className="text-red-600">8</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-card rounded p-3 border border-border">
                    <h5 className="font-medium text-sm mb-2">Gráficos incluidos</h5>
                    <div className="text-xs space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Distribución de tiempo por aplicación</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Evolución de uso por día</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span>Categorías de contenido accedido</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border p-4 flex justify-end gap-2 mt-6">
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
            data-testid="button-cancel-report"
          >
            Cancelar
          </Button>
          <Button 
            onClick={() => handleGenerateReport('pdf')}
            data-testid="button-generate-report-modal"
          >
            <Download className="w-4 h-4 mr-2" />
            Generar Reporte
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
