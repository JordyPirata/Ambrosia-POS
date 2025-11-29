"use client";

import { Chip } from "@heroui/react";
import { Clock, AlertCircle, CheckCircle, Receipt } from "lucide-react";
import { useTranslations } from "next-intl";

const STATUS_META = {
  open: { color: "success", icon: Clock },
  closed: { color: "warning", icon: AlertCircle },
  paid: { color: "primary", icon: CheckCircle },
};

const getStatusMeta = (status) => STATUS_META[status] ?? { color: "default", icon: Receipt };

export function StatusChip({ status }) {
  const t = useTranslations("orders");
  const labels = {
    open: t("status.open"),
    closed: t("status.closed"),
    paid: t("status.paid"),
  };

  const { color, icon: Icon } = getStatusMeta(status);
  const label = labels[status] ?? status;

  return (
    <Chip color={color} variant="flat" startContent={<Icon className="w-3 h-3" />} size="sm">
      {label}
    </Chip>
  );
}
