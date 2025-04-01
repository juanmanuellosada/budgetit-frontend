"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Minimize2, X, ChevronDown, ChevronUp, Maximize2 } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { DashboardCharts } from "@/components/dashboard/dashboard-charts"

interface SimpleDashboardGridProps {
  children: React.ReactNode[]
  titles: string[]
}

export function SimpleDashboardGrid({ children, titles }: SimpleDashboardGridProps) {
  const { t } = useLanguage()
  const [expandedWidget, setExpandedWidget] = useState<number | null>(null)
  const [hiddenWidgets, setHiddenWidgets] = useState<number[]>([])
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  // Mapeo de índices a categorías
  const sectionMapping: { [key: number]: string } = {
    1: "income",
    2: "expense",
    3: "balance",
    4: "cards",
    5: "operations",
    6: "transactions",
    7: "budgets",
  }

  // Detectar si estamos en un dispositivo móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Cargar estado de widgets ocultos desde localStorage
  useEffect(() => {
    const savedHiddenWidgets = localStorage.getItem("dashboardHiddenWidgets")
    if (savedHiddenWidgets) {
      try {
        setHiddenWidgets(JSON.parse(savedHiddenWidgets))
      } catch (e) {
        console.error("Error parsing saved hidden widgets:", e)
      }
    }

    const savedLayout = localStorage.getItem("dashboardLayout")
    if (savedLayout && (savedLayout === "grid" || savedLayout === "list")) {
      localStorage.removeItem("dashboardLayout")
    }
  }, [])

  // Guardar estado de widgets ocultos en localStorage
  useEffect(() => {
    localStorage.setItem("dashboardHiddenWidgets", JSON.stringify(hiddenWidgets))
  }, [hiddenWidgets])

  // Guardar layout en localStorage
  useEffect(() => {
    localStorage.removeItem("dashboardLayout")
  }, [])

  // Expandir/contraer widget
  const toggleWidgetExpansion = (index: number) => {
    setExpandedWidget(expandedWidget === index ? null : index)

    // Si el widget se expande, resetear la sección expandida
    if (expandedWidget !== index) {
      setExpandedSection(null)
    }
  }

  // Expandir/contraer sección para mostrar gráficos
  const toggleSectionExpansion = (index: number) => {
    const section = sectionMapping[index]
    setExpandedSection(expandedSection === section ? null : section)
  }

  // Mostrar/ocultar widget
  const toggleWidgetVisibility = (index: number) => {
    setHiddenWidgets((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

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
          <CardContent>
            {children[expandedWidget]}

            {/* Mostrar gráficos relacionados si es una sección que puede tenerlos */}
            {sectionMapping[expandedWidget] && (
              <div className="mt-8">
                <DashboardCharts expandedSection={sectionMapping[expandedWidget]} />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {/* Primero renderizamos el widget de resumen (DashboardSummary) */}
        {!hiddenWidgets.includes(0) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((index) => {
              if (hiddenWidgets.includes(index)) {
                return null
              }

              return (
                <Card key={index} className="w-full">
                  <CardHeader className="flex flex-row items-center justify-between p-3">
                    <CardTitle className="text-base">{titles[index]}</CardTitle>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleSectionExpansion(index)}
                        className={expandedSection === sectionMapping[index] ? "bg-muted" : ""}
                      >
                        {expandedSection === sectionMapping[index] ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => toggleWidgetExpansion(index)}>
                        <Maximize2 className="h-4 w-4" />
                      </Button>
                      {!isMobile && (
                        <Button variant="ghost" size="icon" onClick={() => toggleWidgetVisibility(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-3">{children[index]}</CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Mostrar gráficos relacionados si hay una sección expandida */}
        {expandedSection && (
          <Card className="w-full p-4">
            <DashboardCharts expandedSection={expandedSection} />
          </Card>
        )}

        {/* Luego renderizamos el Resumen de Operaciones a ancho completo */}
        {!hiddenWidgets.includes(5) && (
          <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between p-3">
              <CardTitle className="text-base">{titles[5]}</CardTitle>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleSectionExpansion(5)}
                  className={expandedSection === "operations" ? "bg-muted" : ""}
                >
                  {expandedSection === "operations" ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => toggleWidgetExpansion(5)}>
                  <Maximize2 className="h-4 w-4" />
                </Button>
                {!isMobile && (
                  <Button variant="ghost" size="icon" onClick={() => toggleWidgetVisibility(5)}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-3">{children[5]}</CardContent>
          </Card>
        )}

        {/* Finalmente renderizamos los widgets restantes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {children.map((child, index) => {
            // Omitir los widgets ya renderizados o los ocultos
            if (hiddenWidgets.includes(index) || index === 5 || index <= 4) {
              return null
            }

            return (
              <Card key={index} className="w-full">
                <CardHeader className="flex flex-row items-center justify-between p-3">
                  <CardTitle className="text-base">{titles[index]}</CardTitle>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleSectionExpansion(index)}
                      className={expandedSection === sectionMapping[index] ? "bg-muted" : ""}
                    >
                      {expandedSection === sectionMapping[index] ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => toggleWidgetExpansion(index)}>
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                    {!isMobile && (
                      <Button variant="ghost" size="icon" onClick={() => toggleWidgetVisibility(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-3">{child}</CardContent>
              </Card>
            )
          })}
        </div>

        {/* Sección de gráficos globales si no hay ninguna sección expandida */}
        {!expandedSection && (
          <Card className="w-full mt-6">
            <CardContent className="p-4">
              <DashboardCharts />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

