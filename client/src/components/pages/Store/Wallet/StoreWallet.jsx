"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  addToast,
  Card,
  CardBody,
  Button,
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import {
  Copy,
  QrCode,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { QRCode } from "react-qr-code";

import WalletGuard from "@components/auth/WalletGuard";
import { usePaymentWebsocket } from "@hooks/usePaymentWebsocket";
import {
  getIncomingTransactions,
  getInfo,
  getOutgoingTransactions,
} from "@modules/cashier/cashierService";

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

  const copyToClipboard = async (text) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        addToast({
          title: "Copiado",
          description: "Texto copiado al portapapeles",
          variant: "solid",
          color: "success",
        });
      } catch (err) {
        console.error("Error al copiar con clipboard API", err);
        fallbackCopy(text);
      }
    } else {
      fallbackCopy(text);
    }
  };

  const fallbackCopy = (text) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
      document.execCommand("copy");
      addToast({
        title: "Copiado",
        description: "Texto copiado al portapapeles",
        variant: "solid",
        color: "success",
      });
    } catch (err) {
      console.error("Fallback copy failed", err);
      addToast({
        title: "Error",
        description: "No se pudo copiar al portapapeles",
        variant: "solid",
        color: "danger",
      });
    }
    document.body.removeChild(textarea);
  };

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

      {/* Invoice Modal */}
      <Modal
        isOpen={showInvoiceModal}
        onClose={handleCloseInvoiceModal}
        size="2xl"
      >
        <ModalContent>
          <ModalHeader>
            <div className="flex items-center space-x-2">
              <QrCode className="w-5 h-5 text-forest" />
              <span>{t("invoiceModal.title")}</span>
            </div>
          </ModalHeader>
          <ModalBody>
            {invoicePaid ? (
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center shadow-inner">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div className="text-center space-y-1">
                  <p className="text-xl font-semibold text-green-900">
                    {t("invoiceModal.paymentReceived")}
                  </p>
                  {invoiceCompletedAt && (
                    <p className="text-sm text-green-700">
                      {t("invoiceModal.paidAt", {
                        time: new Date(invoiceCompletedAt).toLocaleTimeString(),
                      })}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              createdInvoice && (
                <div className="space-y-6">
                  <div className="flex justify-center">
                    <div className="bg-white p-4 rounded-lg border">
                      <QRCode value={createdInvoice.serialized} size={200} />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-deep">
                          {t("invoiceModal.invoice")}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onPress={() => copyToClipboard(createdInvoice.serialized)}
                        >
                          <Copy className="w-3 h-3 mr-1" />
                          {t("invoiceModal.copyButton")}
                        </Button>
                      </div>
                      <div className="bg-gray-50 p-3 rounded text-xs break-all">
                        {createdInvoice.serialized}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-deep">
                          {t("invoiceModal.paymentHash")}
                        </span>
                        {invoiceAwaitingPayment ? (
                          <div className="flex items-center space-x-2 text-sm text-forest">
                            <Spinner size="sm" color="success" />
                            <span>{t("invoiceModal.waitingPayment")}</span>
                          </div>
                        ) : null}
                        <Button
                          size="sm"
                          variant="outline"
                          onPress={() => copyToClipboard(createdInvoice.paymentHash)}
                        >
                          <Copy className="w-3 h-3 mr-1" />
                          {t("invoiceModal.copyButton")}
                        </Button>
                      </div>
                      <div className="bg-gray-50 p-3 rounded text-xs break-all">
                        {createdInvoice.paymentHash}
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onPress={handleCloseInvoiceModal}>
              {t("invoiceModal.closeButton")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
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
