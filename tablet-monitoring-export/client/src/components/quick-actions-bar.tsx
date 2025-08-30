import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { BarChart3, Lock, AlertTriangle, Shield } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import ReportsModal from "./reports-modal";

export default function QuickActionsBar() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const emergencyLockMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', '/api/emergency/lock-all', {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tablets'] });
      toast({
        title: "Bloqueo de emergencia activado",
        description: "Todas las tablets han sido bloqueadas por seguridad.",
        variant: "destructive",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo activar el bloqueo de emergencia.",
        variant: "destructive",
      });
    },
  });

  const handleEmergencyLock = () => {
    if (window.confirm("¿Estás seguro de que quieres bloquear todas las tablets? Esta acción afectará a todos los estudiantes.")) {
      emergencyLockMutation.mutate();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 flex gap-2 z-40">
      <Tooltip>
        <TooltipTrigger asChild>
          <ReportsModal>
            <Button 
              className="bg-primary text-primary-foreground p-3 rounded-full shadow-lg hover:bg-primary/90"
              size="icon"
              data-testid="button-quick-reports"
            >
              <BarChart3 className="w-5 h-5" />
            </Button>
          </ReportsModal>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Generar reportes</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            className="bg-yellow-500 text-white p-3 rounded-full shadow-lg hover:bg-yellow-600"
            size="icon"
            data-testid="button-quick-alert"
          >
            <AlertTriangle className="w-5 h-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Ver alertas activas</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            className="bg-orange-500 text-white p-3 rounded-full shadow-lg hover:bg-orange-600"
            size="icon"
            data-testid="button-quick-security"
          >
            <Shield className="w-5 h-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Configuración de seguridad</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            className="bg-destructive text-destructive-foreground p-3 rounded-full shadow-lg hover:bg-destructive/90"
            size="icon"
            onClick={handleEmergencyLock}
            disabled={emergencyLockMutation.isPending}
            data-testid="button-emergency-lock"
          >
            <Lock className="w-5 h-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Bloqueo de emergencia</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
