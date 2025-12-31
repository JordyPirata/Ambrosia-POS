"use client";

import { useState } from "react";

import {
  addToast,
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Tabs,
  Tab,
  Divider,
  Spinner,
  Chip,
} from "@heroui/react";
import {
  Zap,
  ArrowDownLeft,
  ArrowUpRight,
  Copy,
  Send,
  QrCode,
  Bitcoin,
  History,
  CheckCircle,
} from "lucide-react";
import { useTranslations } from "next-intl";

import {
  createInvoice,
  payInvoiceFromService,
} from "@modules/cashier/cashierService";

import { formatSats, copyToClipboard } from "./utils/formatters";

export function Transactions({
  transactions,
  loading,
  setLoading,
  setError,
  setShowInvoiceModal,
  filter,
  setFilter,
  setCreatedInvoice,
  setInvoicePaid,
  setInvoiceAwaitingPayment,
  setInvoiceCompletedAt,
}) {
  const t = useTranslations("wallet");
  const [activeTab, setActiveTab] = useState("receive");
  const [invoiceAmount, setInvoiceAmount] = useState("");
  const [invoiceDesc, setInvoiceDesc] = useState("");
  const [payInvoice, setPayInvoice] = useState("");
  const [paymentResult, setPaymentResult] = useState(null);

  const handleCreateInvoice = async () => {
    if (!invoiceAmount) {
      setError("Debes ingresar un monto para la invoice");
      return;
    }
    try {
      setLoading(true);
      const res = await createInvoice(invoiceAmount, invoiceDesc);
      setCreatedInvoice(res);
      setInvoicePaid(false);
      setInvoiceAwaitingPayment(true);
      setInvoiceCompletedAt(null);
      setShowInvoiceModal(true);
      setInvoiceAmount("");
      setInvoiceDesc("");
      setError("");
      addToast({
        title: t("payments.receive.invoiceSuccessTitle"),
        description: t("payments.receive.invoiceSuccessDescription"),
        variant: "solid",
        color: "success",
      });
    } catch (err) {
      console.error(err);
      setError("Error al crear la invoice");
      addToast({
        title: "Error",
        description: "No se pudo crear la invoice",
        variant: "solid",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePayInvoice = async () => {
    if (!payInvoice.trim()) {
      setError("Debes ingresar una invoice para pagar");
      return;
    }
    try {
      setLoading(true);
      const res = await payInvoiceFromService(payInvoice);
      setPaymentResult(res);
      setPayInvoice("");
      setError("");
      addToast({
        title: "Pago Enviado",
        description: "El pago Lightning se ha enviado correctamente",
        variant: "solid",
        color: "success",
      });
    } catch (err) {
      console.error(err);
      setError("Error al pagar la invoice");
      addToast({
        title: "Error",
        description: "No se pudo procesar el pago",
        variant: "solid",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const getTransactionIcon = (type) => (
    type === "outgoing_payment" ? (
      <ArrowUpRight className="w-4 h-4 text-red-600" />
    ) : (
      <ArrowDownLeft className="w-4 h-4 text-green-600" />
    )
  );

  return (
    <Card className="rounded-lg mb-6 p-6">
      <CardBody className="p-0">
        <Tabs
          selectedKey={activeTab}
          onSelectionChange={setActiveTab}
          variant="underlined"
          classNames={{
            tabList:
              "gap-6 relative rounded-none px-6 py-0",
            cursor: "w-full bg-forest",
            tab: "max-w-fit px-6 py-4 h-12",
            tabContent: "group-data-[selected=true]:text-forest",
          }}
        >
          <Tab
            key="receive"
            title={(
              <div className="flex items-center space-x-2">
                <ArrowDownLeft className="w-4 h-4" />
                <span>{t("payments.receive.tabTitle")}</span>
              </div>
            )}
          >
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <Input
                  type="number"
                  label={t("payments.receive.invoiceAmountLabel")}
                  placeholder="1000"
                  value={invoiceAmount}
                  onChange={(e) => setInvoiceAmount(e.target.value)}
                  variant="bordered"
                  size="lg"
                  startContent={
                    <Bitcoin className="w-4 h-4 text-gray-400" />
                  }
                  classNames={{
                    input: "text-base",
                    label: "text-sm font-semibold text-deep",
                  }}
                  disabled={loading}
                />
                <Input
                  label={t("payments.receive.invoiceDescriptionLabel")}
                  placeholder={t("payments.receive.invoiceDescriptionPlaceholder")}
                  value={invoiceDesc}
                  onChange={(e) => setInvoiceDesc(e.target.value)}
                  variant="bordered"
                  size="lg"
                  classNames={{
                    input: "text-base",
                    label: "text-sm font-semibold text-deep",
                  }}
                  disabled={loading}
                />
                <Button
                  onPress={handleCreateInvoice}
                  variant="solid"
                  color="primary"
                  size="lg"
                  disabled={loading || !invoiceAmount}
                  className="w-full gradient-forest text-white"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <Spinner size="sm" color="white" />
                      <span>{t("payments.receive.invoiceLightningLoading")}</span>
                    </div>
                  ) : (
                    <>
                      <QrCode className="w-4 h-4 mr-2" />
                      {t("payments.receive.invoiceLightningButton")}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Tab>

          <Tab
            key="send"
            title={(
              <div className="flex items-center space-x-2">
                <ArrowUpRight className="w-4 h-4" />
                <span>{t("payments.send.tabTitle")}</span>
              </div>
            )}
          >
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <Input
                  label={t("payments.send.payInvoiceLabel")}
                  placeholder="lnbc1..."
                  value={payInvoice}
                  onChange={(e) => setPayInvoice(e.target.value)}
                  variant="bordered"
                  size="lg"
                  startContent={<Zap className="w-4 h-4 text-gray-400" />}
                  classNames={{
                    input: "text-base",
                    label: "text-sm font-semibold text-deep",
                  }}
                  disabled={loading}
                />
                <Button
                  onPress={handlePayInvoice}
                  variant="solid"
                  color="warning"
                  size="lg"
                  disabled={loading || !payInvoice.trim()}
                  className="w-full"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <Spinner size="sm" color="white" />
                      <span>{t("payments.send.payLightningLoading")}</span>
                    </div>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      {t("payments.send.payLightningButton")}
                    </>
                  )}
                </Button>
              </div>

              {paymentResult && (
                <Card className="bg-green-50 border-green-200">
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-bold text-green-800">
                        {t("payments.send.paymentDone")}
                      </span>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-green-700">
                          {t("payments.send.amountSent")}
                        </span>
                        <span className="font-medium">
                          {formatSats(paymentResult.recipientAmountSat)}{" "}
                          sats
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">
                          {t("payments.send.routingFee")}
                        </span>
                        <span className="font-medium">
                          {formatSats(paymentResult.routingFeeSat)} sats
                        </span>
                      </div>
                      <Divider />
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-green-700">
                            {t("payments.send.paymentHash")}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onPress={() => copyToClipboard(paymentResult.paymentHash)}
                          >
                            <Copy className="w-3 h-3 mr-1" />
                            {t("payments.send.copyButton")}
                          </Button>
                        </div>
                        <div className="bg-white p-2 rounded text-xs break-all">
                          {paymentResult.paymentHash}
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              )}
            </div>
          </Tab>

          <Tab
            key="history"
            title={(
              <div className="flex items-center space-x-2">
                <History className="w-4 h-4" />
                <span>{t("payments.history.tabTitle")}</span>
              </div>
            )}
          >
            <div className="p-6 space-y-6">
              <div className="flex space-x-2">
                <Button
                  variant={filter === "all" ? "solid" : "outline"}
                  color="primary"
                  size="sm"
                  onPress={() => setFilter("all")}
                >
                  {t("payments.history.all")}
                </Button>
                <Button
                  variant={filter === "incoming" ? "solid" : "outline"}
                  color="success"
                  size="sm"
                  onPress={() => setFilter("incoming")}
                >
                  {t("payments.history.received")}
                </Button>
                <Button
                  variant={filter === "outgoing" ? "solid" : "outline"}
                  color="danger"
                  size="sm"
                  onPress={() => setFilter("outgoing")}
                >
                  {t("payments.history.sent")}
                </Button>
              </div>

              {loading ? (
                <div className="flex justify-center py-8">
                  <Spinner size="lg" />
                </div>
              ) : transactions.length === 0 ? (
                <div className="text-center py-12">
                  <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-deep mb-2">
                    {t("payments.history.noTx")}
                  </h3>
                  <p className="text-gray-500">
                    {t("payments.history.noTxMessage")}
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {transactions.map((tx, i) => (
                    <Card
                      key={tx.paymentId || tx.txId || i}
                      className="border"
                    >
                      <CardBody className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                              {getTransactionIcon(tx.type)}
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-semibold text-deep">
                                  {tx.type === "outgoing_payment"
                                    ? t("payments.history.sent")
                                    : t("payments.history.received")}
                                </span>
                                <Chip
                                  size="sm"
                                  color={
                                    tx.type === "outgoing_payment"
                                      ? "danger"
                                      : "success"
                                  }
                                  variant="flat"
                                >
                                  {formatSats(
                                    tx.type === "outgoing_payment"
                                      ? tx.sent
                                      : tx.receivedSat,
                                  )}{" "}
                                  sats
                                </Chip>
                              </div>
                              <p className="text-sm text-forest">
                                Fee: {formatSats(Number(tx.fees) / 1000)}{" "}
                                sats
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">
                              {new Date(
                                tx.completedAt,
                              ).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-gray-400">
                              {new Date(
                                tx.completedAt,
                              ).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </Tab>
        </Tabs>
      </CardBody>
    </Card>
  );
}
