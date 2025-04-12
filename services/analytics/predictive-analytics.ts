/**
 * Servicio de análisis predictivo de gastos
 * Proporciona análisis avanzados de patrones de gasto, detección de anomalías,
 * y recomendaciones personalizadas para mejorar los hábitos financieros.
 */

import { Transaction, Category, Budget } from "@/models";
import { storageService, STORAGE_KEYS } from "@/services/storage-service";

interface SpendingPattern {
  categoryId: string;
  categoryName: string;
  averageMonthly: number;
  trend: "increasing" | "decreasing" | "stable";
  percentChange: number;
}

interface AnomalyDetection {
  transaction: Transaction;
  reason: string;
  severity: "low" | "medium" | "high";
  date: string;
  categoryName: string;
}

interface SavingSuggestion {
  categoryId: string;
  categoryName: string;
  currentMonthlyAvg: number;
  suggestedSaving: number;
  potentialAnnualSaving: number;
  difficulty: "easy" | "moderate" | "challenging";
}

interface PredictionData {
  patterns: SpendingPattern[];
  anomalies: AnomalyDetection[];
  suggestions: SavingSuggestion[];
  lastUpdated: string;
  nextUpdate: string;
}

export class PredictiveAnalyticsService {
  private categories: Category[] = [];

  constructor() {
    this.loadCategories();
  }

  /**
   * Carga las categorías desde el almacenamiento
   */
  private loadCategories(): void {
    this.categories = storageService.getData(STORAGE_KEYS.CATEGORIES, []);
  }

  /**
   * Obtiene el nombre de una categoría por su ID
   */
  private getCategoryName(categoryId: string): string {
    const category = this.categories.find((c) => c.id === categoryId);
    return category?.name || "Desconocida";
  }

  /**
   * Analiza los gastos de los últimos meses y genera predicciones
   * @returns Datos de predicción generados
   */
  public analyzePredictions(): PredictionData {
    this.loadCategories(); // Asegurarse de tener las categorías actualizadas

    const transactions = storageService.getData(STORAGE_KEYS.TRANSACTIONS, []);
    const patterns = this.detectSpendingPatterns(transactions);
    const anomalies = this.detectAnomalies(transactions);
    const suggestions = this.generateSavingSuggestions(patterns);

    const predictionData: PredictionData = {
      patterns,
      anomalies,
      suggestions,
      lastUpdated: new Date().toISOString(),
      nextUpdate: this.getNextUpdateDate().toISOString(),
    };

    // Guardar los datos de predicción para mostrarlos en la aplicación
    storageService.saveData(STORAGE_KEYS.PREDICTION_DATA, predictionData);

    return predictionData;
  }

  /**
   * Obtiene los datos de predicción más recientes o los genera si no existen
   */
  public getPredictionData(): PredictionData {
    const predictionData = storageService.getData(
      STORAGE_KEYS.PREDICTION_DATA,
      null
    );

    if (!predictionData || this.isPredictionDataStale(predictionData)) {
      return this.analyzePredictions();
    }

    return predictionData;
  }

  /**
   * Verifica si los datos de predicción están desactualizados
   */
  private isPredictionDataStale(predictionData: PredictionData): boolean {
    const lastUpdated = new Date(predictionData.lastUpdated);
    const now = new Date();

    // Actualizar si han pasado más de 3 días o si es un nuevo mes
    return (
      now.getTime() - lastUpdated.getTime() > 3 * 24 * 60 * 60 * 1000 ||
      now.getMonth() !== lastUpdated.getMonth()
    );
  }

  /**
   * Determina la próxima fecha de actualización de predicciones
   */
  private getNextUpdateDate(): Date {
    const now = new Date();
    const nextUpdate = new Date();

    // Programar próxima actualización en 3 días o al inicio del próximo mes
    if (now.getDate() >= 28) {
      // Primer día del próximo mes
      nextUpdate.setMonth(now.getMonth() + 1, 1);
    } else {
      // En 3 días
      nextUpdate.setDate(now.getDate() + 3);
    }

    return nextUpdate;
  }

