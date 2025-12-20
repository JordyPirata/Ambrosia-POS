import { render, screen, fireEvent } from "@testing-library/react";

import { ProductsTable } from "../ProductsTable";

const translations = {
  image: "Image",
  name: "Name",
  description: "Description",
  category: "Category",
  sku: "SKU",
  price: "Price",
  stock: "Stock",
  actions: "Actions",
};

jest.mock("next-intl", () => ({
  useTranslations: () => (key) => translations[key] ?? key,
}));

jest.mock("@/components/hooks/useCurrency", () => ({
  useCurrency: () => ({
    formatAmount: (cents) => `$${(cents / 100).toFixed(2)}`,
  }),
}));

jest.mock("../../../../utils/storedAssetUrl", () => ({
  storedAssetUrl: (url) => url,
}));

const categories = [
  { id: "cat-1", name: "Category 1" },
];

const products = [
  {
    sku: "jade-wallet",
    name: "Jade Wallet",
    description: "Hardware wallet",
    category_id: "cat-1",
    price_cents: 1600,
    quantity: 10,
    image_url: "/images/jade.png",
  },
  {
    sku: "jade-plus",
    name: "Jade Plus",
    description: "Hardware wallet plus",
    category_id: "cat-1",
    price_cents: 4000,
    quantity: 5,
    image_url: "/images/jade-plus.png",
  },
];

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

const renderTable = (props = {}) => render(
  <ProductsTable
    products={products}
    categories={categories}
    onEditProduct={jest.fn()}
    onDeleteProduct={jest.fn()}
    {...props}
  />,
);

describe("ProductsTable", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders rows with product data and formatted price", () => {
    renderTable();

    expect(screen.getByText("Jade Wallet")).toBeInTheDocument();
    expect(screen.getAllByText("Category 1").length).toBeGreaterThan(0);
    expect(screen.getByText("$16.00")).toBeInTheDocument();
  });

  it("calls edit and delete callbacks", () => {
    const onEditProduct = jest.fn();
    const onDeleteProduct = jest.fn();

    renderTable({ onEditProduct, onDeleteProduct });

    fireEvent.click(screen.getAllByRole("button", { name: "Edit Product" })[0]);
    expect(onEditProduct).toHaveBeenCalledWith(products[0]);

    fireEvent.click(screen.getAllByRole("button", { name: "Delete Product" })[1]);
    expect(onDeleteProduct).toHaveBeenCalledWith(products[1]);
  });
});
