import { render, screen } from "@testing-library/react";

import { StatusChip } from "../StatusChip";

jest.mock("@heroui/react", () => {
  const actual = jest.requireActual("@heroui/react");
  const Chip = ({ children }) => <span>{children}</span>;
  return { ...actual, Chip };
});

describe("StatusChip", () => {
  it("renders translated labels for known statuses", () => {
    render(<StatusChip status="paid" />);
    expect(screen.getByText("status.paid")).toBeInTheDocument();
  });

  it("falls back to raw status for unknown values", () => {
    render(<StatusChip status="refunded" />);
    expect(screen.getByText("refunded")).toBeInTheDocument();
  });
});
