import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Search, Users, Tablet } from "lucide-react";
import { Student } from "@shared/schema";
import { useState } from "react";

export default function Students() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: students, isLoading } = useQuery<Student[]>({
    queryKey: ['/api/students'],
  });

  const filteredStudents = students?.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.grade.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <div className="flex-1 overflow-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-20 bg-muted rounded-lg"></div>
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
            <h2 className="text-xl font-semibold">Gestión de Estudiantes</h2>
            <p className="text-sm text-muted-foreground">
              Administra la información de los estudiantes y sus tablets asignadas
            </p>
          </div>
          <Button data-testid="button-add-student">
            <UserPlus className="w-4 h-4 mr-2" />
            Agregar Estudiante
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-6">
        {/* Search and Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar estudiantes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search-students"
            />
          </div>
          <div className="text-sm text-muted-foreground">
            {filteredStudents.length} estudiante{filteredStudents.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Students List */}
        <Card>
          <CardContent className="p-6">
            {filteredStudents.length > 0 ? (
              <div className="space-y-4">
                {filteredStudents.map((student) => (
                  <div 
                    key={student.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                    data-testid={`student-card-${student.id}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium" data-testid={`text-student-name-${student.id}`}>
                          {student.name}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span data-testid={`text-student-grade-${student.id}`}>
                            Grado: {student.grade}
                          </span>
                          {student.email && (
                            <span data-testid={`text-student-email-${student.id}`}>
                              {student.email}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      {student.tabletId ? (
                        <div className="flex items-center gap-2">
                          <Tablet className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-green-600 font-medium" data-testid={`text-tablet-id-${student.id}`}>
                            {student.tabletId}
                          </span>
                          <Badge 
                            className="bg-green-100 text-green-800"
                            data-testid={`badge-tablet-status-${student.id}`}
                          >
                            Asignada
                          </Badge>
                        </div>
                      ) : (
                        <Badge 
                          variant="secondary"
                          data-testid={`badge-no-tablet-${student.id}`}
                        >
                          Sin tablet
                        </Badge>
                      )}
                      
                      <Badge 
                        className={student.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                        data-testid={`badge-active-status-${student.id}`}
                      >
                        {student.isActive ? 'Activo' : 'Inactivo'}
                      </Badge>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        data-testid={`button-edit-student-${student.id}`}
                      >
                        Editar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No hay estudiantes registrados</h3>
                <p className="text-sm mb-4">
                  {searchQuery 
                    ? "No se encontraron estudiantes que coincidan con la búsqueda"
                    : "Comienza agregando estudiantes al sistema"
                  }
                </p>
                <Button data-testid="button-add-first-student">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Agregar Primer Estudiante
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
