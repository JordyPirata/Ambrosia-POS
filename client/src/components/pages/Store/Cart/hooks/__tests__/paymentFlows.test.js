import { createOrderAndTicket, processBasePayment } from "../paymentFlows";

describe("paymentFlows", () => {
  const t = (key) => key;

  it("creates order and ticket", async () => {
    const buildOrderPayload = jest.fn(() => ({ payload: "order" }));
    const buildTicketPayload = jest.fn(() => ({ payload: "ticket" }));
    const createOrder = jest.fn(() => Promise.resolve({ id: "order-1" }));
    const createTicket = jest.fn(() => Promise.resolve({ id: "ticket-1" }));

    const result = await createOrderAndTicket({
      totalAmount: 10,
      user: { user_id: "u1" },
      buildOrderPayload,
      buildTicketPayload,
      createOrder,
      createTicket,
      t,
    });

    expect(buildOrderPayload).toHaveBeenCalled();
    expect(createOrder).toHaveBeenCalledWith({ payload: "order" });
    expect(buildTicketPayload).toHaveBeenCalledWith({ user_id: "u1" }, "order-1", 10);
    expect(result).toEqual({
      orderId: "order-1",
      ticketId: "ticket-1",
      orderPayload: { payload: "order" },
    });
  });

  it("throws when order or ticket creation fails", async () => {
    await expect(
      createOrderAndTicket({
        totalAmount: 10,
        user: { user_id: "u1" },
        buildOrderPayload: jest.fn(() => ({})),
        buildTicketPayload: jest.fn(() => ({})),
        createOrder: jest.fn(() => Promise.resolve({})),
        createTicket: jest.fn(),
        t,
      }),
    ).rejects.toThrow("errors.createOrder");

    await expect(
      createOrderAndTicket({
        totalAmount: 10,
        user: { user_id: "u1" },
        buildOrderPayload: jest.fn(() => ({})),
        buildTicketPayload: jest.fn(() => ({})),
        createOrder: jest.fn(() => Promise.resolve({ id: "order-1" })),
        createTicket: jest.fn(() => Promise.resolve({})),
        t,
      }),
    ).rejects.toThrow("errors.createTicket");
  });

  it("processes base payment and links payment to ticket", async () => {
    const createOrder = jest.fn(() => Promise.resolve({ id: "order-1" }));
    const createTicket = jest.fn(() => Promise.resolve({ id: "ticket-1" }));
    const createPayment = jest.fn(() => Promise.resolve({ id: "pay-1" }));
    const linkPaymentToTicket = jest.fn(() => Promise.resolve());

    const result = await processBasePayment({
      items: [{ id: 1 }],
      amounts: {
        subtotal: 10,
        discount: 0,
        discountAmount: 0,
        total: 10,
        amountFiat: 0.1,
      },
      selectedPaymentMethod: "cash",
      currencyId: "cur-1",
      user: { user_id: "u1" },
      buildOrderPayload: jest.fn(() => ({ payload: "order" })),
      buildTicketPayload: jest.fn(() => ({ payload: "ticket" })),
      createOrder,
      createTicket,
      createPayment,
      linkPaymentToTicket,
      t,
    });

    expect(createPayment).toHaveBeenCalledWith({
      method_id: "cash",
      currency_id: "cur-1",
      transaction_id: "",
      amount: 0.1,
    });
    expect(linkPaymentToTicket).toHaveBeenCalledWith("pay-1", "ticket-1");
    expect(result.paymentResult).toEqual(
      expect.objectContaining({
        items: [{ id: 1 }],
        total: 10,
        amount: 0.1,
        paymentMethod: "cash",
        paymentId: "pay-1",
      }),
    );
  });

  it("throws when payment creation fails", async () => {
    await expect(
      processBasePayment({
        items: [],
        amounts: {
          subtotal: 10,
          discount: 0,
          discountAmount: 0,
          total: 10,
          amountFiat: 0.1,
        },
        selectedPaymentMethod: "cash",
        currencyId: "cur-1",
        user: { user_id: "u1" },
        buildOrderPayload: jest.fn(() => ({ payload: "order" })),
        buildTicketPayload: jest.fn(() => ({ payload: "ticket" })),
        createOrder: jest.fn(() => Promise.resolve({ id: "order-1" })),
        createTicket: jest.fn(() => Promise.resolve({ id: "ticket-1" })),
        createPayment: jest.fn(() => Promise.resolve({})),
        linkPaymentToTicket: jest.fn(),
        t,
      }),
    ).rejects.toThrow("errors.createPayment");
  });
});
