import { render, waitFor } from "@testing-library/react";
import { act } from "react";

import { useCartPayment } from "../useCartPayment";

let latestState = {};
let mockPaymentMethods;

jest.mock("@/modules/auth/useAuth", () => ({
  useAuth: () => ({ user: { user_id: "u1", name: "Tester" } }),
}));

jest.mock("@/components/hooks/useCurrency", () => ({
  useCurrency: () => ({
    currency: { id: "cur-1", acronym: "MXN" },
    formatAmount: (value) => `fmt-${value}`,
  }),
}));

jest.mock("../usePaymentMethod", () => ({
  usePaymentMethods: () => ({
    paymentMethods: mockPaymentMethods,
  }),
}));

jest.mock("../../../hooks/useOrders", () => ({
  useOrders: () => ({
    createOrder: jest.fn(() => Promise.resolve({ id: "order-1" })),
    updateOrder: jest.fn(() => Promise.resolve()),
  }),
}));

jest.mock("../../../hooks/usePayments", () => ({
  usePayments: () => ({
    createPayment: jest.fn(() => Promise.resolve({ id: "pay-1" })),
    linkPaymentToTicket: jest.fn(() => Promise.resolve()),
    getPaymentCurrencyById: jest.fn(() => Promise.resolve({ acronym: "USD" })),
  }),
}));

jest.mock("../../../hooks/useTickets", () => ({
  useTickets: () => ({
    createTicket: jest.fn(() => Promise.resolve({ id: "ticket-1" })),
  }),
}));

function TestComponent(props) {
  latestState = useCartPayment(props);
  return null;
}

describe("useCartPayment", () => {
  beforeEach(() => {
    latestState = {};
    mockPaymentMethods = [
      { id: "btc", name: "BTC" },
      { id: "cash", name: "Cash" },
    ];
  });

  it("handles BTC payment config and clearing", async () => {
    render(<TestComponent />);

    await act(async () => {
      await latestState.handlePay({
        items: [{ id: 1, subtotal: 100 }],
        subtotal: 100,
        discount: 0,
        discountAmount: 0,
        total: 100,
        selectedPaymentMethod: "btc",
      });
    });

    await waitFor(() => {
      expect(latestState.btcPaymentConfig).toEqual(
        expect.objectContaining({
          amountFiat: 1,
          currencyAcronym: "usd",
          displayTotal: "fmt-100",
          selectedPaymentMethod: "btc",
        }),
      );
    });

    act(() => {
      latestState.clearBtcPaymentConfig();
    });

    expect(latestState.btcPaymentConfig).toBeNull();
  });

  it("handles cash payment config and clearing", async () => {
    render(<TestComponent />);

    await act(async () => {
      await latestState.handlePay({
        items: [{ id: 1, subtotal: 100 }],
        subtotal: 100,
        discount: 0,
        discountAmount: 0,
        total: 100,
        selectedPaymentMethod: "cash",
      });
    });

    await waitFor(() => {
      expect(latestState.cashPaymentConfig).toEqual(
        expect.objectContaining({
          amountDue: 1,
          displayTotal: "fmt-100",
        }),
      );
    });

    act(() => {
      latestState.clearCashPaymentConfig();
    });

    expect(latestState.cashPaymentConfig).toBeNull();
  });

  it("handles missing payment methods without crashing", () => {
    mockPaymentMethods = undefined;
    render(<TestComponent />);

    expect(typeof latestState.handlePay).toBe("function");
  });
});
