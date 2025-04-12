"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { 
  AlertCircle, 
  ArrowDown, 
  ArrowUp, 
  Lightbulb, 
  TrendingUp, 
  TrendingDown, 
  Banknote,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  BarChart3,
  ChevronRight 
} from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { predictiveAnalyticsService } from "@/services/analytics/predictive-analytics"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from "recharts"

/**
 * Componente que muestra insights financieros basados en análisis predictivo
 */
export function FinancialInsights() {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState("patterns")
  const [insightData, setInsightData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Cargar datos de predicción al montar el componente
  useEffect(() => {
    const loadInsights = () => {
      setIsLoading(true)
      try {
        const data = predictiveAnalyticsService.getPredictionData()
        setInsightData(data)
      } catch (error) {
        console.error("Error cargando insights financieros:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadInsights()
  }, [])

  // Manejar el refresco manual de los datos
  const handleRefreshInsights = () => {
    setIsLoading(true)
    try {
      const data = predictiveAnalyticsService.analyzePredictions()
      setInsightData(data)
    } catch (error) {
      console.error("Error actualizando insights financieros:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("financialInsights")}</CardTitle>
          <CardDescription>{t("smartAnalysisOfYourSpending")}</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center min-h-[300px]">
          <div className="flex flex-col items-center">
            <div className="animate-spin h-8 w-8 border-2 border-primary rounded-full border-t-transparent mb-4"></div>
            <p className="text-muted-foreground">{t("analyzingYourFinancialData")}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!insightData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("financialInsights")}</CardTitle>
          <CardDescription>{t("smartAnalysisOfYourSpending")}</CardDescription>
        </CardHeader>
        <CardContent className="min-h-[300px]">
          <Alert className="bg-muted">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>{t("insufficientData")}</AlertTitle>
            <AlertDescription>
              {t("needMoreTransactionsForInsights")}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  // Formatear la fecha de actualización de datos
  const lastUpdated = new Date(insightData.lastUpdated)
  const formattedLastUpdated = lastUpdated.toLocaleDateString(t("locale"), {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>{t("financialInsights")}</CardTitle>
          <CardDescription>{t("smartAnalysisOfYourSpending")}</CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="ml-auto" 
          onClick={handleRefreshInsights}
        >
          {t("refreshAnalysis")}
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="patterns">{t("spendingPatterns")}</TabsTrigger>
            <TabsTrigger value="insights">{t("savingOpportunities")}</TabsTrigger>
            <TabsTrigger value="alerts">{t("budgetAlerts")}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="patterns" className="space-y-4">
            <h3 className="text-sm font-medium">{t("categorySpendingTrends")}</h3>
            
            {insightData.patterns.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                {t("noPatternDataAvailable")}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={insightData.patterns.slice(0, 6)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="categoryName" 
                          tick={{fontSize: 12}} 
                          tickFormatter={(value) => value.length > 8 ? `${value.substring(0, 8)}...` : value}
                        />
                        <YAxis />
                        <Tooltip 
                          formatter={(value) => [`${value.toFixed(2)} €`, t("averageMonthly")]}
                          labelFormatter={(label) => label}
                        />
                        <Bar dataKey="averageMonthly" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">{t("topSpendingCategories")}</h4>
                    <div className="space-y-2">
                      {insightData.patterns.slice(0, 4).map((pattern: any) => (
                        <div key={pattern.categoryId} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="font-medium">{pattern.categoryName}</span>
                            {pattern.trend === "increasing" && (
                              <Badge variant="destructive" className="ml-2 px-1">
                                <ArrowUp className="h-3 w-3 mr-1" /> 
                                +{pattern.percentChange.toFixed(1)}%
                              </Badge>
                            )}
                            {pattern.trend === "decreasing" && (
                              <Badge variant="default" className="ml-2 px-1 bg-green-600">
                                <ArrowDown className="h-3 w-3 mr-1" /> 
                                {pattern.percentChange.toFixed(1)}%
                              </Badge>
                            )}
                          </div>
                          <span className="text-right">
                            {pattern.averageMonthly.toFixed(2)} €/mes
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <h3 className="text-sm font-medium mt-6">{t("significantChanges")}</h3>
                <div className="space-y-4 mt-2">
                  {insightData.patterns
                    .filter((pattern: any) => Math.abs(pattern.percentChange) > 15)
                    .slice(0, 3)
                    .map((pattern: any) => (
                      <Alert key={pattern.categoryId} variant="default" className={
                        pattern.trend === "increasing" ? "border-destructive/20 bg-destructive/5" : "border-green-600/20 bg-green-600/5"
                      }>
                        {pattern.trend === "increasing" ? (
                          <TrendingUp className="h-4 w-4 text-destructive" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-green-600" />
                        )}
                        <AlertTitle className="flex items-center">
                          {pattern.categoryName}
                          <span className={`ml-2 text-xs ${pattern.trend === "increasing" ? "text-destructive" : "text-green-600"}`}>
                            {pattern.trend === "increasing" ? "+" : ""}{pattern.percentChange.toFixed(1)}%
                          </span>
                        </AlertTitle>
                        <AlertDescription>
                          {pattern.trend === "increasing" 
                            ? t("spendingIncreaseDetected") 
                            : t("spendingDecreaseDetected")}
                        </AlertDescription>
                      </Alert>
                    ))}
                    
                  {insightData.patterns.filter((p: any) => Math.abs(p.percentChange) > 15).length === 0 && (
                    <div className="text-center text-muted-foreground p-3">
                      {t("noSignificantChanges")}
                    </div>
                  )}
                </div>
              </>
            )}
          </TabsContent>
          
          <TabsContent value="insights" className="space-y-4">
            <h3 className="text-sm font-medium">{t("savingOpportunities")}</h3>
            
            {insightData.suggestions.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                {t("noSavingSuggestionsAvailable")}
              </div>
            ) : (
              <div className="space-y-4">
                {insightData.suggestions.map((suggestion: any) => (
                  <div key={suggestion.categoryId} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium flex items-center">
                          <Lightbulb className="h-4 w-4 mr-2 text-amber-500" />
                          {t("savingOpportunityIn")} {suggestion.categoryName}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {t("currentMonthlySpending")}: {suggestion.currentMonthlyAvg.toFixed(2)} €
                        </p>
                      </div>
                      <Badge className={
                        suggestion.difficulty === "easy" ? "bg-green-600" :
                        suggestion.difficulty === "moderate" ? "bg-amber-500" : "bg-destructive"
                      }>
                        {suggestion.difficulty === "easy" ? t("easy") :
                        suggestion.difficulty === "moderate" ? t("moderate") : t("challenging")}
                      </Badge>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm">
                          {t("suggestedMonthlySaving")}: <span className="font-bold text-green-600">{suggestion.suggestedSaving.toFixed(2)} €</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {t("potentialAnnualSaving")}: {suggestion.potentialAnnualSaving.toFixed(2)} €
                        </div>
                      </div>
                      
                      <Progress 
                        value={(suggestion.suggestedSaving / suggestion.currentMonthlyAvg) * 100} 
                        className="h-2" 
                      />
                    </div>
                    
                    <div className="text-sm pt-2">
                      <p>{t("savingSuggestionText", { category: suggestion.categoryName, percentage: Math.round((suggestion.suggestedSaving / suggestion.currentMonthlyAvg) * 100) })}</p>
                    </div>
                  </div>
                ))}
                
                {/* Total potencial de ahorro */}
                {insightData.suggestions.length > 0 && (
                  <div className="mt-4 p-4 border border-green-600/20 bg-green-600/5 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Banknote className="h-5 w-5 mr-2 text-green-600" />
                        <span className="font-medium">{t("totalPotentialSaving")}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">
                          {insightData.suggestions.reduce((total: number, s: any) => total + s.suggestedSaving, 0).toFixed(2)} €/{t("month")}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {insightData.suggestions.reduce((total: number, s: any) => total + s.potentialAnnualSaving, 0).toFixed(2)} €/{t("year")}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="alerts" className="space-y-4">
            <h3 className="text-sm font-medium">{t("anomaliesAndAlerts")}</h3>
            
            {/* Anomalías de gastos */}
            {insightData.anomalies.length > 0 ? (
              <div className="space-y-3">
                <h4 className="text-sm font-medium">{t("unusualTransactions")}</h4>
                {insightData.anomalies.slice(0, 3).map((anomaly: any, index: number) => (
                  <Alert key={index} variant="default" className="border-amber-500/20 bg-amber-500/5">
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                    <AlertTitle>
                      {new Date(anomaly.date).toLocaleDateString(t("locale"), { day: 'numeric', month: 'short' })} - {anomaly.transaction.amount.toFixed(2)} € ({anomaly.categoryName})
                    </AlertTitle>
                    <AlertDescription>
                      {anomaly.reason}
                    </AlertDescription>
                  </Alert>
                ))}
                {insightData.anomalies.length > 3 && (
                  <Button variant="ghost" size="sm" className="w-full">
                    {t("viewMore")} ({insightData.anomalies.length - 3}) <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                )}
              </div>
            ) : (
              <div className="p-4 border rounded-lg bg-muted flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 mr-2 text-green-600" />
                <p>{t("noAnomaliesDetected")}</p>
              </div>
            )}
            
            {/* Alertas de presupuesto */}
            <div className="mt-6">
              <h4 className="text-sm font-medium mb-3">{t("budgetRiskAlerts")}</h4>
              {(() => {
                const budgetAlerts = predictiveAnalyticsService.generateBudgetAlerts();
                
                if (budgetAlerts.length === 0) {
                  return (
                    <div className="p-4 border rounded-lg bg-muted flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 mr-2 text-green-600" />
                      <p>{t("allBudgetsOnTrack")}</p>
                    </div>
                  );
                }
                
                return (
                  <div className="space-y-3">
                    {budgetAlerts.map((alert, index) => (
                      <Alert key={index} variant="default" className={
                        alert.percentUsed >= 100 ? "border-destructive/20 bg-destructive/5" : 
                        alert.percentUsed >= 90 ? "border-amber-500/20 bg-amber-500/5" : 
                        "border-yellow-500/20 bg-yellow-500/5"
                      }>
                        <AlertTriangle className={
                          alert.percentUsed >= 100 ? "h-4 w-4 text-destructive" : 
                          alert.percentUsed >= 90 ? "h-4 w-4 text-amber-500" : 
                          "h-4 w-4 text-yellow-500"
                        } />
                        <AlertTitle className="flex items-center justify-between">
                          <span>{alert.categoryName}</span>
                          <span className={
                            alert.percentUsed >= 100 ? "text-destructive text-xs" : 
                            alert.percentUsed >= 90 ? "text-amber-500 text-xs" : 
                            "text-yellow-500 text-xs"
                          }>
                            {alert.percentUsed}% {t("used")}
                          </span>
                        </AlertTitle>
                        <AlertDescription className="flex justify-between items-center">
                          <span>
                            {alert.percentUsed >= 100 
                              ? t("budgetExceeded") 
                              : t("projectedToExceedBudget")}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {alert.projected.toFixed(2)}€ / {alert.budget.toFixed(2)}€
                          </span>
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                );
              })()}
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 pt-3 border-t text-xs text-muted-foreground text-right">
          {t("lastUpdated")}: {formattedLastUpdated}
        </div>
      </CardContent>
    </Card>
  )
}