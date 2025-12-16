"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import WalletGuard from "../../../auth/WalletGuard";
import {
  createInvoice,
  getIncomingTransactions,
  getInfo,
  getOutgoingTransactions,
  payInvoiceFromService,
} from "../../../../modules/cashier/cashierService";
import { QRCode } from "react-qr-code";
import {
  Zap,
  ArrowDownLeft,
  ArrowUpRight,
  Copy,
  Send,
  QrCode,
  Bitcoin,
  CreditCard,
  History,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Tabs,
  Tab,
  Divider,
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Chip,
  Progress,
} from "@heroui/react";
import { addToast } from "@heroui/react";
import { usePaymentWebsocket } from "../../../../hooks/usePaymentWebsocket";

function WalletInner() {
  const t = useTranslations("wallet");
  const [info, setInfo] = useState(null);
  const [invoiceAmount, setInvoiceAmount] = useState("");
  const [invoiceDesc, setInvoiceDesc] = useState("");
  const [createdInvoice, setCreatedInvoice] = useState(null);
  const [payInvoice, setPayInvoice] = useState("");
  const [paymentResult, setPaymentResult] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("receive");
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

  const formatSats = (amount) => {
    return new Intl.NumberFormat().format(amount);
  };

  const handleCloseInvoiceModal = () => {
    setShowInvoiceModal(false);
    setInvoiceAwaitingPayment(false);
    setInvoiceCompletedAt(null);
  };

  const getTotalBalance = () => {
    if (!info?.channels) return 0;
    return info.channels.reduce((total, ch) => total + ch.balanceSat, 0);
  };

  const getTransactionIcon = (type) => {
    return type === "outgoing_payment" ? (
      <ArrowUpRight className="w-4 h-4 text-red-600" />
    ) : (
      <ArrowDownLeft className="w-4 h-4 text-green-600" />
    );
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
        <Card className="mb-6 bg-red-50 border-red-200">
          <CardBody>
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-600 font-semibold">{error}</p>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Info Card */}
      <Card className="rounded-lg mb-6 p-6">
        <CardHeader>
          <h3 className="text-lg font-bold text-deep flex items-center">
            {t("nodeInfo.title")}
          </h3>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Bitcoin className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  {t("nodeInfo.totalBalance")}
                </span>
              </div>
              <p className="text-2xl font-bold text-blue-900">
                {formatSats(getTotalBalance())} sats
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  {t("nodeInfo.network")}
                </span>
              </div>
              <p className="text-lg font-bold text-green-900">{info.chain}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-800">
                  {t("nodeInfo.channels")}
                </span>
              </div>
              <p className="text-lg font-bold text-purple-900">
                {info.channels.length}
              </p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <CreditCard className="w-5 h-5 text-orange-600" />
                <span className="text-sm font-medium text-orange-800">
                  {t("nodeInfo.block")}
                </span>
              </div>
              <p className="text-lg font-bold text-orange-900">
                {info.blockHeight}
              </p>
            </div>
          </div>

          {/* Channels */}
          <div className="space-y-3">
            <h4 className="font-semibold text-deep">{t("nodeInfo.subtitle")}</h4>
            {info.channels.map((channel, index) => (
              <Card key={channel.channelId} className="border">
                <CardBody className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h5 className="font-semibold text-deep">
                        {t("nodeInfo.channel")}{index + 1}
                      </h5>
                      <div className="flex items-center space-x-1 mt-1">
                        <span
                          className={`w-2 h-2 rounded-full ${channel.state === "Normal" ? "bg-green-500" : "bg-red-500"}`}
                        ></span>
                        <span className="text-sm text-forest">
                          {channel.state}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-deep">
                        {formatSats(channel.balanceSat)} {t("nodeInfo.sats")}
                      </p>
                      <p className="text-sm text-forest">{t("nodeInfo.balanceSat")}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-forest">{t("nodeInfo.capacitySat")}</span>
                      <span className="font-medium">
                        {formatSats(channel.capacitySat)} {t("nodeInfo.sats")}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-forest">{t("nodeInfo.inboundLiquidity")}</span>
                      <span className="font-medium">
                        {formatSats(channel.inboundLiquiditySat)} {t("nodeInfo.sats")}
                      </span>
                    </div>
                    <Progress
                      aria-label="Balance Channel"
                      value={(channel.balanceSat / channel.capacitySat) * 100}
                      className="max-w-full"
                      color="primary"
                      size="sm"
                    />
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Tabs */}
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
              title={
                <div className="flex items-center space-x-2">
                  <ArrowDownLeft className="w-4 h-4" />
                  <span>{t("payments.receive.tabTitle")}</span>
                </div>
              }
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
              title={
                <div className="flex items-center space-x-2">
                  <ArrowUpRight className="w-4 h-4" />
                  <span>{t("payments.send.tabTitle")}</span>
                </div>
              }
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
                              onPress={() =>
                                copyToClipboard(paymentResult.paymentHash)
                              }
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
              title={
                <div className="flex items-center space-x-2">
                  <History className="w-4 h-4" />
                  <span>{t("payments.history.tabTitle")}</span>
                </div>
              }
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
                          onPress={() =>
                            copyToClipboard(createdInvoice.serialized)
                          }
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
                          onPress={() =>
                            copyToClipboard(createdInvoice.paymentHash)
                          }
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
