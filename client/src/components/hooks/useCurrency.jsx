"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiClient } from "@/services/apiClient";

const DEFAULT_CURRENCY = {
  id: null,
  acronym: "USD",
  symbol: "$",
  locale: "en-US",
  name: null,
  country_code: null,
  country_name: null,
};

function deriveLocale(countryCode) {
  if (!countryCode) return null;
  return `${countryCode.toLowerCase()}-${countryCode.toUpperCase()}`;
}

export function useCurrency() {
  const [currency, setCurrency] = useState(DEFAULT_CURRENCY);

  const fetchCurrency = useCallback(async () => {
    try {
      const base = await apiClient("/base-currency");

      const currencyId = base?.currency_id || base?.id;
      const baseAcronym = base?.acronym;

      setCurrency({
        id: currencyId || null,
        acronym: baseAcronym || DEFAULT_CURRENCY.acronym,
        symbol: base?.symbol || DEFAULT_CURRENCY.symbol,
        name: base?.name || DEFAULT_CURRENCY.name,
        country_code: base?.country_code || null,
        country_name: base?.country_name || null,
        locale:
          deriveLocale(base?.country_code) ||
          base?.locale ||
          (typeof navigator !== "undefined" ? navigator.language : DEFAULT_CURRENCY.locale),
      });
    } catch (_err) {
      setCurrency(DEFAULT_CURRENCY);
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
        if (currency.symbol) {
          const formattedNumber = new Intl.NumberFormat(currency.locale, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(value);
          return `${currency.symbol} ${formattedNumber}`;
        }

        return new Intl.NumberFormat(currency.locale, {
          style: "currency",
          currency: currency.acronym || DEFAULT_CURRENCY.acronym,
        }).format(value);
      } catch {
        const prefix = currency.symbol || currency.acronym || DEFAULT_CURRENCY.acronym;
        return `${prefix} ${value.toFixed(2)}`;
      }
    },
    [currency],
  );

  const updateCurrency = async (acronymOrObj) => {
    const acronym =
      typeof acronymOrObj === "string"
        ? acronymOrObj
        : acronymOrObj?.acronym || DEFAULT_CURRENCY.acronym;

    const updateConfigResponse = await apiClient(`/base-currency`, {
      method: "PUT",
      body: { acronym },
    });

    fetchCurrency();
    return updateConfigResponse
  }

  return useMemo(
    () => ({
      currency,
      updateCurrency,
      formatAmount,
      refetch: fetchCurrency,
    }),
    [currency, formatAmount, fetchCurrency, updateCurrency],
  );
}
