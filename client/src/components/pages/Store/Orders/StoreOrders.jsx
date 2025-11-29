"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Filter } from "lucide-react";
import {
  Card,
  CardBody,
  CardHeader,
  Pagination,
} from "@heroui/react";
import { useTranslations } from "next-intl";
import { useOrders } from "../hooks/useOrders";
import { useCurrency } from "@/components/hooks/useCurrency";
import { EmptyOrdersState } from "./EmptyOrdersState";
import { OrdersFilterBar } from "./OrdersFilterBar";
import { OrdersTable } from "./OrdersTable";

export default function StoreOrders() {
  const t = useTranslations("orders");
  const [filter, setFilter] = useState("paid");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { orders } = useOrders();
  const { formatAmount } = useCurrency();
  const paidCount = orders.filter((order) => order.status === "paid").length;

  const handleOrderClick = (orderId) => {
  };

  const filteredOrders = orders.filter((order) => {
    const searchMatch =
      searchTerm === "" ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.waiter?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.table_id?.toLowerCase().includes(searchTerm.toLowerCase());

    return searchMatch;
  });

  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen gradient-fresh p-4">
      <div className="max-w-7xl mx-auto">
        <Card className="mb-6 shadow-lg border-0 bg-white">
          <CardBody>
            <OrdersFilterBar
              filter={filter}
              searchTerm={searchTerm}
              rowsPerPage={rowsPerPage}
              paidCount={paidCount}
              onSearchChange={(value) => {
                setSearchTerm(value);
                setPage(1);
              }}
              onRowsPerPageChange={(value) => {
                setRowsPerPage(parseInt(value, 10));
                setPage(1);
              }}
              onFilterChange={(value) => setFilter(String(value))}
            />
          </CardBody>
        </Card>

        <Card className="shadow-lg border-0 bg-white">
          <CardHeader>
            <h3 className="text-lg font-bold text-deep flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              {t("header.paid", { count: filteredOrders.length })}
            </h3>
          </CardHeader>
          <CardBody>
            {filteredOrders.length > 0 ? (
              <div className="space-y-4">
                <OrdersTable
                  orders={paginatedOrders}
                  formatAmount={formatAmount}
                  onViewOrder={handleOrderClick}
                />

                {totalPages > 1 && (
                  <div className="flex justify-center mt-6">
                    <Pagination
                      total={totalPages}
                      page={page}
                      onChange={setPage}
                      color="primary"
                      showControls
                      showShadow
                    />
                  </div>
                )}
              </div>
            ) : (
              <EmptyOrdersState filter={filter} searchTerm={searchTerm} />
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
