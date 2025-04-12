import {
  Transaction,
  Category,
  Account,
  Card,
  Budget,
  RecurringTransaction,
  FinancialGoal,
  Tag,
  Currency,
  SettingsData,
} from "./index";

// Función para generar identificadores únicos
const generateId = (): string => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

// Datos de ejemplo para categorías
export const sampleCategories: Category[] = [
  { id: "cat-1", name: "Comida", icon: "Utensils", color: "#FF5733" },
  { id: "cat-2", name: "Transporte", icon: "Car", color: "#33A8FF" },
  { id: "cat-3", name: "Vivienda", icon: "Home", color: "#33FF57" },
  { id: "cat-4", name: "Entretenimiento", icon: "Film", color: "#FF33A8" },
  { id: "cat-5", name: "Salud", icon: "Heart", color: "#33FFC7" },
  { id: "cat-6", name: "Educación", icon: "GraduationCap", color: "#C733FF" },
  { id: "cat-7", name: "Salario", icon: "Briefcase", color: "#FFD700" },
  { id: "cat-8", name: "Inversiones", icon: "TrendingUp", color: "#00FF00" },
  { id: "cat-9", name: "Regalos", icon: "Gift", color: "#FF00FF" },
  { id: "cat-10", name: "Compras", icon: "ShoppingBag", color: "#964B00" },
  { id: "cat-11", name: "Servicios", icon: "Lightbulb", color: "#FFA500" },
  { id: "cat-12", name: "Otros ingresos", icon: "Plus", color: "#008000" },
];

// Datos de ejemplo para cuentas
export const sampleAccounts: Account[] = [
  {
    id: "acc-1",
    name: "Cuenta Corriente",
    type: "checking",
    icon: "Landmark",
    initialBalance: 2500,
    currentBalance: 2500,
    currency: "EUR",
  },
  {
    id: "acc-2",
    name: "Cuenta de Ahorros",
    type: "savings",
    icon: "PiggyBank",
    initialBalance: 5000,
    currentBalance: 5000,
    currency: "EUR",
  },
  {
    id: "acc-3",
    name: "Efectivo",
    type: "cash",
    icon: "Wallet",
    initialBalance: 300,
    currentBalance: 300,
    currency: "EUR",
  },
  {
    id: "acc-4",
    name: "Inversiones",
    type: "investment",
    icon: "TrendingUp",
    initialBalance: 10000,
    currentBalance: 10000,
    currency: "USD",
  },
];

// Datos de ejemplo para tarjetas
export const sampleCards: Card[] = [
  {
    id: "card-1",
    name: "Visa Oro",
    type: "credit",
    number: "4321",
    expiryDate: "12/27",
    limit: 5000,
    issuer: "Banco Santander",
    accountId: "acc-1",
    color: "#DAA520",
  },
  {
    id: "card-2",
    name: "Mastercard",
    type: "debit",
    number: "8765",
    expiryDate: "09/26",
    issuer: "Banco Santander",
    accountId: "acc-1",
    color: "#FF0000",
  },
];

// Datos de ejemplo para transacciones
export const generateSampleTransactions = (): Transaction[] => {
  const transactions: Transaction[] = [];
  const today = new Date();

  // Generar transacciones para los últimos 60 días
  for (let i = 0; i < 60; i++) {
    const date = new Date();
    date.setDate(today.getDate() - i);

    // Ingresos mensuales (salario) cada 30 días
    if (i % 30 === 0) {
      transactions.push({
        id: generateId(),
        type: "income",
        amount: 2100,
        date: date.toISOString(),
        categoryId: "cat-7", // Salario
        accountId: "acc-1",
        description: "Salario mensual",
        isRecurring: true,
        recurringId: "rec-1",
      });
    }

    // Gastos aleatorios diarios
    if (Math.random() > 0.3) {
      // 70% de probabilidad de gasto diario
      const amount = Math.floor(Math.random() * 50) + 5; // Entre 5 y 55 euros
      const categoryId = `cat-${Math.floor(Math.random() * 6) + 1}`; // Categorías de gasto (1-6)

      transactions.push({
        id: generateId(),
        type: "expense",
        amount: amount,
        date: date.toISOString(),
        categoryId: categoryId,
        accountId: "acc-1",
        description: getCategoryDescription(categoryId),
      });
    }

    // Gastos grandes ocasionales
    if (i % 15 === 3) {
      // Cada 15 días
      transactions.push({
        id: generateId(),
        type: "expense",
        amount: 120,
        date: date.toISOString(),
        categoryId: "cat-3", // Vivienda
        accountId: "acc-1",
        description: "Factura electricidad",
        tags: ["hogar", "facturas"],
      });
    }

    // Transferencias a ahorros
    if (i % 30 === 5) {
      // 5 días después del salario
      transactions.push({
        id: generateId(),
        type: "expense",
        amount: 300,
        date: date.toISOString(),
        categoryId: "cat-8", // Inversiones
        accountId: "acc-1",
        description: "Transferencia a ahorros",
      });

      transactions.push({
        id: generateId(),
        type: "income",
        amount: 300,
        date: date.toISOString(),
        categoryId: "cat-8", // Inversiones
        accountId: "acc-2",
        description: "Transferencia desde cuenta corriente",
      });
    }
  }

  // Actualizar saldos de cuentas basados en transacciones
  updateAccountBalances(transactions);

  return transactions;
};