  /**
   * Analiza los patrones de gasto por categoría en los últimos 3 meses
   */
  private detectSpendingPatterns(
    transactions: Transaction[]
  ): SpendingPattern[] {
    const patterns: SpendingPattern[] = [];
    const now = new Date();
    const categoryTotals: { [key: string]: number[] } = {};

    // Preparar estructura para seguir gastos por mes (últimos 3 meses)
    this.categories.forEach((category) => {
      categoryTotals[category.id] = [0, 0, 0]; // [mes actual, mes anterior, hace 2 meses]
    });

    // Clasificar transacciones por mes y categoría
    transactions.forEach((transaction) => {
      if (transaction.type !== "expense") return;

      const transDate = new Date(transaction.date);
      const monthsDiff =
        (now.getFullYear() - transDate.getFullYear()) * 12 +
        now.getMonth() -
        transDate.getMonth();

      if (monthsDiff >= 0 && monthsDiff < 3) {
        if (!categoryTotals[transaction.categoryId]) {
          categoryTotals[transaction.categoryId] = [0, 0, 0];
        }
        categoryTotals[transaction.categoryId][monthsDiff] +=
          transaction.amount;
      }
    });

    // Analizar los patrones para cada categoría
    Object.entries(categoryTotals).forEach(([categoryId, monthlyAmounts]) => {
      if (monthlyAmounts.some((amount) => amount > 0)) {
        const [currentMonth, lastMonth, twoMonthsAgo] = monthlyAmounts;
        const averageMonthly =
          monthlyAmounts.reduce((sum, val) => sum + val, 0) / 3;

        // Calcular tendencia y cambio porcentual
        let trend: "increasing" | "decreasing" | "stable" = "stable";
        let percentChange = 0;

        if (currentMonth > 0 && lastMonth > 0) {
          percentChange = ((currentMonth - lastMonth) / lastMonth) * 100;

          if (percentChange > 10) {
            trend = "increasing";
          } else if (percentChange < -10) {
            trend = "decreasing";
          }
        } else if (twoMonthsAgo > 0 && currentMonth > 0) {
          percentChange = ((currentMonth - twoMonthsAgo) / twoMonthsAgo) * 100;

          if (percentChange > 10) {
            trend = "increasing";
          } else if (percentChange < -10) {
            trend = "decreasing";
          }
        }

        patterns.push({
          categoryId,
          categoryName: this.getCategoryName(categoryId),
          averageMonthly,
          trend,
          percentChange: Math.round(percentChange * 10) / 10,
        });
      }
    });

    // Ordenar por promedio mensual (de mayor a menor)
    return patterns.sort((a, b) => b.averageMonthly - a.averageMonthly);
  }

