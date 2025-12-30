import { render, screen, fireEvent } from "@testing-library/react";
import { act } from "react";

import { BitcoinPaymentModal } from "../BitcoinPaymentModal";

const mockSetInvoiceHash = jest.fn();
let mockPaymentHandlers = [];
let mockInvoiceState = {
  invoice: null,
  satsAmount: null,
  loading: false,
  error: "",
  generateInvoice: jest.fn(),
  reset: jest.fn(),
};

jest.mock("../hooks/useBitcoinInvoice", () => ({
  useBitcoinInvoice: () => mockInvoiceState,
}));

jest.mock("@/hooks/usePaymentWebsocket", () => ({
  usePaymentWebsocket: () => ({
    setInvoiceHash: mockSetInvoiceHash,
    onPayment: (handler) => {
      mockPaymentHandlers.push(handler);
      return () => {};
    },
  }),
}));

describe("BitcoinPaymentModal", () => {
  beforeEach(() => {
    mockInvoiceState = {
      invoice: null,
      satsAmount: null,
      loading: false,
      error: "",
      generateInvoice: jest.fn(),
      reset: jest.fn(),
    };
    mockSetInvoiceHash.mockClear();
    mockPaymentHandlers = [];
  });

  it("shows loading state while generating invoice", () => {
    mockInvoiceState = { ...mockInvoiceState, loading: true };
    render(
      <BitcoinPaymentModal
        isOpen
        amountFiat={10}
        paymentId="pay-1"
        displayTotal="$10.00"
      />,
    );

    expect(screen.getByText("generating")).toBeInTheDocument();
  });

  it("shows error state and retries invoice generation", () => {
    mockInvoiceState = { ...mockInvoiceState, error: "invoice-error" };
    render(
      <BitcoinPaymentModal
        isOpen
        amountFiat={10}
        paymentId="pay-1"
        displayTotal="$10.00"
      />,
    );

    expect(screen.getByText("invoice-error")).toBeInTheDocument();
    fireEvent.click(screen.getByText("retry"));
    expect(mockInvoiceState.generateInvoice).toHaveBeenCalled();
  });

  it("renders invoice data and listens for payment confirmation", async () => {
    const onComplete = jest.fn();
    mockInvoiceState = {
      ...mockInvoiceState,
      invoice: { paymentHash: "hash-1", serialized: "ln-invoice" },
      satsAmount: 500,
    };

    render(
      <BitcoinPaymentModal
        isOpen
        amountFiat={10}
        paymentId="pay-1"
        displayTotal="$10.00"
        onComplete={onComplete}
      />,
    );

    expect(screen.getByText("totalLabel")).toBeInTheDocument();
    expect(screen.getByText("$10.00")).toBeInTheDocument();
    expect(await screen.findByText("waitingPayment")).toBeInTheDocument();

    act(() => {
      mockPaymentHandlers[0]({ paymentHash: "hash-1" });
    });

    expect(onComplete).toHaveBeenCalledWith({
      invoice: mockInvoiceState.invoice,
      satoshis: 500,
      paymentId: "pay-1",
      auto: true,
    });
    expect(await screen.findByText("confirmed")).toBeInTheDocument();
  });

  it("clears invoice state when modal is closed", () => {
    render(
      <BitcoinPaymentModal
        isOpen={false}
        amountFiat={10}
        paymentId="pay-1"
        displayTotal="$10.00"
      />,
    );

    expect(mockSetInvoiceHash).toHaveBeenCalledWith(null);
  });

  it("resets state and closes when cancel is pressed", () => {
    const onClose = jest.fn();
    render(
      <BitcoinPaymentModal
        isOpen
        amountFiat={10}
        paymentId="pay-1"
        displayTotal="$10.00"
        onClose={onClose}
      />,
    );

    fireEvent.click(screen.getByText("cancel"));
    expect(mockInvoiceState.reset).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
    expect(mockSetInvoiceHash).toHaveBeenCalledWith(null);
  });
});
