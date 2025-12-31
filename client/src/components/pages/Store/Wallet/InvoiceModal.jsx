"use client";

import {
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

export function InvoiceModdal({ showInvoiceModal, handleCloseInvoiceModal, createdInvoice, invoicePaid, invoiceCompletedAt, invoiceAwaitingPayment }) {
  const t = useTranslations("wallet");
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

  return (
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
  );
}
