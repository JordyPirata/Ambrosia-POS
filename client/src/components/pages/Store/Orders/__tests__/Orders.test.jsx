import { render, screen } from "@testing-library/react";

import { Orders } from "../Orders";

jest.mock("../../StoreLayout", () => ({
  StoreLayout: ({ children }) => <div>{children}</div>,
}));

jest.mock("../StoreOrders", () => ({
  __esModule: true,
  default: () => <div>store-orders</div>,
}));

describe("Orders page", () => {
  it("renders header and store orders section", () => {
    render(<Orders />);

    expect(screen.getByText("title")).toBeInTheDocument();
    expect(screen.getByText("subtitle")).toBeInTheDocument();
    expect(screen.getByText("store-orders")).toBeInTheDocument();
  });
});
