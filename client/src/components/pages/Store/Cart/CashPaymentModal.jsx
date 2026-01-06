"use client";
import { useMemo, useState } from "react";

import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Chip,
} from "@heroui/react";
import { useTranslations } from "next-intl";

import { useCurrency } from "@/components/hooks/useCurrency";

export function CashPaymentModal({
  isOpen,
  onClose,
  onComplete,
  amountDue = 0,
  displayTotal,
}) {
  const t = useTranslations("cart.paymentModal.cash");
  const { formatAmount } = useCurrency();
  const [cashReceived, setCashReceived] = useState("");
  const [error, setError] = useState("");
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setCashReceived("");
      setError("");
    }
  }

  const numericReceived = useMemo(() => {
    const value = parseFloat(cashReceived);
    return Number.isFinite(value) ? value : 0;
  }, [cashReceived]);

  const change = useMemo(() => numericReceived - (amountDue || 0), [numericReceived, amountDue]);
  const hasEnoughCash = change >= 0;
  const formattedTotal = displayTotal || formatAmount((amountDue || 0) * 100);
  const formattedChange = Number.isFinite(change) ? formatAmount(change * 100) : change;

  const handleConfirm = () => {
    if (!hasEnoughCash) {
      setError(t("errors.insufficient"));
      return;
    }
    onComplete?.({
      cashReceived: numericReceived,
      change,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalContent className="bg-gradient-to-b from-white to-green-50">
        <ModalHeader className="flex flex-col">
          <span className="text-base font-semibold text-green-900">
            {t("title")}
          </span>
          <span className="text-sm text-gray-600">
            {t("subtitle")}
          </span>
        </ModalHeader>
        <ModalBody className="space-y-4">
          <div className="bg-white border border-green-100 rounded-xl p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">{t("totalLabel")}</p>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-semibold text-green-900">
                {formattedTotal}
              </p>
              <Chip color="success" variant="flat" className="text-xs">
                {t("cash")}
              </Chip>
            </div>
          </div>

          <Input
            type="number"
            label={t("receivedLabel")}
            placeholder="0.00"
            value={cashReceived}
            onValueChange={(value) => {
              setCashReceived(value);
              setError("");
            }}
            min={0}
            step="0.01"
            size="lg"
          />

          <div className="bg-white rounded-lg border p-3 flex justify-between items-center shadow-sm">
            <span className="text-sm text-gray-600">{t("changeLabel")}</span>
            <span className={`text-lg font-semibold ${hasEnoughCash ? "text-green-700" : "text-red-600"}`}>
              {formattedChange}
            </span>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </ModalBody>
        <ModalFooter className="flex gap-2">
          <Button variant="flat" onPress={onClose}>
            {t("cancel")}
          </Button>
          <Button
            color="success"
            isDisabled={!cashReceived}
            onPress={handleConfirm}
          >
            {t("confirm")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
