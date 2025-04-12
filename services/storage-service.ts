/**
 * Servicio para manejar el almacenamiento persistente de datos
 * Usa localStorage para guardar los datos durante la sesión del usuario
 */

// Claves para almacenar los diferentes tipos de datos
export const STORAGE_KEYS = {
  TRANSACTIONS: "budgetit_transactions",
  ACCOUNTS: "budgetit_accounts",
  CARDS: "budgetit_cards",
  BUDGETS: "budgetit_budgets",
  FINANCIAL_GOALS: "budgetit_goals",
  RECURRING_TRANSACTIONS: "budgetit_recurring",
  CATEGORIES: "budgetit_categories",
  DASHBOARD_LAYOUT: "budgetit_dashboard_layout",
  CURRENCIES: "budgetit_currencies",
  SETTINGS: "budgetit_settings",
  TAGS: "budgetit_tags",
  EXCHANGE_RATES: "budgetit_exchange_rates",
  USER_PREFERENCES: "budgetit_user_preferences",
  PREDICTION_DATA: "budgetit_prediction_data",
};

// Versión actual del schema para migración de datos
export const STORAGE_VERSION = "1.0.0";

/**
 * Clase para manejar el almacenamiento en el cliente
 */
class StorageService {
  /**
   * Guarda un objeto en localStorage
   * @param key Clave para guardar el objeto
   * @param data Datos a guardar
   */
  saveData<T>(key: string, data: T): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error guardando datos en ${key}:`, error);
    }
  }

  /**
   * Obtiene datos de localStorage
   * @param key Clave para recuperar los datos
   * @param defaultValue Valor por defecto si no hay datos
   * @returns Los datos guardados o el valor por defecto
   */
  getData<T>(key: string, defaultValue: T): T {
    if (typeof window === "undefined") return defaultValue;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error obteniendo datos de ${key}:`, error);
      return defaultValue;
    }
  }

  /**
   * Elimina datos de localStorage
   * @param key Clave de los datos a eliminar
   */
  removeData(key: string): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error eliminando datos de ${key}:`, error);
    }
  }

  /**
   * Actualiza parcialmente los datos existentes en localStorage
   * @param key Clave para actualizar los datos
   * @param updateFn Función que recibe los datos actuales y devuelve los actualizados
   */
  updateData<T>(
    key: string,
    updateFn: (currentData: T) => T,
    defaultValue: T
  ): void {
    if (typeof window === "undefined") return;
    try {
      const currentData = this.getData<T>(key, defaultValue);
      const updatedData = updateFn(currentData);
      this.saveData(key, updatedData);
    } catch (error) {
      console.error(`Error actualizando datos en ${key}:`, error);
    }
  }

  /**
   * Comprueba si hay datos almacenados para una clave
   * @param key Clave a verificar
   * @returns true si hay datos almacenados
   */
  hasData(key: string): boolean {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(key) !== null;
  }

  /**
   * Exporta todos los datos del usuario a un archivo JSON
   * @returns Un objeto que contiene todos los datos guardados
   */
  exportAllData(): string {
    if (typeof window === "undefined") return "{}";

    try {
      const exportData = {
        version: STORAGE_VERSION,
        timestamp: new Date().toISOString(),
        data: {} as Record<string, any>,
      };

      // Recopilar todos los datos almacenados
      Object.values(STORAGE_KEYS).forEach((key) => {
        const data = localStorage.getItem(key);
        if (data) {
          exportData.data[key] = JSON.parse(data);
        }
      });

      return JSON.stringify(exportData);
    } catch (error) {
      console.error("Error exportando datos:", error);
      return "{}";
    }
  }

  /**
   * Importa datos desde un archivo JSON
   * @param jsonData El string JSON con los datos a importar
   * @param overwrite Si es true, sobrescribe los datos existentes; si es false, solo añade datos nuevos
   * @returns Resultado de la operación
   */
  importData(
    jsonData: string,
    overwrite: boolean = false
  ): { success: boolean; message: string } {
    if (typeof window === "undefined")
      return {
        success: false,
        message: "Importación no disponible en el servidor",
      };

    try {
      const importedData = JSON.parse(jsonData);

      // Verificar versión y formato
      if (!importedData.version || !importedData.data) {
        return { success: false, message: "Formato de datos inválido" };
      }

      // Realizar migración de datos si necesario
      const migratedData = this.migrateDataIfNeeded(importedData);

      // Importar cada conjunto de datos
      Object.entries(migratedData.data).forEach(([key, value]) => {
        if (overwrite) {
          this.saveData(key, value);
        } else {
          // Modo fusión: combinar con datos existentes
          const existingData = this.getData(key, {});
          const mergedData = { ...existingData, ...value };
          this.saveData(key, mergedData);
        }
      });

      return {
        success: true,
        message: `Datos importados correctamente (${
          Object.keys(migratedData.data).length
        } conjuntos de datos)`,
      };
    } catch (error) {
      console.error("Error importando datos:", error);
      return {
        success: false,
        message: "Error al procesar el archivo de importación",
      };
    }
  }

  /**
   * Migra datos de versiones anteriores a la versión actual
   * @param importedData Los datos a migrar
   * @returns Datos migrados
   */
  private migrateDataIfNeeded(importedData: any): any {
    // Comparación semántica de versiones simplificada
    if (importedData.version === STORAGE_VERSION) {
      return importedData;
    }

    // Aquí implementaríamos la lógica de migración para cada versión
    console.log(
      `Migrando datos de versión ${importedData.version} a ${STORAGE_VERSION}`
    );

    // Ejemplo básico de migración
    // (En un caso real, tendríamos migraciones específicas para cada cambio de esquema)
    const migratedData = { ...importedData };
    migratedData.version = STORAGE_VERSION;

    return migratedData;
  }

  /**
   * Crea una copia de seguridad automática de los datos en localStorage
   */
  createBackup(): void {
    if (typeof window === "undefined") return;

    try {
      const backupData = this.exportAllData();
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      this.saveData(`budgetit_backup_${timestamp}`, backupData);

      // Mantener solo las 5 copias de seguridad más recientes
      this.cleanupOldBackups();
    } catch (error) {
      console.error("Error creando copia de seguridad:", error);
    }
  }

  /**
   * Limpia copias de seguridad antiguas
   */
  private cleanupOldBackups(): void {
    if (typeof window === "undefined") return;

    try {
      const backupKeys: string[] = [];

      // Encontrar todas las claves de copia de seguridad
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("budgetit_backup_")) {
          backupKeys.push(key);
        }
      }

      // Ordenar por fecha (más reciente primero)
      backupKeys.sort().reverse();

      // Eliminar las copias de seguridad más antiguas si hay más de 5
      if (backupKeys.length > 5) {
        backupKeys.slice(5).forEach((key) => {
          this.removeData(key);
        });
      }
    } catch (error) {
      console.error("Error limpiando copias de seguridad antiguas:", error);
    }
  }

  /**
   * Convierte los datos a formato CSV para exportación
   * @param key La clave de los datos a exportar
   * @returns Datos en formato CSV
   */
  exportToCsv(key: string): string {
    if (typeof window === "undefined") return "";

    try {
      const data = this.getData(key, []);
      if (!Array.isArray(data) || data.length === 0) {
        return "";
      }

      // Obtener encabezados del primer objeto
      const headers = Object.keys(data[0]);

      // Crear CSV
      const csvRows = [
        // Encabezados
        headers.join(","),
        // Filas de datos
        ...data.map((row) => {
          return headers
            .map((header) => {
              const cell = row[header] ?? "";
              // Escapar comas y comillas
              if (
                typeof cell === "string" &&
                (cell.includes(",") || cell.includes('"'))
              ) {
                return `"${cell.replace(/"/g, '""')}"`;
              }
              return cell;
            })
            .join(",");
        }),
      ];

      return csvRows.join("\n");
    } catch (error) {
      console.error(`Error exportando ${key} a CSV:`, error);
      return "";
    }
  }

  /**
   * Verificar el espacio disponible en localStorage
   * @returns Objeto con información sobre el espacio utilizado
   */
  getStorageUsage(): { used: number; limit: number; percentUsed: number } {
    const estimate = { used: 0, limit: 5 * 1024 * 1024, percentUsed: 0 }; // 5MB límite estimado

    if (typeof window === "undefined") return estimate;

    try {
      // Calcular espacio utilizado
      let totalSize = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          totalSize += (localStorage.getItem(key)?.length || 0) * 2; // Aproximación: 2 bytes por caracter
        }
      }

      estimate.used = totalSize;
      estimate.percentUsed = (totalSize / estimate.limit) * 100;

      return estimate;
    } catch (error) {
      console.error("Error calculando uso de almacenamiento:", error);
      return estimate;
    }
  }
}

export const storageService = new StorageService();
