"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  addToast,
  Card,
  CardBody,
  Spinner,
} from "@heroui/react";
import { useTranslations } from "next-intl";

import WalletGuard from "@components/auth/WalletGuard";
import { usePaymentWebsocket } from "@hooks/usePaymentWebsocket";
import {
  getIncomingTransactions,
  getInfo,
  getOutgoingTransactions,
} from "@modules/cashier/cashierService";

import { InvoiceModdal } from "./InvoiceModal";
import { NodeError } from "./NodeError";
import { NodeInfo } from "./NodeInfo";
import { Transactions } from "./Transactions";

function WalletInner() {
  const t = useTranslations("wallet");
  const [info, setInfo] = useState(null);
  const [createdInvoice, setCreatedInvoice] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoicePaid, setInvoicePaid] = useState(false);
  const [invoiceAwaitingPayment, setInvoiceAwaitingPayment] = useState(false);
  const [invoiceCompletedAt, setInvoiceCompletedAt] = useState(null);
  const fetchTransactionsRef = useRef(null);
  const invoiceHashRef = useRef(null);
  const { setInvoiceHash, setFetchers, onPayment } = usePaymentWebsocket();

  const fetchInfo = useCallback(async () => {
    try {
      const res = await getInfo();
      setInfo(res);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Error al obtener la información de la wallet");
      addToast({
        title: "Error",
        description: "No se pudo cargar la información de la wallet",
        variant: "solid",
        color: "danger",
      });
    }
  }, []);

  const fetchTransactions = useCallback(
    async () => {
      try {
        setLoading(true);
        let incoming = [];
        let outgoing = [];

        if (filter === "incoming" || filter === "all") {
          incoming = await getIncomingTransactions();
        }
        if (filter === "outgoing" || filter === "all") {
          outgoing = await getOutgoingTransactions();
        }

        const allTx = [...incoming, ...outgoing].sort(
          (a, b) => b.completedAt - a.completedAt,
        );
        setTransactions(allTx);
      } catch (err) {
        console.error("Error al obtener transacciones:", err);
        setError("Error al cargar historial");
        addToast({
          title: "Error",
          description: "No se pudo cargar el historial de transacciones",
          variant: "solid",
          color: "danger",
        });
      } finally {
        setLoading(false);
      }
    }, [filter]);

  useEffect(() => {
    fetchInfo();
  }, [fetchInfo]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  useEffect(() => {
    fetchTransactionsRef.current = fetchTransactions;
    setFetchers(fetchInfo, fetchTransactions);
  }, [fetchTransactions, fetchInfo, setFetchers]);

  useEffect(() => {
    invoiceHashRef.current = createdInvoice?.paymentHash || null;
    setInvoiceHash(createdInvoice?.paymentHash || null);
    setInvoiceAwaitingPayment(Boolean(createdInvoice));
    setInvoiceCompletedAt(null);
  }, [createdInvoice, setInvoiceHash]);

  useEffect(() => {
    const off = onPayment((data) => {
      if (
        invoiceHashRef.current &&
        data.paymentHash &&
        data.paymentHash === invoiceHashRef.current
      ) {
        setInvoicePaid(true);
        setInvoiceAwaitingPayment(false);
        setInvoiceCompletedAt(Date.now());
      }
    });
    return () => off?.();
  }, [onPayment]);

  const handleCloseInvoiceModal = () => {
    setShowInvoiceModal(false);
    setInvoiceAwaitingPayment(false);
    setInvoiceCompletedAt(null);
  };

  if (!info) {
    return (
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white">
        <CardBody className="flex flex-col items-center justify-center py-12">
          <Spinner size="lg" color="success" />
          <p className="text-lg font-semibold text-deep mt-4">
            {t("loadingMessage")}
          </p>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="">
      {error && (
        <NodeError error={error} />
      )}

      <NodeInfo info={info} />

      <Transactions
        transactions={transactions}
        loading={loading}
        setLoading={setLoading}
        error={error}
        setError={setError}
        showInvoiceModal={showInvoiceModal}
        setShowInvoiceModal={setShowInvoiceModal}
        filter={filter}
        setFilter={setFilter}
        setCreatedInvoice={setCreatedInvoice}
        setInvoicePaid={setInvoicePaid}
        setInvoiceAwaitingPayment={setInvoiceAwaitingPayment}
        setInvoiceCompletedAt={setInvoiceCompletedAt}
      />

      <InvoiceModdal
        showInvoiceModal={showInvoiceModal}
        handleCloseInvoiceModal={handleCloseInvoiceModal}
        createdInvoice={createdInvoice}
        invoicePaid={invoicePaid}
        invoiceCompletedAt={invoiceCompletedAt}
        invoiceAwaitingPayment={invoiceAwaitingPayment}
      />

    </div>
  );
}

export function StoreWallet() {
  const t = useTranslations("wallet");
  return (
    <WalletGuard
      placeholder={<div className="min-h-screen gradient-fresh p-4" />}
      title={t("access.title")}
      passwordLabel={t("access.passwordLabel")}
      confirmText={t("access.confirmText")}
      cancelText={t("access.cancelText")}
    >
      <WalletInner />
    </WalletGuard>
  );
}
