import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TabletWithStudent } from "@/lib/types";
import { Tablet, Eye, Lock, MessageSquare, Unlock } from "lucide-react";
import { useState } from "react";
import StudentDetailModal from "./student-detail-modal";

interface TabletCardProps {
  tablet: TabletWithStudent;
}

export default function TabletCard({ tablet }: TabletCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'blocked':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online':
        return 'En línea';
      case 'warning':
        return 'Advertencia';
      case 'blocked':
        return 'Bloqueado';
      default:
        return 'Desconectado';
    }
  };

  const getActivityColor = (category: string | null) => {
    if (!category) return 'text-muted-foreground';
    switch (category) {
      case 'educational':
        return 'text-green-600';
      case 'entertainment':
        return 'text-yellow-600';
      case 'inappropriate':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  return (
    <>
      <Card 
        className={`hover:shadow-md transition-shadow status-indicator ${
          tablet.status === 'online' ? 'status-online' :
          tablet.status === 'warning' ? 'status-warning' :
          tablet.status === 'blocked' ? 'status-blocked' : ''
        } ${tablet.status === 'warning' ? 'border-yellow-200' : tablet.status === 'blocked' ? 'border-red-200' : ''}`}
        data-testid={`card-tablet-${tablet.id}`}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Tablet className={`w-4 h-4 ${
                tablet.status === 'online' ? 'text-primary' :
                tablet.status === 'warning' ? 'text-yellow-600' :
                tablet.status === 'blocked' ? 'text-destructive' : 'text-muted-foreground'
              }`} />
              <span className="font-medium" data-testid={`text-tablet-number-${tablet.id}`}>
                {tablet.tabletNumber}
              </span>
            </div>
            <Badge 
              className={`text-xs ${getStatusColor(tablet.status)}`}
              data-testid={`badge-status-${tablet.id}`}
            >
              {getStatusText(tablet.status)}
            </Badge>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Estudiante:</span>
              <span className="font-medium" data-testid={`text-student-name-${tablet.id}`}>
                {tablet.student?.name || 'Sin asignar'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Actividad actual:</span>
              <span 
                className={`font-medium ${getActivityColor(tablet.currentApp)}`}
                data-testid={`text-current-activity-${tablet.id}`}
              >
                {tablet.currentApp || 'Inactivo'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tiempo activo:</span>
              <span data-testid={`text-active-time-${tablet.id}`}>
                {tablet.screenTime} min
              </span>
            </div>
          </div>
          
          <div className="mt-4 flex gap-2">
            <Button 
              className="flex-1 text-sm" 
              size="sm"
              onClick={() => setShowDetails(true)}
              data-testid={`button-view-details-${tablet.id}`}
            >
              <Eye className="w-4 h-4 mr-1" />
              Ver detalles
            </Button>
            
            {tablet.status === 'blocked' ? (
              <Button 
                variant="outline" 
                size="sm"
                className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                data-testid={`button-unblock-${tablet.id}`}
              >
                <Unlock className="w-4 h-4" />
              </Button>
            ) : tablet.status === 'warning' ? (
              <Button 
                variant="outline" 
                size="sm"
                className="bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100"
                data-testid={`button-block-app-${tablet.id}`}
              >
                <Lock className="w-4 h-4" />
              </Button>
            ) : (
              <Button 
                variant="outline" 
                size="sm"
                data-testid={`button-take-control-${tablet.id}`}
              >
                <MessageSquare className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <StudentDetailModal 
        tablet={tablet}
        open={showDetails}
        onOpenChange={setShowDetails}
      />
    </>
  );
}
