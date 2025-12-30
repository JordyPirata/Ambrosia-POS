import { render, screen, waitFor } from "@testing-library/react";

import { usePaymentMethods } from "../usePaymentMethod";
import { apiClient } from "@/services/apiClient";

jest.mock("@/services/apiClient", () => ({
  apiClient: jest.fn(),
}));

function TestComponent() {
  const { paymentMethods, loading, error } = usePaymentMethods();
  return (
    <div>
      <span data-testid="loading">{loading ? "yes" : "no"}</span>
      <span data-testid="count">{paymentMethods.length}</span>
      <span data-testid="error">{error ? "yes" : "no"}</span>
    </div>
  );
}

describe("usePaymentMethods", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("loads payment methods when apiClient returns array", async () => {
    apiClient.mockResolvedValue([{ id: 1 }, { id: 2 }]);
    render(<TestComponent />);

    await waitFor(() => expect(screen.getByTestId("loading")).toHaveTextContent("no"));
    expect(screen.getByTestId("count")).toHaveTextContent("2");
    expect(screen.getByTestId("error")).toHaveTextContent("no");
  });

  it("sets empty list when apiClient returns non-array", async () => {
    apiClient.mockResolvedValue({ data: [] });
    render(<TestComponent />);

    await waitFor(() => expect(screen.getByTestId("loading")).toHaveTextContent("no"));
    expect(screen.getByTestId("count")).toHaveTextContent("0");
  });

  it("sets error when apiClient rejects", async () => {
    apiClient.mockRejectedValue(new Error("fail"));
    render(<TestComponent />);

    await waitFor(() => expect(screen.getByTestId("loading")).toHaveTextContent("no"));
    expect(screen.getByTestId("error")).toHaveTextContent("yes");
  });
});
