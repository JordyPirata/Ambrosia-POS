"use client";
import { render, screen, fireEvent } from "@testing-library/react";
import { act } from "react";
import { CashPaymentModal } from "../CashPaymentModal";

jest.mock("next-intl", () => ({
  useTranslations: () => (key) => key,
}));

jest.mock("@/components/hooks/useCurrency", () => ({
  useCurrency: () => ({
    formatAmount: (cents) =>
      typeof cents === "number" ? `$${(cents / 100).toFixed(2)}` : String(cents),
  }),
}));

describe("CashPaymentModal", () => {
  const baseProps = {
    isOpen: true,
    amountDue: 10,
    displayTotal: "$10.00",
    onClose: jest.fn(),
    onComplete: jest.fn(),
  };

  it("renders title and total", () => {
    act(() => {
      render(<CashPaymentModal {...baseProps} />);
    });
    expect(screen.getByText("title")).toBeInTheDocument();
    expect(screen.getByText("$10.00")).toBeInTheDocument();
  });

  it("shows error when cash is insufficient", () => {
    act(() => {
      render(<CashPaymentModal {...baseProps} />);
    });
    const input = screen.getByLabelText("receivedLabel");
    fireEvent.change(input, { target: { value: "5" } });
    fireEvent.click(screen.getByText("confirm"));
    expect(
      screen.getByText("errors.insufficient"),
    ).toBeInTheDocument();
  });

  it("calls onComplete with cashReceived and change when sufficient", () => {
    const onComplete = jest.fn();
    act(() => {
      render(<CashPaymentModal {...baseProps} onComplete={onComplete} />);
    });
    const input = screen.getByLabelText("receivedLabel");
    fireEvent.change(input, { target: { value: "15" } });
    fireEvent.click(screen.getByText("confirm"));
    expect(onComplete).toHaveBeenCalledWith({
      cashReceived: 15,
      change: 5,
    });
  });
});
