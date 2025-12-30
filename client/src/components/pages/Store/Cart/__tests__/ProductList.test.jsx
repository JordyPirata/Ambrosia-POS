import { render, screen, fireEvent } from "@testing-library/react";

import { ProductList } from "../ProductList";

jest.mock("@/components/hooks/useCurrency", () => ({
  useCurrency: () => ({
    formatAmount: (value) => `fmt-${value}`,
  }),
}));

const products = [
  {
    id: 1,
    name: "Jade Wallet",
    SKU: "jade-wallet",
    category_id: "cat-1",
    price_cents: 1600,
    quantity: 3,
  },
  {
    id: 2,
    name: "Unknown Category",
    SKU: "unknown",
    category_id: "missing",
    price_cents: 600,
    quantity: 1,
  },
];

const categories = [
  { id: "cat-1", name: "Hardware" },
];

describe("ProductList", () => {
  it("renders product details and category names", () => {
    render(
      <ProductList
        products={products}
        categories={categories}
        onAddProduct={jest.fn()}
      />,
    );

    expect(screen.getByText("Jade Wallet")).toBeInTheDocument();
    expect(screen.getByText("Hardware")).toBeInTheDocument();
    expect(screen.getByText("fmt-1600")).toBeInTheDocument();
    expect(screen.getAllByText("SKU:")).toHaveLength(2);
    expect(screen.getByText("jade-wallet")).toBeInTheDocument();
    expect(screen.getByText("Categoría Desconocida")).toBeInTheDocument();
  });

  it("calls onAddProduct when add button is clicked", () => {
    const onAddProduct = jest.fn();
    render(
      <ProductList
        products={products}
        categories={categories}
        onAddProduct={onAddProduct}
      />,
    );

    const addButtons = screen.getAllByText("card.add");
    fireEvent.click(addButtons[0]);
    expect(onAddProduct).toHaveBeenCalledWith(products[0]);
  });
});