// Función para actualizar saldos de cuentas basadas en transacciones
const updateAccountBalances = (transactions: Transaction[]) => {
  const accountBalances: { [accountId: string]: number } = {};

  // Inicializar balances con los saldos iniciales
  sampleAccounts.forEach((account) => {
    accountBalances[account.id] = account.initialBalance;
  });

  // Ordenar transacciones por fecha (más antigua primero)
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Aplicar transacciones para actualizar saldos
  sortedTransactions.forEach((transaction) => {
    if (!accountBalances[transaction.accountId]) {
      accountBalances[transaction.accountId] = 0;
    }

    if (transaction.type === "income") {
      accountBalances[transaction.accountId] += transaction.amount;
    } else {
      accountBalances[transaction.accountId] -= transaction.amount;
    }
  });

  // Actualizar saldos actuales en las cuentas
  sampleAccounts.forEach((account) => {
    if (accountBalances[account.id] !== undefined) {
      account.currentBalance = accountBalances[account.id];
    }
  });
};

// Descripción basada en la categoría
const getCategoryDescription = (categoryId: string): string => {
  switch (categoryId) {
    case "cat-1":
      return ["Supermercado", "Restaurante", "Cafetería", "Comida a domicilio"][
        Math.floor(Math.random() * 4)
      ];
    case "cat-2":
      return ["Gasolina", "Transporte público", "Taxi", "Peaje"][
        Math.floor(Math.random() * 4)
      ];
    case "cat-3":
      return ["Alquiler", "Hipoteca", "Agua", "Gas", "Internet"][
        Math.floor(Math.random() * 5)
      ];
    case "cat-4":
      return ["Cine", "Concierto", "Suscripción streaming", "Videojuego"][
        Math.floor(Math.random() * 4)
      ];
    case "cat-5":
      return ["Farmacia", "Médico", "Seguro médico"][
        Math.floor(Math.random() * 3)
      ];
    case "cat-6":
      return ["Libros", "Curso online", "Material escolar"][
        Math.floor(Math.random() * 3)
      ];
    default:
      return "Compra";
  }
};

// Datos de ejemplo para presupuestos mensuales
export const sampleBudgets: Budget[] = [
  {
    id: "budget-1",
    categoryId: "cat-1",
    amount: 400,
    period: "monthly",
    currentSpent: 0,
    startDate: new Date().toISOString(),
  },
  {
    id: "budget-2",
    categoryId: "cat-2",
    amount: 150,
    period: "monthly",
    currentSpent: 0,
    startDate: new Date().toISOString(),
  },
  {
    id: "budget-3",
    categoryId: "cat-3",
    amount: 800,
    period: "monthly",
    currentSpent: 0,
    startDate: new Date().toISOString(),
  },
  {
    id: "budget-4",
    categoryId: "cat-4",
    amount: 100,
    period: "monthly",
    currentSpent: 0,
    startDate: new Date().toISOString(),
  },
  {
    id: "budget-5",
    categoryId: "cat-5",
    amount: 100,
    period: "monthly",
    currentSpent: 0,
    startDate: new Date().toISOString(),
  },
];

// Actualizar gastos actuales en presupuestos
export const updateBudgetSpending = (
  transactions: Transaction[],
  budgets: Budget[]
): Budget[] => {
  const updatedBudgets = [...budgets];
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  // Filtrar transacciones del mes actual
  const currentMonthTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    return transactionDate >= startOfMonth && transaction.type === "expense";
  });

  // Resetear gastos actuales
  updatedBudgets.forEach((budget) => {
    budget.currentSpent = 0;
  });

  // Actualizar gastos por categoría
  currentMonthTransactions.forEach((transaction) => {
    const budget = updatedBudgets.find(
      (b) => b.categoryId === transaction.categoryId
    );
    if (budget) {
      budget.currentSpent += transaction.amount;
    }
  });

  return updatedBudgets;
};

