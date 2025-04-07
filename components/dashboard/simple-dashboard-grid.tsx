"use client"

import { useState, useEffect, useCallback, memo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Minimize2, X, ChevronDown, ChevronUp, Maximize2 } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { DashboardCharts } from "@/components/dashboard/dashboard-charts"
import { cn } from "@/lib/utils"

interface SimpleDashboardGridProps {
  children: React.ReactNode[]
  titles: string[]
}

// Mapeo de índices a categorías
const SECTION_MAPPING: Record<number, string> = {
  1: "income",
  2: "expense",
  3: "balance",
  4: "cards",
  5: "operations",
  6: "transactions",
  7: "budgets",
};

// Memorizar componentes hijos para evitar re-renders innecesarios
const MemoizedCard = memo(({ 
  title, 
  children, 
  onExpand, 
  onToggleVisibility, 
  onToggleSection, 
  expandedSection,
  sectionKey,
  isMobile 
}: {
  title: string
  children: React.ReactNode
  onExpand: () => void
  onToggleVisibility: () => void
  onToggleSection: () => void
  expandedSection: string | null
  sectionKey: string | null
  isMobile: boolean
}) => (
  <Card className="w-full">
    <CardHeader className="flex flex-row items-center justify-between p-3">
      <CardTitle className="text-base">{title}</CardTitle>
      <div className="flex items-center gap-1">
        {sectionKey && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSection}
            className={expandedSection === sectionKey ? "bg-muted" : ""}
            aria-pressed={expandedSection === sectionKey}
            aria-label={expandedSection === sectionKey ? "Hide charts" : "Show charts"}
          >
            {expandedSection === sectionKey ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onExpand}
          aria-label="Expand"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
        {!isMobile && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onToggleVisibility}
            aria-label="Hide"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </CardHeader>
    <CardContent className="p-3">{children}</CardContent>
  </Card>
));

MemoizedCard.displayName = "MemoizedCard";

export function SimpleDashboardGrid({ children, titles }: SimpleDashboardGridProps) {
  const { t } = useLanguage()
  const [expandedWidget, setExpandedWidget] = useState<number | null>(null)
  const [hiddenWidgets, setHiddenWidgets] = useState<number[]>([])
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)

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
        // Resetear en caso de error
        localStorage.removeItem("dashboardHiddenWidgets")
      }
    }
  }, [])

  // Guardar estado de widgets ocultos en localStorage
  useEffect(() => {
    localStorage.setItem("dashboardHiddenWidgets", JSON.stringify(hiddenWidgets))
  }, [hiddenWidgets])

  // Expandir/contraer widget con useCallback
  const toggleWidgetExpansion = useCallback((index: number) => {
    setExpandedWidget(prev => prev === index ? null : index)
    
    // Si el widget se expande, resetear la sección expandida
    setExpandedSection(null)
  }, [])

  // Expandir/contraer sección para mostrar gráficos con useCallback
  const toggleSectionExpansion = useCallback((index: number) => {
    const section = SECTION_MAPPING[index]
    if (!section) return
    
    setExpandedSection(prev => prev === section ? null : section)
  }, [])

  // Mostrar/ocultar widget con useCallback
  const toggleWidgetVisibility = useCallback((index: number) => {
    setHiddenWidgets(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index) 
        : [...prev, index]
    )
  }, [])

  // Si hay un widget expandido, mostrarlo a pantalla completa
  if (expandedWidget !== null) {
    return (
      <div className="relative">
        <Card className="w-full h-[calc(100vh-12rem)] overflow-auto">
          <CardHeader className="flex flex-row items-center justify-between sticky top-0 bg-card z-10">
            <CardTitle>{titles[expandedWidget]}</CardTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => toggleWidgetExpansion(expandedWidget)}
              aria-label="Minimize"
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {children[expandedWidget]}

            {/* Mostrar gráficos relacionados si es una sección que puede tenerlos */}
            {SECTION_MAPPING[expandedWidget] && (
              <div className="mt-8">
                <DashboardCharts expandedSection={SECTION_MAPPING[expandedWidget]} />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  const gridClasses = cn(
    'grid gap-4',
    isMobile
      ? 'grid-cols-1'
      : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
  );

  return (
    <div className="space-y-4">
      {/* Primero renderizamos el widget de resumen (DashboardSummary) */}
      {!hiddenWidgets.includes(0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((index) => {
            if (hiddenWidgets.includes(index)) {
              return null
            }

            return (
              <MemoizedCard
                key={index}
                title={titles[index]}
                onExpand={() => toggleWidgetExpansion(index)}
                onToggleVisibility={() => toggleWidgetVisibility(index)}
                onToggleSection={() => toggleSectionExpansion(index)}
                expandedSection={expandedSection}
                sectionKey={SECTION_MAPPING[index]}
                isMobile={isMobile}
              >
                {children[index]}
              </MemoizedCard>
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
        <MemoizedCard
          title={titles[5]}
          onExpand={() => toggleWidgetExpansion(5)}
          onToggleVisibility={() => toggleWidgetVisibility(5)}
          onToggleSection={() => toggleSectionExpansion(5)}
          expandedSection={expandedSection}
          sectionKey={SECTION_MAPPING[5]}
          isMobile={isMobile}
        >
          {children[5]}
        </MemoizedCard>
      )}

      {/* Finalmente renderizamos los widgets restantes */}
      <div className={gridClasses}>
        {children.map((child, index) => {
          // Omitir los widgets ya renderizados o los ocultos
          if (hiddenWidgets.includes(index) || index === 5 || index <= 4) {
            return null
          }

          return (
            <MemoizedCard
              key={index}
              title={titles[index]}
              onExpand={() => toggleWidgetExpansion(index)}
              onToggleVisibility={() => toggleWidgetVisibility(index)}
              onToggleSection={() => toggleSectionExpansion(index)}
              expandedSection={expandedSection}
              sectionKey={SECTION_MAPPING[index]}
              isMobile={isMobile}
            >
              {child}
            </MemoizedCard>
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
  )
}

