"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { cn } from "@/lib/utils"
import { Maximize2, Minimize2, X } from "lucide-react"


// Importamos dinámicamente react-grid-layout para evitar problemas con SSR
import dynamic from "next/dynamic"

// Definimos los tipos para Layout
interface Layout {
  i: string
  x: number
  y: number
  w: number
  h: number
  minW?: number
  minH?: number
}

// Importamos react-grid-layout dinámicamente para evitar problemas con SSR
const ResponsiveGridLayout = dynamic(
  () =>
    import("react-grid-layout").then((mod) => {
      const { Responsive, WidthProvider } = mod
      return WidthProvider(Responsive)
    }),
  { ssr: false },
)

interface DashboardGridProps {
  children: React.ReactNode[]
  titles: string[]
  defaultLayouts?: {
    lg: Layout[]
    md: Layout[]
    sm: Layout[]
    xs: Layout[]
  }
}

export function DashboardGrid({ children, titles, defaultLayouts }: DashboardGridProps) {
  const { t } = useLanguage()
  const [mounted, setMounted] = useState(false)
  const [layouts, setLayouts] = useState(
    defaultLayouts || {
      lg: [],
      md: [],
      sm: [],
      xs: [],
    },
  )
  const [expandedWidget, setExpandedWidget] = useState<number | null>(null)
  const [widgetSettings, setWidgetSettings] = useState<{ [key: string]: { visible: boolean } }>({})

  // Inicializar configuraciones de widgets si no existen
  useEffect(() => {
    const initialWidgetSettings: { [key: string]: { visible: boolean } } = {}
    children.forEach((_, index) => {
      initialWidgetSettings[index.toString()] = { visible: true }
    })
    setWidgetSettings(initialWidgetSettings)
  }, [children])

  // Generar layouts por defecto si no se proporcionan
// Generar layouts por defecto si no se proporcionan
useEffect(() => {
  if (!defaultLayouts && mounted) {
    const generatedLayouts: { lg: Layout[]; md: Layout[]; sm: Layout[]; xs: Layout[] } = {
      lg: [],
      md: [],
      sm: [],
      xs: [],
    }

    // Determinar qué índice tiene el Resumen de Operaciones
    const operationsSummaryIndex = titles.findIndex((title) => title === t("operationsSummary"))

    // Layout para pantallas grandes (lg)
    children.forEach((_, i) => {
    // El widget de Resumen de Operaciones ocupa todo el ancho y se ubica al inicio
    if (titles[i] === t("operationsSummary")) {
        generatedLayouts.lg.push({
        i: i.toString(),
        x: 0, // Mantener a la izquierda
        y: 0, // Al inicio
        w: 12, // Ocupa todo el ancho
        h: 8,
        minW: 6,
        minH: 4,
        })
    } else if (titles[i] === t("expensesByCategory") || titles[i] === t("incomeVsExpenses")) {
        // Dar más espacio a los gráficos
        const adjustedIndex = i > operationsSummaryIndex ? i - 1 : i;
        const column = adjustedIndex % 2; // Solo 2 columnas para gráficos
        generatedLayouts.lg.push({
        i: i.toString(),
        x: column * 6, // 6 unidades de ancho cada uno (2 columnas)
        y: Math.floor(adjustedIndex / 2) * 6 + (operationsSummaryIndex !== -1 ? 8 : 0),
        w: 6, // Más ancho para gráficos
        h: 6, // Más alto para gráficos
        minW: 4,
        minH: 4,
        })
    } else {
        // Widgets normales
        const adjustedIndex = i > operationsSummaryIndex ? i - 1 : i;
        generatedLayouts.lg.push({
        i: i.toString(),
        x: (adjustedIndex % 4) * 3,
        y: Math.floor(adjustedIndex / 4) * 4 + (operationsSummaryIndex !== -1 ? 14 : 0), // Más abajo, después de gráficos
        w: 3,
        h: 4,
        minW: 2,
        minH: 2,
        })
    }
    })

    // Layout para pantallas medianas (md)
    children.forEach((_, i) => {
      if (titles[i] === t("operationsSummary")) {
        generatedLayouts.md.push({
          i: i.toString(),
          x: 0,
          y: 0, // Se coloca al principio
          w: 8,
          h: 8,
          minW: 4,
          minH: 4,
        })
      } else {
        const adjustedIndex = i > operationsSummaryIndex ? i - 1 : i;
        generatedLayouts.md.push({
          i: i.toString(),
          x: (adjustedIndex % 2) * 4,
          y: Math.floor(adjustedIndex / 2) * 4 + (operationsSummaryIndex !== -1 ? 8 : 0),
          w: 4,
          h: 4,
          minW: 2,
          minH: 2,
        })
      }
    })

    // Layout para pantallas pequeñas (sm)
    children.forEach((_, i) => {
      // Para pantallas pequeñas, primero mostramos el resumen de operaciones
      if (titles[i] === t("operationsSummary")) {
        generatedLayouts.sm.push({
          i: i.toString(),
          x: 0,
          y: 0,
          w: 6,
          h: 6, // Hacerlo un poco más alto
          minW: 2,
          minH: 2,
        })
      } else {
        generatedLayouts.sm.push({
          i: i.toString(),
          x: 0,
          y: (i > operationsSummaryIndex ? i - 1 : i) * 4 + (operationsSummaryIndex !== -1 ? 6 : 0),
          w: 6,
          h: 4,
          minW: 2,
          minH: 2,
        })
      }
    })

    // Layout para pantallas muy pequeñas (xs)
    children.forEach((_, i) => {
      if (titles[i] === t("operationsSummary")) {
        generatedLayouts.xs.push({
          i: i.toString(),
          x: 0,
          y: 0,
          w: 4,
          h: 6,
          minW: 2,
          minH: 2,
        })
      } else {
        generatedLayouts.xs.push({
          i: i.toString(),
          x: 0,
          y: (i > operationsSummaryIndex ? i - 1 : i) * 4 + (operationsSummaryIndex !== -1 ? 6 : 0),
          w: 4,
          h: 4,
          minW: 2,
          minH: 2,
        })
      }
    })

    setLayouts(generatedLayouts)
  }
}, [children, defaultLayouts, t, mounted])

  // Necesario para evitar errores de hidratación con SSR
  useEffect(() => {
    setMounted(true)
  }, [])

  // Guardar layouts en localStorage cuando cambian
  useEffect(() => {
    if (mounted && Object.keys(layouts).length > 0) {
      localStorage.setItem("dashboardLayouts", JSON.stringify(layouts))
    }
  }, [layouts, mounted])

  // Cargar layouts desde localStorage al montar
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLayouts = localStorage.getItem("dashboardLayouts")
      if (savedLayouts) {
        try {
          setLayouts(JSON.parse(savedLayouts))
        } catch (e) {
          console.error("Error parsing saved layouts:", e)
        }
      }
    }
  }, [])

  // Manejar cambios en el layout
  const handleLayoutChange = (currentLayout: Layout[], allLayouts: { [key: string]: Layout[] }) => {
    setLayouts({
      lg: allLayouts.lg || [],
      md: allLayouts.md || [],
      sm: allLayouts.sm || [],
      xs: allLayouts.xs || []
    })
  }

  // Expandir/contraer widget
  const toggleWidgetExpansion = (index: number) => {
    setExpandedWidget(expandedWidget === index ? null : index)
  }

  // Mostrar/ocultar widget
  const toggleWidgetVisibility = (index: string) => {
    setWidgetSettings((prev) => ({
      ...prev,
      [index]: { ...prev[index], visible: !prev[index]?.visible },
    }))
  }

  if (!mounted) return <div>Cargando dashboard...</div>

  // Si hay un widget expandido, mostrarlo a pantalla completa
  if (expandedWidget !== null) {
    return (
      <div className="relative">
        <Card className="w-full h-[calc(100vh-12rem)] overflow-auto">
          <CardHeader className="flex flex-row items-center justify-between sticky top-0 bg-card z-10">
            <CardTitle>{titles[expandedWidget]}</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => toggleWidgetExpansion(expandedWidget)}>
              <Minimize2 className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>{children[expandedWidget]}</CardContent>
        </Card>
      </div>
    )
  }

  // Renderizar grid estático si no está disponible react-grid-layout
  if (!ResponsiveGridLayout) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {children.map((child, index) => {
          if (!widgetSettings[index.toString()]?.visible) {
            return null
          }

          return (
            <Card key={index} className="w-full">
              <CardHeader className="flex flex-row items-center justify-between p-3">
                <CardTitle className="text-base">{titles[index]}</CardTitle>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={() => toggleWidgetExpansion(index)}>
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-3">{child}</CardContent>
            </Card>
          )
        })}
      </div>
    )
  }

