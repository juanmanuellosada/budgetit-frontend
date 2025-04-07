import { useState, useEffect, useCallback } from "react";

interface ExchangeRates {
  [currency: string]: number;
}

interface UseExchangeRatesResult {
  rates: ExchangeRates;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  lastUpdated: Date | null;
}

export function useExchangeRates(): UseExchangeRatesResult {
  const [rates, setRates] = useState<ExchangeRates>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchRates = useCallback(async (ignoreCache = false): Promise<void> => {
    // Check if we have cached rates
    const cachedRatesJson = localStorage.getItem("exchangeRates");
    const cachedTimestampStr = localStorage.getItem("exchangeRatesTimestamp");

    if (!ignoreCache && cachedRatesJson && cachedTimestampStr) {
      try {
        const cachedRates = JSON.parse(cachedRatesJson);
        const cachedTimestamp = new Date(cachedTimestampStr);
        const now = new Date();

        // Use cached rates if they're less than 6 hours old
        const sixHoursInMs = 6 * 60 * 60 * 1000;
        if (now.getTime() - cachedTimestamp.getTime() < sixHoursInMs) {
          setRates(cachedRates);
          setLastUpdated(cachedTimestamp);
          setLoading(false);
          return;
        }
      } catch (err) {
        // If there's an error with the cached data, continue to fetch fresh data
        console.error("Error parsing cached exchange rates:", err);
      }
    }

    try {
      setLoading(true);
      const response = await fetch(
        "https://api.exchangerate-api.com/v4/latest/USD",
        {
          cache: "no-cache",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.rates) {
        throw new Error("Invalid data format from exchange rate API");
      }

      setRates(data.rates);

      const timestamp = new Date();
      setLastUpdated(timestamp);

      // Cache the results
      localStorage.setItem("exchangeRates", JSON.stringify(data.rates));
      localStorage.setItem("exchangeRatesTimestamp", timestamp.toISOString());
    } catch (err) {
      console.error("Failed to fetch exchange rates:", err);

      // If fetching fails, try to use cached data regardless of age
      const cachedRatesJson = localStorage.getItem("exchangeRates");
      if (cachedRatesJson) {
        try {
          const cachedRates = JSON.parse(cachedRatesJson);
          const cachedTimestamp = new Date(
            localStorage.getItem("exchangeRatesTimestamp") || ""
          );

          setRates(cachedRates);
          setLastUpdated(cachedTimestamp);
          setError(
            new Error(
              `Using cached data due to fetch error: ${
                err instanceof Error ? err.message : String(err)
              }`
            )
          );
        } catch (cacheErr) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } else {
        setError(err instanceof Error ? err : new Error(String(err)));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRates();

    // Update rates every 6 hours
    const interval = setInterval(() => fetchRates(), 6 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [fetchRates]);

  return {
    rates,
    loading,
    error,
    refetch: () => fetchRates(true),
    lastUpdated,
  };
}
