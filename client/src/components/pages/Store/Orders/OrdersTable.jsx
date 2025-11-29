"use client";

import formatDate from "@/lib/formatDate";
import { Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/react";
import { Eye, Users, Calendar } from "lucide-react";
import { StatusChip } from "./StatusChip";
import { useTranslations } from "next-intl";

export function OrdersTable({ orders, formatAmount, onViewOrder }) {
  const t = useTranslations("orders");
  return (
    <Table
      aria-label="OrdersTable"
      classNames={{
        wrapper: "min-h-[400px]",
      }}
    >
      <TableHeader>
        <TableColumn className="bg-gray-50 text-forest font-semibold">{t("table.id")}</TableColumn>
        <TableColumn className="bg-gray-50 text-forest font-semibold">{t("table.waiter")}</TableColumn>
        <TableColumn className="bg-gray-50 text-forest font-semibold">{t("table.status")}</TableColumn>
        <TableColumn className="bg-gray-50 text-forest font-semibold">{t("table.total")}</TableColumn>
        <TableColumn className="bg-gray-50 text-forest font-semibold">{t("table.date")}</TableColumn>
        <TableColumn className="bg-gray-50 text-forest font-semibold">{t("table.actions")}</TableColumn>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id} className="hover:bg-gray-50">
            <TableCell>
              <span className="font-mono text-sm text-gray-700">{order.id.substring(0, 8)}...</span>
            </TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="font-medium text-deep">
                  {order.waiter || t("details.unassigned")}
                </span>
              </div>
            </TableCell>
            <TableCell>
              <StatusChip status={order.status} />
            </TableCell>
            <TableCell>{formatAmount(order.total * 100)}</TableCell>
            <TableCell>
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(order.created_at)}</span>
              </div>
            </TableCell>
            <TableCell>
              <Button variant="outline" color="primary" size="sm" onPress={() => onViewOrder(order)}>
                <Eye className="w-4 h-4 mr-1" />
                {t("table.view")}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
