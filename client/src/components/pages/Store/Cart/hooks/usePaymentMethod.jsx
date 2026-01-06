"use client";
import { useState, useEffect, useCallback } from "react";

import { apiClient } from "@/services/apiClient";

export function usePaymentMethods() {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPaymentMethods = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await apiClient("/payments/methods");

      if (Array.isArray(res)) {
        const sorted = [...res].sort((a, b) => {
          const nameA = a?.name || "";
          const nameB = b?.name || "";
          return nameA.localeCompare(nameB, undefined, { sensitivity: "base" });
        });
        setPaymentMethods(sorted);
      } else {
        setPaymentMethods([]);
      }
    } catch (err) {
      console.error("Error fetching payment methods:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPaymentMethods();
  }, [fetchPaymentMethods]);

  return {
    paymentMethods,
    loading,
    error,
    refetch: fetchPaymentMethods,
  };
}
