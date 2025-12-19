"use client";
import { useCallback, useMemo, useReducer, useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/modules/auth/useAuth";
import { useCurrency } from "@/components/hooks/useCurrency";
import { usePaymentMethods } from "../hooks/usePaymentMethod";
import { useOrders } from "../../hooks/useOrders";
import { usePayments } from "../../hooks/usePayments";
import { useTickets } from "../../hooks/useTickets";
import {
  initialPaymentState,
  paymentStateReducer,
  createErrorNotifier,
} from "./paymentState";
import {
  ensureCartReady,
  buildOrderPayload,
  buildTicketPayload,
  buildPaymentPayload,
  normalizeAmounts,
} from "./paymentBuilders";
import { createOrderAndTicket, processBasePayment } from "./paymentFlows";
import {
  buildHandlePay,
  buildHandleBtcInvoiceReady,
  buildHandleBtcComplete,
  buildHandleCashComplete,
} from "./paymentHandlers";

export function useCartPayment({ onPay, onResetCart } = {}) {
  const t = useTranslations("cart.payment");
  const { user } = useAuth();
  const { currency, formatAmount } = useCurrency();
  const { paymentMethods } = usePaymentMethods();
  const { createOrder, updateOrder } = useOrders();
  const { createPayment, linkPaymentToTicket, getPaymentCurrencyById } = usePayments();
  const { createTicket } = useTickets();

  const [{ isPaying, error: paymentError }, dispatch] = useReducer(
    paymentStateReducer,
    initialPaymentState,
  );
  const [btcPaymentConfig, setBtcPaymentConfig] = useState(null);
  const [cashPaymentConfig, setCashPaymentConfig] = useState(null);

  const clearPaymentError = useCallback(() => dispatch({ type: "clearError" }), []);

  const notifyError = useMemo(() => createErrorNotifier(dispatch), [dispatch]);

  const paymentMethodMap = useMemo(
    () =>
      (paymentMethods || []).reduce((acc, method) => {
        acc[method.id] = method;
        return acc;
      }, {}),
    [paymentMethods],
  );

  const handlePay = useMemo(
    () =>
      buildHandlePay({
        t,
        currency,
        formatAmount,
        paymentMethodMap,
        getPaymentCurrencyById,
        setBtcPaymentConfig,
        setCashPaymentConfig,
        processBasePayment,
        updateOrder,
        onResetCart,
        onPay,
        notifyError,
        dispatch,
        user,
        ensureCartReady,
        normalizeAmounts,
        buildOrderPayload,
        buildTicketPayload,
        buildPaymentPayload,
        createOrder,
        createTicket,
        createPayment,
        linkPaymentToTicket,
      }),
    [
      currency,
      formatAmount,
      getPaymentCurrencyById,
      notifyError,
      onPay,
      onResetCart,
      paymentMethodMap,
      processBasePayment,
      t,
      updateOrder,
      user,
      createOrder,
      createTicket,
      createPayment,
      linkPaymentToTicket,
    ],
  );

  const handleBtcInvoiceReady = useMemo(
    () => buildHandleBtcInvoiceReady({ setBtcPaymentConfig }),
    [],
  );

  const handleBtcComplete = useMemo(
    () =>
      buildHandleBtcComplete({
        btcPaymentConfig,
        dispatch,
        createOrderAndTicket,
        buildOrderPayload,
        buildTicketPayload,
        createOrder,
        createTicket,
        buildPaymentPayload,
        createPayment,
        linkPaymentToTicket,
        onPay,
        onResetCart,
        notifyError,
        t,
        user,
        setBtcPaymentConfig,
      }),
    [
      btcPaymentConfig,
      dispatch,
      createOrder,
      createTicket,
      createPayment,
      linkPaymentToTicket,
      onPay,
      onResetCart,
      notifyError,
      t,
      user,
    ],
  );

  const clearBtcPaymentConfig = useCallback(() => {
    setBtcPaymentConfig(null);
  }, []);

  const handleCashComplete = useMemo(
    () =>
      buildHandleCashComplete({
        cashPaymentConfig,
        dispatch,
        updateOrder,
        onPay,
        onResetCart,
        notifyError,
        t,
        setCashPaymentConfig,
      }),
    [cashPaymentConfig, dispatch, notifyError, onPay, onResetCart, t, updateOrder],
  );

  const clearCashPaymentConfig = useCallback(() => {
    setCashPaymentConfig(null);
  }, []);

  return {
    handlePay,
    isPaying,
    paymentError,
    clearPaymentError,
    btcPaymentConfig,
    handleBtcInvoiceReady,
    handleBtcComplete,
    clearBtcPaymentConfig,
    cashPaymentConfig,
    handleCashComplete,
    clearCashPaymentConfig,
  };
}