return (
<div className="relative flex flex-col gap-4">
    {/* Tabs para selección de widgets */}
    <div className="flex flex-wrap gap-2 bg-muted/20 p-2 rounded-lg overflow-x-auto">
    {titles.map((title, idx) => (
        <Button
        key={idx}
        variant={widgetSettings[idx.toString()]?.visible ? "default" : "outline"}
        size="sm"
        className="text-xs"
        onClick={() => toggleWidgetVisibility(idx.toString())}
        >
        {title}
        </Button>
    ))}
    </div>

    <ResponsiveGridLayout
    className="layout"
    layouts={layouts}
    breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480 }}
    cols={{ lg: 12, md: 12, sm: 6, xs: 4 }} // Actualiza las columnas para md
    rowHeight={60}
    onLayoutChange={handleLayoutChange}
    isDraggable={true}
    isResizable={true}
    margin={[16, 16]}
    >
    {children.map((child, index) => {
        // No renderizar widgets ocultos
        if (!widgetSettings[index.toString()]?.visible) {
        return null
        }

        return (
        <div key={index.toString()} className="relative">
            <Card className="w-full h-full overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between p-3">
                <CardTitle className="text-base">{titles[index]}</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => toggleWidgetExpansion(index)}>
                <Maximize2 className="h-4 w-4" />
                </Button>
            </CardHeader>
            <CardContent
                className={cn(
                "p-3 overflow-auto",
                titles[index] === t("operationsSummary") ? "h-[calc(100%-3rem)]" : "",
                (titles[index] === t("expensesByCategory") || titles[index] === t("incomeVsExpenses")) ? "h-[350px]" : ""
                )}
            >
                {child}
            </CardContent>
            </Card>
        </div>
        )
    })}
    </ResponsiveGridLayout>
</div>
)
}

