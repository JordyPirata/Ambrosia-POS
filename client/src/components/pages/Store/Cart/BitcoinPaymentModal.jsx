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

  const handleClose = () => {
    reset();
    onClose?.();
  };

  const handleComplete = () => {
    if (!invoice) return;
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
          {loading && (
            <div className="flex items-center justify-center py-6">
              <Spinner color="warning" label={t("generating")} />
            </div>
          )}

          {!loading && error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded">
              <p className="text-sm">{error}</p>
              <Button className="mt-3" color="warning" onPress={generateInvoice}>
                {t("retry")}
              </Button>
            </div>
          )}

          {!loading && !error && invoice && (
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
        </ModalBody>
        <ModalFooter className="flex gap-2">
          <Button variant="flat" onPress={handleClose}>
            Cancelar
          </Button>
          <Button
            color="success"
            isDisabled={!invoice || loading}
            onPress={handleComplete}
          >
            Pago recibido
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
