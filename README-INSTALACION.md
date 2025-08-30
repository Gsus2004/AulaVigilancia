# Sistema de Monitoreo de Tablets para Aula - EduMonitor

## Descripción del Sistema

EduMonitor es un sistema completo de monitoreo en tiempo real para tablets en entornos educativos. Permite a los docentes supervisar la actividad de los estudiantes, gestionar la seguridad digital y generar reportes detallados.

## Características Principales

✅ **Monitoreo en Tiempo Real**
- Seguimiento continuo de la actividad en cada tablet
- Visualización de aplicaciones activas y navegación web
- Estado en vivo de todos los dispositivos

✅ **Sistema de Alertas Automáticas**
- Detección automática de contenido inapropiado
- Alertas por tiempo excesivo de uso
- Notificaciones de descargas no autorizadas

✅ **Control de Seguridad Digital**
- Bloqueo de sitios web específicos
- Restricción de aplicaciones
- Control de descargas
- Políticas de seguridad configurables

✅ **Panel de Administración Completo**
- Dashboard con estadísticas en tiempo real
- Gestión de estudiantes y tablets
- Sistema de reportes exportables (PDF/Excel)
- Configuración avanzada del sistema

✅ **Funciones de Emergencia**
- Bloqueo inmediato de todas las tablets
- Control individual de dispositivos
- Resolución rápida de alertas

## Estructura del Proyecto

```
tablet-monitoring-system/
├── client/                    # Frontend React
│   ├── src/
│   │   ├── components/       # Componentes UI
│   │   ├── pages/           # Páginas de la aplicación
│   │   ├── hooks/           # Hooks personalizados
│   │   └── lib/             # Utilidades y configuración
├── server/                   # Backend Express
│   ├── db.ts               # Configuración de base de datos
│   ├── storage.ts          # Lógica de almacenamiento
│   └── routes.ts           # API endpoints
├── shared/                  # Esquemas compartidos
│   └── schema.ts           # Modelos de base de datos
└── archivos de configuración
```

## Requisitos Previos

- Node.js 18 o superior
- PostgreSQL
- NPM o Yarn

## Instrucciones de Instalación

### 1. Extraer el Proyecto
```bash
tar -xzf tablet-monitoring-system.tar.gz
cd tablet-monitoring-export
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Configurar Base de Datos
1. Crear una base de datos PostgreSQL
2. Crear archivo `.env` con:
```env
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/edumonitor"
```

### 4. Inicializar Base de Datos
```bash
npm run db:push
```

### 5. Ejecutar la Aplicación
```bash
npm run dev
```

La aplicación estará disponible en: `http://localhost:5000`

## Funcionalidades Disponibles

### Dashboard Principal
- Estadísticas en tiempo real
- Vista general de tablets activas
- Alertas recientes
- Acceso rápido a funciones principales

### Monitoreo en Vivo
- Vista de todas las tablets en tiempo real
- Filtros por estado (en línea, alertas, bloqueadas)
- Actualización automática cada 30 segundos
- Control individual de dispositivos

### Gestión de Estudiantes
- Lista completa de estudiantes registrados
- Asignación de tablets
- Búsqueda y filtrado
- Historial de actividades por estudiante

### Sistema de Reportes
- Reportes personalizables por fecha y estudiante
- Exportación en PDF y Excel
- Tipos de reporte:
  - Actividad por estudiante
  - Resumen de clase
  - Sitios web visitados
  - Aplicaciones utilizadas
  - Alertas y bloqueos

### Gestión de Alertas
- Vista de todas las alertas del sistema
- Filtros por severidad y estado
- Resolución de alertas
- Historial completo

### Seguridad Digital
- Configuración de sitios bloqueados
- Políticas de seguridad
- Control de contenido automático
- Acciones de emergencia

### Configuración
- Información institucional
- Parámetros del sistema
- Gestión de usuarios
- Preferencias de notificación

## Base de Datos

El sistema utiliza PostgreSQL con las siguientes tablas principales:

- **users**: Usuarios del sistema (docentes, administradores)
- **students**: Información de estudiantes
- **tablets**: Dispositivos registrados
- **activities**: Registro de actividades
- **alerts**: Sistema de alertas
- **blocked_sites**: Sitios web bloqueados
- **security_policies**: Políticas de seguridad

## Tecnologías Utilizadas

### Frontend
- React 18 con TypeScript
- Vite para desarrollo
- Tailwind CSS para estilos
- Shadcn/ui para componentes
- TanStack Query para gestión de estado
- Wouter para routing

### Backend
- Node.js con Express
- Drizzle ORM para base de datos
- TypeScript
- PostgreSQL

## Soporte y Desarrollo

Este sistema está diseñado para entornos educativos reales y proporciona todas las herramientas necesarias para el monitoreo efectivo de tablets en el aula.

Para soporte técnico o personalizaciones adicionales, contacte al desarrollador.

---

**EduMonitor** - Sistema de Monitoreo Educativo
Desarrollado para instituciones educativas