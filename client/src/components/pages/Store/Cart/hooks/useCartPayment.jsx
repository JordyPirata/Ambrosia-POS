"use client";
import { useCallback, useState } from "react";
import { addToast } from "@heroui/react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/modules/auth/useAuth";
import { useCurrency } from "@/components/hooks/useCurrency";
import { usePaymentMethods } from "../hooks/usePaymentMethod";
import { useOrders } from "../../hooks/useOrders";
import { usePayments } from "../../hooks/usePayments";
import { useTickets } from "../../hooks/useTickets";

export function useCartPayment({ onPay, onResetCart } = {}) {
  const t = useTranslations("cart.payment");
  const { user } = useAuth();
  const { currency, formatAmount } = useCurrency();
  const { paymentMethods } = usePaymentMethods();
  const { createOrder, updateOrder } = useOrders();
  const { createPayment, linkPaymentToTicket, getPaymentCurrencyById } = usePayments();
  const { createTicket } = useTickets();

  const [isPaying, setIsPaying] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [btcPaymentConfig, setBtcPaymentConfig] = useState(null);
  const [cashPaymentConfig, setCashPaymentConfig] = useState(null);

  const clearPaymentError = useCallback(() => setPaymentError(""), []);

  const handlePay = useCallback(
    async ({
      items = [],
      subtotal = 0,
      discount = 0,
      discountAmount = 0,
      total = 0,
      selectedPaymentMethod,
    }) => {
      if (!selectedPaymentMethod) {
        setPaymentError(t("errors.selectMethod"));
        return;
      }

      if (!items.length) {
        setPaymentError(t("errors.emptyCart"));
        return;
      }

      if (!user?.user_id) {
        setPaymentError(t("errors.noUser"));
        return;
      }

      if (!currency?.id) {
        setPaymentError(t("errors.noCurrency"));
        return;
      }

      setIsPaying(true);
      setPaymentError("");

      try {
        const currencyId = currency.id;

        let paymentMethodData =
          paymentMethods.find((m) => m.id === selectedPaymentMethod) || null;
        let methodName = (paymentMethodData?.name || "").toLowerCase();

        const paymentPayload = {
          method_id: selectedPaymentMethod,
          currency_id: currencyId,
          transaction_id: "",
          amount: total / 100,
        };

        if (methodName.includes("btc")) {
          const currencyData = await getPaymentCurrencyById(currencyId);
          const currencyAcronym = (
            currencyData?.acronym ||
            currency?.acronym ||
            "MXN"
          ).toLowerCase();

          setBtcPaymentConfig({
            amountFiat: paymentPayload.amount,
            currencyAcronym,
            displayTotal: formatAmount(total),
            subtotal,
            discount,
            discountAmount,
            total,
            items,
            selectedPaymentMethod,
            currencyId,
          });
          setIsPaying(false);
          return;
        }

        const orderPayload = {
          user_id: user.user_id,
          table_id: null,
          waiter: user.name || "Vendedor",
          status: "paid",
          total: total / 100,
          created_at: new Date().toISOString(),
        };

        const orderResponse = await createOrder(orderPayload);
        const orderId = orderResponse?.id;
        if (!orderId) {
          throw new Error(t("errors.createOrder"));
        }

        const ticketPayload = {
          order_id: orderId,
          user_id: user.user_id,
          ticket_date: Date.now().toString(),
          status: 1,
          total_amount: total / 100,
          notes: "",
        };

        const ticketResponse = await createTicket(ticketPayload);
        if (!ticketResponse?.id) {
          throw new Error(t("errors.createTicket"));
        }

        const paymentResponse = await createPayment(paymentPayload);
        if (!paymentResponse?.id) {
          throw new Error(t("errors.createPayment"));
        }

        await linkPaymentToTicket(paymentResponse?.id, ticketResponse?.id);

        const paymentResult = {
          items,
          subtotal,
          discount,
          discountAmount,
          total,
          amount: paymentPayload.amount,
          paymentMethod: selectedPaymentMethod,
          paymentId: paymentResponse?.id || null,
          orderId,
          ticketId: ticketResponse?.id || null,
        };

        if (methodName.includes("cash") || methodName.includes("efectivo")) {
          setCashPaymentConfig({
            amountDue: paymentPayload.amount,
            displayTotal: formatAmount(total),
            paymentResult,
            orderPayload,
            orderId,
          });
          return;
        }

        if (orderId) {
          await updateOrder(orderId, { ...orderPayload, id: orderId, status: "paid" });
        }

        addToast({
          color: "success",
          description: t("success.paid"),
        });
        onResetCart?.();
        onPay?.(paymentResult);
      } catch (err) {
        console.error("Error processing payment:", err);
        const message = err?.message || t("errors.process");
        setPaymentError(message);
        addToast({
          color: "danger",
          description: message,
        });
      } finally {
        setIsPaying(false);
      }
    },
    [currency, formatAmount, onPay, onResetCart, paymentMethods, user, createOrder, updateOrder, createPayment, createTicket, getPaymentCurrencyById, t],
  );

  const handleBtcInvoiceReady = useCallback(
    (data) => {
      if (!btcPaymentConfig) return;
      setBtcPaymentConfig((prev) =>
        prev ? { ...prev, invoiceData: data } : prev,
      );
    },
    [],
  );

  const handleBtcComplete = useCallback(
    async (data) => {
      if (!btcPaymentConfig) return;
      setIsPaying(true);
      try {
        const orderPayload = {
          user_id: user?.user_id,
          table_id: null,
          waiter: user?.name || "Vendedor",
          status: "paid",
          total: btcPaymentConfig.amountFiat,
          created_at: new Date().toISOString(),
        };

        const orderResponse = await createOrder(orderPayload);
        const orderId = orderResponse?.id;
        if (!orderId) {
          throw new Error(t("errors.createOrder"));
        }

        const ticketPayload = {
          order_id: orderId,
          user_id: user?.user_id,
          ticket_date: Date.now().toString(),
          status: 1,
          total_amount: btcPaymentConfig.amountFiat,
          notes: ""
        };

        const ticketResponse = await createTicket(ticketPayload);
        if (!ticketResponse?.id) {
          throw new Error(t("errors.createTicket"));
        }

        const paymentPayload = {
          method_id: btcPaymentConfig.selectedPaymentMethod,
          currency_id: btcPaymentConfig.currencyId,
          transaction_id: data?.invoice?.serialized || "",
          amount: btcPaymentConfig.amountFiat,
        };

        const paymentResponse = await createPayment(paymentPayload);
        if (!paymentResponse?.id) {
          throw new Error(t("errors.createPayment"));
        }

        await linkPaymentToTicket(paymentResponse?.id, ticketResponse?.id);

        onPay?.({
          items: btcPaymentConfig.items,
          subtotal: btcPaymentConfig.subtotal,
          discount: btcPaymentConfig.discount,
          discountAmount: btcPaymentConfig.discountAmount,
          total: btcPaymentConfig.total,
          amount: btcPaymentConfig.amountFiat,
          paymentMethod: btcPaymentConfig.selectedPaymentMethod,
          paymentId: paymentResponse?.id || null,
          orderId,
          ticketId: ticketResponse?.id || null,
          ...data,
        });
        onResetCart?.();
        addToast({
          color: "success",
          description: t("success.btcPaid"),
        });
      } catch (err) {
        console.error("Error completing BTC payment:", err);
        const message = err?.message || t("errors.btcComplete");
        setPaymentError(message);
        addToast({
          color: "danger",
          description: message,
        });
      } finally {
        setBtcPaymentConfig(null);
        setIsPaying(false);
      }
    },
    [btcPaymentConfig, onPay, onResetCart, user, createOrder, updateOrder, createPayment, createTicket, t],
  );

  const clearBtcPaymentConfig = useCallback(() => {
    setBtcPaymentConfig(null);
  }, []);

  const handleCashComplete = useCallback(
    async ({ cashReceived, change }) => {
      if (!cashPaymentConfig) return;
      try {
        if (cashPaymentConfig.orderId) {
          await updateOrder(cashPaymentConfig.orderId, {
            ...cashPaymentConfig.orderPayload,
            id: cashPaymentConfig.orderId,
            status: "paid",
          });
        }

        onPay?.({
          ...cashPaymentConfig.paymentResult,
          cashReceived,
          change,
        });
        onResetCart?.();
        addToast({
          color: "success",
          description: t("success.cashPaid"),
        });
      } catch (err) {
        console.error("Error completing cash payment:", err);
        const message = err?.message || t("errors.cashComplete");
        setPaymentError(message);
        addToast({
          color: "danger",
          description: message,
        });
      } finally {
        setCashPaymentConfig(null);
      }
    },
    [cashPaymentConfig, onPay, onResetCart, updateOrder, t],
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
