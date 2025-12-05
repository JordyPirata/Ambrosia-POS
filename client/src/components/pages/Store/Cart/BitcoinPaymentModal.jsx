import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "@heroui/react";
import { QRCode } from "react-qr-code";
import { useBitcoinInvoice } from "./hooks/useBitcoinInvoice";
import { useTranslations } from "next-intl";
import { usePaymentWebsocket } from "@/hooks/usePaymentWebsocket";
import { useEffect, useRef, useState } from "react";

export function BitcoinPaymentModal({
  isOpen,
  onClose,
  onComplete,
  onInvoiceReady,
  amountFiat,
  currencyAcronym = "usd",
  paymentId,
  displayTotal,
}) {
  const t = useTranslations("cart.paymentModal.bitcoin");
  const { setInvoiceHash, onPayment } = usePaymentWebsocket();
  const [paymentReceived, setPaymentReceived] = useState(false);
  const completedRef = useRef(false);
  const {
    invoice,
    satsAmount,
    loading,
    error,
    generateInvoice,
    reset,
  } = useBitcoinInvoice({
    amountFiat: isOpen ? amountFiat : null,
    currencyAcronym,
    paymentId,
    autoGenerate: isOpen,
    onInvoiceReady,
  });

  useEffect(() => {
    if (invoice?.paymentHash) {
      setPaymentReceived(false);
      completedRef.current = false;
      setInvoiceHash(invoice.paymentHash);
    } else if (!isOpen) {
      setInvoiceHash(null);
      completedRef.current = false;
      setPaymentReceived(false);
    }
  }, [invoice, isOpen, setInvoiceHash]);

  useEffect(() => {
    const off = onPayment((data) => {
      if (
        invoice?.paymentHash &&
        data.paymentHash === invoice.paymentHash &&
        !completedRef.current
      ) {
        completedRef.current = true;
        setPaymentReceived(true);
        onComplete?.({ invoice, satoshis: satsAmount, paymentId, auto: true });
      }
    });
    return () => off?.();
  }, [invoice, satsAmount, paymentId, onComplete, onPayment]);

  const handleClose = () => {
    setInvoiceHash(null);
    completedRef.current = false;
    setPaymentReceived(false);
    reset();
    onClose?.();
  };

  const handleComplete = () => {
    if (!invoice || completedRef.current) return;
    completedRef.current = true;
    setPaymentReceived(true);
    onComplete?.({ invoice, satoshis: satsAmount, paymentId });
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <ModalContent>
        <ModalHeader className="flex flex-col">
          <span className="text-base font-semibold text-green-900">
            {t("title")}
          </span>
          <span className="text-sm text-gray-600">
            {t("subtitle")}
          </span>
        </ModalHeader>
        <ModalBody className="space-y-4">
          {loading && !paymentReceived && (
            <div className="flex items-center justify-center py-6">
              <Spinner color="warning" label={t("generating")} />
            </div>
          )}

          {!loading && !paymentReceived && error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded">
              <p className="text-sm">{error}</p>
              <Button className="mt-3" color="warning" onPress={generateInvoice}>
                {t("retry")}
              </Button>
            </div>
          )}

          {!loading && !paymentReceived && !error && invoice && (
            <>
              <div className="flex justify-center">
                <div className="bg-white p-4 rounded-xl shadow">
                  <QRCode
                    value={invoice?.serialized || ""}
                    size={220}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  />
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">{t("totalLabel")}</p>
                <p className="text-xl font-semibold text-green-900">
                  {displayTotal}
                </p>
                {satsAmount ? (
                  <p className="text-xs text-gray-500">{satsAmount} sats</p>
                ) : null}
              </div>
            </>
          )}

          {paymentReceived && (
            <div className="flex flex-col items-center justify-center py-6 space-y-3">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-green-600"
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
              <p className="text-lg font-semibold text-green-900">
                {t("confirmed")}
              </p>
            </div>
          )}
        </ModalBody>
        <ModalFooter className="flex gap-2">
          <Button variant="flat" onPress={handleClose}>
            {t("cancel")}
          </Button>
          <Button
            color={paymentReceived ? "success" : "primary"}
            isDisabled={loading}
            onPress={paymentReceived ? handleClose : handleComplete}
          >
            {paymentReceived ? t("close") : t("confirm")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
