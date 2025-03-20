"use client"

import { useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Settings } from "lucide-react"

interface ChartManagerProps {
  availableCharts: { id: string; name: string }[]
  activeCharts: string[]
  onToggleChart: (chartId: string) => void
}

export function ChartManager({ availableCharts, activeCharts, onToggleChart }: ChartManagerProps) {
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Settings className="h-4 w-4 mr-2" />
        {t("customizeCharts")}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("customizeCharts")}</DialogTitle>
            <DialogDescription>{t("selectChartsToDisplay")}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {availableCharts.map((chart) => (
              <div key={chart.id} className="flex items-center space-x-2">
                <Checkbox
                  id={chart.id}
                  checked={activeCharts.includes(chart.id)}
                  onCheckedChange={() => onToggleChart(chart.id)}
                />
                <Label htmlFor={chart.id}>{chart.name}</Label>
              </div>
            ))}
          </div>
          <Button onClick={() => setOpen(false)}>{t("done")}</Button>
        </DialogContent>
      </Dialog>
    </>
  )
}