  /**
   * Detecta gastos anómalos basados en el historial y patrones
   */
  private detectAnomalies(transactions: Transaction[]): AnomalyDetection[] {
    const anomalies: AnomalyDetection[] = [];
    const categoryAverages: { [key: string]: number } = {};
    const now = new Date();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(now.getMonth() - 3);

    // Filtrar transacciones de los últimos tres meses
    const recentTransactions = transactions.filter((t) => {
      const transDate = new Date(t.date);
      return transDate >= threeMonthsAgo && t.type === "expense";
    });

    // Calcular promedios por categoría
    recentTransactions.forEach((transaction) => {
      if (!categoryAverages[transaction.categoryId]) {
        categoryAverages[transaction.categoryId] = {
          total: 0,
          count: 0,
          max: 0,
        };
      }

      categoryAverages[transaction.categoryId].total += transaction.amount;
      categoryAverages[transaction.categoryId].count += 1;
      categoryAverages[transaction.categoryId].max = Math.max(
        categoryAverages[transaction.categoryId].max,
        transaction.amount
      );
    });

    Object.keys(categoryAverages).forEach((categoryId) => {
      if (categoryAverages[categoryId].count > 0) {
        categoryAverages[categoryId].avg =
          categoryAverages[categoryId].total /
          categoryAverages[categoryId].count;
      }
    });

    // Buscar anomalías en el último mes
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(now.getMonth() - 1);

    const lastMonthTransactions = recentTransactions.filter(
      (t) => new Date(t.date) >= oneMonthAgo
    );

    lastMonthTransactions.forEach((transaction) => {
      const categoryStats = categoryAverages[transaction.categoryId];

      if (categoryStats && categoryStats.avg > 0) {
        // Detectar si es significativamente mayor que el promedio
        if (
          transaction.amount > categoryStats.avg * 2 &&
          transaction.amount > 50
        ) {
          let severity: "low" | "medium" | "high" = "low";

          if (transaction.amount > categoryStats.avg * 5) {
            severity = "high";
          } else if (transaction.amount > categoryStats.avg * 3) {
            severity = "medium";
          }

          anomalies.push({
            transaction,
            reason: `Gasto ${
              Math.round((transaction.amount / categoryStats.avg) * 10) / 10
            }x mayor que el promedio en esta categoría`,
            severity,
            date: transaction.date,
            categoryName: this.getCategoryName(transaction.categoryId),
          });
        }
      }
    });

    // Ordenar por severidad y fecha (más recientes primero)
    return anomalies.sort((a, b) => {
      const severityOrder = { high: 3, medium: 2, low: 1 };
      const severityDiff =
        severityOrder[b.severity] - severityOrder[a.severity];

      if (severityDiff !== 0) return severityDiff;

      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }

  /**
   * Genera sugerencias de ahorro basadas en patrones de gasto
   */
  private generateSavingSuggestions(
    patterns: SpendingPattern[]
  ): SavingSuggestion[] {
    const suggestions: SavingSuggestion[] = [];
    const topPatterns = patterns.slice(0, 5); // Enfocarse en las 5 categorías con mayor gasto

    topPatterns.forEach((pattern) => {
      // Ignorar categorías con gastos muy pequeños
      if (pattern.averageMonthly < 50) return;

      // Calcular sugerencia de ahorro basada en la tendencia y promedio
      let suggestedSaving = 0;
      let difficulty: "easy" | "moderate" | "challenging" = "moderate";

      if (pattern.trend === "increasing") {
        // Sugerir reducir al menos a nivel del mes anterior
        suggestedSaving = Math.round(pattern.averageMonthly * 0.15); // 15% de reducción
        difficulty = "easy";
      } else if (pattern.trend === "stable" && pattern.averageMonthly > 100) {
        // Para gastos estables altos, sugerir una reducción moderada
        suggestedSaving = Math.round(pattern.averageMonthly * 0.1); // 10% de reducción

        if (pattern.averageMonthly > 300) {
          difficulty = "moderate";
        } else {
          difficulty = "easy";
        }
      } else if (pattern.averageMonthly > 200) {
        // Para gastos grandes pero en disminución, sugerir mantener la tendencia
        suggestedSaving = Math.round(pattern.averageMonthly * 0.05); // 5% de reducción
        difficulty = "challenging";
      }

      // Solo agregar sugerencias significativas
      if (suggestedSaving >= 10) {
        suggestions.push({
          categoryId: pattern.categoryId,
          categoryName: pattern.categoryName,
          currentMonthlyAvg: Math.round(pattern.averageMonthly),
          suggestedSaving,
          potentialAnnualSaving: suggestedSaving * 12,
          difficulty,
        });
      }
    });

    return suggestions;
  }

  /**
   * Proyecta gastos futuros basados en historial y tendencias
   * @param months Número de meses a proyectar
   * @returns Proyección de gastos por categoría
   */
  public projectFutureSpending(months: number = 3): {
    [categoryId: string]: number[];
  } {
    const patterns = this.detectSpendingPatterns(
      storageService.getData(STORAGE_KEYS.TRANSACTIONS, [])
    );

    const projections: { [categoryId: string]: number[] } = {};

    patterns.forEach((pattern) => {
      projections[pattern.categoryId] = [];

      let monthlyAmount = pattern.averageMonthly;
      let monthlyChange = 1 + pattern.percentChange / 100;

      // Si el cambio es muy extremo, moderarlo para proyecciones a largo plazo
      if (monthlyChange > 1.2) monthlyChange = 1.2;
      if (monthlyChange < 0.8) monthlyChange = 0.8;

      for (let i = 0; i < months; i++) {
        projections[pattern.categoryId].push(Math.round(monthlyAmount));
        monthlyAmount *= monthlyChange;
      }
    });

    return projections;
  }

  /**
   * Genera una alerta si se detecta un riesgo de exceder el presupuesto
   * @returns Alertas de presupuesto
   */
  public generateBudgetAlerts(): {
    categoryId: string;
    categoryName: string;
    budget: number;
    projected: number;
    percentUsed: number;
  }[] {
    const budgets = storageService.getData(STORAGE_KEYS.BUDGETS, []);
    const transactions = storageService.getData(STORAGE_KEYS.TRANSACTIONS, []);
    const today = new Date();
    const alerts = [];

    // Para cada presupuesto, verificar si hay riesgo de excederlo
    budgets.forEach((budget: Budget) => {
      const categoryTransactions = transactions.filter(
        (t: Transaction) =>
          t.categoryId === budget.categoryId &&
          t.type === "expense" &&
          this.isTransactionInCurrentPeriod(t.date, budget.period)
      );

      const currentSpent = categoryTransactions.reduce(
        (sum: number, t: Transaction) => sum + t.amount,
        0
      );
      const daysInPeriod = this.getDaysInPeriod(budget.period);
      const daysPassed = this.getDaysPassedInPeriod(today, budget.period);
      const percentOfPeriodPassed = daysPassed / daysInPeriod;

      // Proyectar gasto total al final del período basado en la tasa actual
      const projectedSpend =
        percentOfPeriodPassed > 0
          ? Math.round(currentSpent / percentOfPeriodPassed)
          : currentSpent;

      const percentUsed = (currentSpent / budget.amount) * 100;
      const percentProjected = (projectedSpend / budget.amount) * 100;

      // Generar alertas si:
      // 1. Ya se ha gastado más del presupuesto
      // 2. Se ha gastado más del 80% y ha pasado menos del 75% del período
      // 3. La proyección excede el presupuesto
      if (
        percentUsed >= 100 ||
        (percentUsed >= 80 && percentOfPeriodPassed < 0.75) ||
        (percentProjected > 105 && percentOfPeriodPassed >= 0.3)
      ) {
        alerts.push({
          categoryId: budget.categoryId,
          categoryName: this.getCategoryName(budget.categoryId),
          budget: budget.amount,
          projected: projectedSpend,
          percentUsed: Math.round(percentUsed * 10) / 10,
        });
      }
    });

    return alerts;
  }

  /**
   * Determina si una transacción pertenece al período actual (mes, semana, año)
   */
  private isTransactionInCurrentPeriod(
    dateStr: string,
    period: string
  ): boolean {
    const transDate = new Date(dateStr);
    const today = new Date();

    switch (period) {
      case "monthly":
        return (
          transDate.getMonth() === today.getMonth() &&
          transDate.getFullYear() === today.getFullYear()
        );
      case "weekly":
        // Calcular primera fecha de la semana actual (domingo)
        const firstDayOfWeek = new Date(today);
        const day = today.getDay();
        firstDayOfWeek.setDate(today.getDate() - day);
        firstDayOfWeek.setHours(0, 0, 0, 0);
        return transDate >= firstDayOfWeek;
      case "yearly":
        return transDate.getFullYear() === today.getFullYear();
      default:
        return false;
    }
  }

  /**
   * Obtiene el número de días en un período (mes, semana, año)
   */
  private getDaysInPeriod(period: string): number {
    const today = new Date();

    switch (period) {
      case "monthly":
        return new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
      case "weekly":
        return 7;
      case "yearly":
        return (
          (new Date(today.getFullYear(), 11, 31).getTime() -
            new Date(today.getFullYear(), 0, 1).getTime()) /
            (1000 * 60 * 60 * 24) +
          1
        );
      default:
        return 30;
    }
  }

  /**
   * Calcula cuántos días han pasado en el período actual
   */
  private getDaysPassedInPeriod(date: Date, period: string): number {
    switch (period) {
      case "monthly":
        return date.getDate();
      case "weekly":
        return date.getDay() + 1;
      case "yearly":
        return (
          Math.floor(
            (date.getTime() - new Date(date.getFullYear(), 0, 1).getTime()) /
              (1000 * 60 * 60 * 24)
          ) + 1
        );
      default:
        return 1;
    }
  }
}

// Instancia del servicio para uso en la aplicación
export const predictiveAnalyticsService = new PredictiveAnalyticsService();
