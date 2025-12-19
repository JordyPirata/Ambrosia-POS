import { buildPaymentPayload } from "./paymentBuilders";

export async function createOrderAndTicket({
  totalAmount,
  user,
  buildOrderPayload,
  buildTicketPayload,
  createOrder,
  createTicket,
  t,
}) {
  const orderPayload = buildOrderPayload(user, totalAmount);
  const orderResponse = await createOrder(orderPayload);
  const orderId = orderResponse?.id;
  if (!orderId) {
    throw new Error(t("errors.createOrder"));
  }

  const ticketPayload = buildTicketPayload(user, orderId, totalAmount);
  const ticketResponse = await createTicket(ticketPayload);
  if (!ticketResponse?.id) {
    throw new Error(t("errors.createTicket"));
  }

  return { orderId, ticketId: ticketResponse.id, orderPayload };
}

export async function processBasePayment({
  items,
  amounts,
  selectedPaymentMethod,
  currencyId,
  user,
  buildOrderPayload,
  buildTicketPayload,
  createOrder,
  createTicket,
  createPayment,
  linkPaymentToTicket,
  t,
}) {
  const { orderId, ticketId, orderPayload } = await createOrderAndTicket({
    totalAmount: amounts.amountFiat,
    user,
    buildOrderPayload,
    buildTicketPayload,
    createOrder,
    createTicket,
    t,
  });

  const paymentPayload = buildPaymentPayload({
    methodId: selectedPaymentMethod,
    currencyId,
    amount: amounts.amountFiat,
  });

  const paymentResponse = await createPayment(paymentPayload);
  if (!paymentResponse?.id) {
    throw new Error(t("errors.createPayment"));
  }

  await linkPaymentToTicket(paymentResponse.id, ticketId);

  return {
    paymentResult: {
      items,
      subtotal: amounts.subtotal,
      discount: amounts.discount,
      discountAmount: amounts.discountAmount,
      total: amounts.total,
      amount: amounts.amountFiat,
      paymentMethod: selectedPaymentMethod,
      paymentId: paymentResponse.id || null,
      orderId,
      ticketId: ticketId || null,
    },
    orderPayload,
    orderId,
  };
}
