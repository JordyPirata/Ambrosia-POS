"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiClient } from "@/services/apiClient";

const DEFAULT_CURRENCY = {
  id: null,
  acronym: "USD",
  locale: "en-US",
};

function deriveLocale(countryCode) {
  if (!countryCode) return null;
  return `${countryCode.toLowerCase()}-${countryCode.toUpperCase()}`;
}

export function useCurrency() {
  const [currency, setCurrency] = useState(DEFAULT_CURRENCY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCurrency = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const base = await apiClient("/base-currency");

      if (base?.acronym) {
        setCurrency({
          id: base?.currency_id || base?.id || null,
          acronym: base.acronym,
          locale:
            deriveLocale(base.country_code) ||
            base.locale ||
            (typeof navigator !== "undefined" ? navigator.language : DEFAULT_CURRENCY.locale),
        });
        return;
      }

      const currencyId = base?.currency_id;
      if (!currencyId) {
        setCurrency(DEFAULT_CURRENCY);
        return;
      }

      const list = await apiClient("/currencies");
      const found = Array.isArray(list) ? list.find((c) => c.id === currencyId) : null;

      setCurrency({
        id: found?.id || currencyId || null,
        acronym: found?.acronym || DEFAULT_CURRENCY.acronym,
        locale:
          deriveLocale(found?.country_code) ||
          found?.locale ||
          (typeof navigator !== "undefined" ? navigator.language : DEFAULT_CURRENCY.locale),
      });
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrency();
  }, [fetchCurrency]);

  const formatAmount = useCallback(
    (cents) => {
      const numeric = Number(cents);
      if (!Number.isFinite(numeric)) return cents;
      const value = numeric / 100;
      try {
        return new Intl.NumberFormat(currency.locale, {
          style: "currency",
          currency: currency.acronym || DEFAULT_CURRENCY.acronym,
        }).format(value);
      } catch {
        return value.toFixed(2);
      }
    },
    [currency],
  );

  const formatNumber = useCallback(
    (value) => {
      const numeric = Number(value);
      if (!Number.isFinite(numeric)) return value;
      try {
        return new Intl.NumberFormat(currency.locale).format(numeric);
      } catch {
        return numeric.toString();
      }
    },
    [currency],
  );

  return useMemo(
    () => ({
      currency,
      loading,
      error,
      formatAmount,
      formatNumber,
      refetch: fetchCurrency,
    }),
    [currency, loading, error, formatAmount, formatNumber, fetchCurrency],
  );
}