// Datos de ejemplo para transacciones recurrentes
export const sampleRecurringTransactions: RecurringTransaction[] = [
  {
    id: "rec-1",
    name: "Salario",
    type: "income",
    amount: 2100,
    categoryId: "cat-7",
    accountId: "acc-1",
    frequency: "monthly",
    startDate: new Date().toISOString(),
    nextDue: new Date(new Date().setDate(1)).toISOString(),
    description: "Salario mensual",
  },
  {
    id: "rec-2",
    name: "Alquiler",
    type: "expense",
    amount: 700,
    categoryId: "cat-3",
    accountId: "acc-1",
    frequency: "monthly",
    startDate: new Date().toISOString(),
    nextDue: new Date(new Date().setDate(5)).toISOString(),
    description: "Pago mensual del alquiler",
  },
  {
    id: "rec-3",
    name: "Suscripción Netflix",
    type: "expense",
    amount: 12.99,
    categoryId: "cat-4",
    accountId: "acc-1",
    frequency: "monthly",
    startDate: new Date().toISOString(),
    nextDue: new Date(new Date().setDate(15)).toISOString(),
    description: "Suscripción mensual",
    tags: ["entretenimiento", "suscripciones"],
  },
  {
    id: "rec-4",
    name: "Gimnasio",
    type: "expense",
    amount: 35,
    categoryId: "cat-5",
    accountId: "acc-1",
    frequency: "monthly",
    startDate: new Date().toISOString(),
    nextDue: new Date(new Date().setDate(10)).toISOString(),
    description: "Cuota mensual del gimnasio",
    tags: ["salud", "suscripciones"],
  },
];

// Datos de ejemplo para metas financieras
export const sampleFinancialGoals: FinancialGoal[] = [
  {
    id: "goal-1",
    name: "Fondo de emergencia",
    targetAmount: 6000,
    currentAmount: 2000,
    startDate: new Date(
      new Date().setMonth(new Date().getMonth() - 2)
    ).toISOString(),
    targetDate: new Date(
      new Date().setMonth(new Date().getMonth() + 10)
    ).toISOString(),
    icon: "Shield",
    color: "#4C9AFF",
  },
  {
    id: "goal-2",
    name: "Vacaciones",
    targetAmount: 1200,
    currentAmount: 450,
    startDate: new Date(
      new Date().setMonth(new Date().getMonth() - 1)
    ).toISOString(),
    targetDate: new Date(
      new Date().setMonth(new Date().getMonth() + 5)
    ).toISOString(),
    icon: "Palmtree",
    color: "#FF5630",
  },
  {
    id: "goal-3",
    name: "Nuevo ordenador",
    targetAmount: 1500,
    currentAmount: 700,
    startDate: new Date(
      new Date().setMonth(new Date().getMonth() - 3)
    ).toISOString(),
    targetDate: new Date(
      new Date().setMonth(new Date().getMonth() + 3)
    ).toISOString(),
    icon: "Laptop",
    color: "#6554C0",
  },
];

// Datos de ejemplo para etiquetas
export const sampleTags: Tag[] = [
  { id: "tag-1", name: "hogar", color: "#8B4513" },
  { id: "tag-2", name: "trabajo", color: "#1E90FF" },
  { id: "tag-3", name: "familia", color: "#FF69B4" },
  { id: "tag-4", name: "educación", color: "#32CD32" },
  { id: "tag-5", name: "entretenimiento", color: "#FFD700" },
  { id: "tag-6", name: "facturas", color: "#FF7F50" },
  { id: "tag-7", name: "suscripciones", color: "#9370DB" },
  { id: "tag-8", name: "salud", color: "#20B2AA" },
];

// Datos de ejemplo para monedas
export const sampleCurrencies: Currency[] = [
  {
    code: "EUR",
    name: "Euro",
    symbol: "€",
    exchangeRate: 1,
    isPrimary: true,
    isVisible: true,
  },
  {
    code: "USD",
    name: "Dólar estadounidense",
    symbol: "$",
    exchangeRate: 1.09,
    isPrimary: false,
    isVisible: true,
  },
  {
    code: "GBP",
    name: "Libra esterlina",
    symbol: "£",
    exchangeRate: 0.85,
    isPrimary: false,
    isVisible: true,
  },
  {
    code: "JPY",
    name: "Yen japonés",
    symbol: "¥",
    exchangeRate: 160.53,
    isPrimary: false,
    isVisible: false,
  },
  {
    code: "CNY",
    name: "Yuan chino",
    symbol: "¥",
    exchangeRate: 7.87,
    isPrimary: false,
    isVisible: false,
  },
  {
    code: "ARS",
    name: "Peso argentino",
    symbol: "$",
    exchangeRate: 920.45,
    isPrimary: false,
    isVisible: true,
  },
  {
    code: "MXN",
    name: "Peso mexicano",
    symbol: "$",
    exchangeRate: 18.23,
    isPrimary: false,
    isVisible: false,
  },
];

// Datos de ejemplo para configuraciones
export const sampleSettings: SettingsData = {
  theme: "system",
  language: "es",
  primaryCurrency: "EUR",
  notificationsEnabled: true,
};

// Función para cargar datos de muestra completos
export const loadSampleData = () => {
  const transactions = generateSampleTransactions();
  const budgets = updateBudgetSpending(transactions, sampleBudgets);

  return {
    categories: sampleCategories,
    accounts: sampleAccounts,
    cards: sampleCards,
    transactions: transactions,
    budgets: budgets,
    recurringTransactions: sampleRecurringTransactions,
    financialGoals: sampleFinancialGoals,
    tags: sampleTags,
    currencies: sampleCurrencies,
    settings: sampleSettings,
  };
};
