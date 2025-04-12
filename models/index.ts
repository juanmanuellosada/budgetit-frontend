/**
 * Modelos de datos para la aplicación
 */

export interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  date: string;
  categoryId: string;
  accountId: string;
  description?: string;
  tags?: string[];
  isRecurring?: boolean;
  recurringId?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color?: string;
  parentId?: string; // Para categorías jerárquicas
  budget?: number; // Presupuesto asignado a esta categoría
}

export interface Account {
  id: string;
  name: string;
  type: "checking" | "savings" | "cash" | "investment" | "other";
  icon: string;
  initialBalance: number;
  currentBalance: number;
  currency: string;
  color?: string;
  isArchived?: boolean;
}

export interface Card {
  id: string;
  name: string;
  type: "credit" | "debit";
  number: string; // Últimos 4 dígitos
  expiryDate: string;
  limit?: number;
  color?: string;
  issuer: string;
  accountId: string; // Cuenta asociada a la tarjeta
}

export interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  period: "monthly" | "weekly" | "yearly";
  currentSpent: number;
  startDate: string;
  endDate?: string;
}

export interface RecurringTransaction {
  id: string;
  name: string;
  type: "income" | "expense";
  amount: number;
  categoryId: string;
  accountId: string;
  frequency: "daily" | "weekly" | "monthly" | "yearly";
  startDate: string;
  endDate?: string;
  lastProcessed?: string;
  nextDue: string;
  description?: string;
  tags?: string[];
}

export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  startDate: string;
  targetDate: string;
  category?: string;
  icon?: string;
  color?: string;
}

export interface Tag {
  id: string;
  name: string;
  color?: string;
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  exchangeRate: number; // Tasa respecto a la moneda principal
  isPrimary: boolean;
  isVisible: boolean;
}

export interface SettingsData {
  theme: "light" | "dark" | "system";
  language: "es" | "en";
  primaryCurrency: string;
  dashboardLayout?: any;
  notificationsEnabled?: boolean;
}
