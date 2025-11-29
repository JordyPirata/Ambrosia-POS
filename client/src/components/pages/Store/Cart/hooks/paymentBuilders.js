export function ensureCartReady({
  t,
  items,
  selectedPaymentMethod,
  userId,
  currencyId,
}) {
  if (!selectedPaymentMethod) {
    throw new Error(t("errors.selectMethod"));
  }

  if (!items.length) {
    throw new Error(t("errors.emptyCart"));
  }

  if (!userId) {
    throw new Error(t("errors.noUser"));
  }

  if (!currencyId) {
    throw new Error(t("errors.noCurrency"));
  }
}

export function buildOrderPayload(user, totalAmount) {
  return {
    user_id: user?.user_id,
    table_id: null,
    waiter: user?.name || "Vendedor",
    status: "paid",
    total: totalAmount,
    created_at: new Date().toISOString(),
  };
}

export function buildTicketPayload(user, orderId, totalAmount) {
  return {
    order_id: orderId,
    user_id: user?.user_id,
    ticket_date: Date.now().toString(),
    status: 1,
    total_amount: totalAmount,
    notes: "",
  };
}

export function buildPaymentPayload({
  methodId,
  currencyId,
  amount,
  transactionId = "",
}) {
  return {
    method_id: methodId,
    currency_id: currencyId,
    transaction_id: transactionId,
    amount,
  };
}

export function normalizeAmounts({
  subtotal,
  discount,
  discountAmount,
  total,
  formatAmount,
}) {
  return {
    subtotal,
    discount,
    discountAmount,
    total,
    amountFiat: total / 100,
    displayTotal: formatAmount(total),
  };
}
