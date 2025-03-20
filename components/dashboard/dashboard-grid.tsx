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
  useEffect(() => {
    if (!defaultLayouts && mounted) {
      const generatedLayouts: { [key: string]: Layout[] } = {
        lg: [],
        md: [],
        sm: [],
        xs: [],
      }

      // Layout para pantallas grandes (lg)
      children.forEach((_, i) => {
        // El widget de Resumen de Operaciones ocupa todo el ancho
        if (titles[i] === t("operationsSummary")) {
          generatedLayouts.lg.push({
            i: i.toString(),
            x: 0,
            y: 4,
            w: 12,
            h: 8,
            minW: 6,
            minH: 4,
          })
        } else {
          // Otros widgets se distribuyen en una cuadrícula
          generatedLayouts.lg.push({
            i: i.toString(),
            x: (i % 4) * 3,
            y: Math.floor(i / 4) * 4,
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
            y: 4,
            w: 8,
            h: 8,
            minW: 4,
            minH: 4,
          })
        } else {
          generatedLayouts.md.push({
            i: i.toString(),
            x: (i % 2) * 4,
            y: Math.floor(i / 2) * 4,
            w: 4,
            h: 4,
            minW: 2,
            minH: 2,
          })
        }
      })

      // Layout para pantallas pequeñas (sm)
      children.forEach((_, i) => {
        generatedLayouts.sm.push({
          i: i.toString(),
          x: 0,
          y: i * 4,
          w: 6,
          h: 4,
          minW: 2,
          minH: 2,
        })
      })

      // Layout para pantallas muy pequeñas (xs)
      children.forEach((_, i) => {
        generatedLayouts.xs.push({
          i: i.toString(),
          x: 0,
          y: i * 4,
          w: 4,
          h: 4,
          minW: 2,
          minH: 2,
        })
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
    setLayouts(allLayouts)
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

  // Resetear layout a valores por defecto
  const resetLayout = () => {
    localStorage.removeItem("dashboardLayouts")
    setLayouts(
      defaultLayouts || {
        lg: [],
        md: [],
        sm: [],
        xs: [],
      },
    )

    // Restablecer visibilidad de todos los widgets
    const resetWidgetSettings: { [key: string]: { visible: boolean } } = {}
    children.forEach((_, index) => {
      resetWidgetSettings[index.toString()] = { visible: true }
    })
    setWidgetSettings(resetWidgetSettings)

    setExpandedWidget(null)
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
    <div className="relative">
      <div className="flex justify-end mb-4 gap-2">
        <Button variant="outline" size="sm" onClick={resetLayout}>
          {t("resetLayout")}
        </Button>
      </div>

      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480 }}
        cols={{ lg: 12, md: 8, sm: 6, xs: 4 }}
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
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={() => toggleWidgetExpansion(index)}>
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => toggleWidgetVisibility(index.toString())}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent
                  className={cn(
                    "p-3 overflow-auto",
                    titles[index] === t("operationsSummary") ? "h-[calc(100%-3rem)]" : "",
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

