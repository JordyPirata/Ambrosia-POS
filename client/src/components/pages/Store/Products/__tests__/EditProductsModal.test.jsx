import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import { EditProductsModal } from "../EditProductsModal";

const translations = {
  modal: {
    titleAdd: "Add Product",
    titleEdit: "Edit Product",
    titleDelete: "Delete Product",
    subtitleDelete: "Are you sure you want to delete",
    warningDelete: "This action cannot be undone.",
    productNameLabel: "Product Name",
    productNamePlaceholder: "Product Name",
    productDescriptionLabel: "Product Description",
    productDescriptionPlaceholder: "Product Description",
    productCategoryLabel: "Product Category",
    categorySelectPlaceholder: "Choose a category",
    createCategoryLabel: "Create a new category",
    createCategoryPlaceholder: "New Category",
    createCategoryButton: "Add category",
    productSKULabel: "SKU",
    productSKUPlaceholder: "SKU",
    productPriceLabel: "Price",
    productPricePlaceholder: "0.00",
    productStockLabel: "Stock",
    productStockPlaceholder: "0",
    productImageUpload: "Upload image",
    productImageUploadMessage: "PNG, JPG or GIF",
    editButton: "Save",
    cancelButton: "Cancel",
  },
};

jest.mock("next-intl", () => ({
  useTranslations: () => (key) => key.split(".").reduce((acc, k) => acc?.[k], translations) ?? key,
}));

jest.mock("@/components/hooks/useCurrency", () => ({
  useCurrency: () => ({
    currency: { acronym: "$" },
  }),
}));

const categories = [
  { id: "cat-1", name: "Category 1" },
];

const baseData = {
  productId: "1",
  productName: "Jade Wallet",
  productDescription: "Hardware wallet",
  productCategory: "cat-1",
  productSKU: "jade-wallet",
  productPrice: 10,
  productStock: 5,
  productImage: "",
  storeImage: null,
};

const renderModal = (props = {}) => render(
  <EditProductsModal
    data={baseData}
    setData={jest.fn()}
    onChange={jest.fn()}
    updateProduct={jest.fn()}
    onProductUpdated={jest.fn()}
    categories={categories}
    categoriesLoading={false}
    createCategory={jest.fn()}
    editProductsShowModal
    setEditProductsShowModal={jest.fn()}
    {...props}
  />,
);

describe("EditProductsModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders product data and translations", () => {
    renderModal();

    expect(screen.getByText("Edit Product")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Jade Wallet")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Hardware wallet")).toBeInTheDocument();
  });

  it("closes and resets data on cancel", () => {
    const setData = jest.fn();
    const setEditProductsShowModal = jest.fn();

    renderModal({ setData, setEditProductsShowModal });

    fireEvent.click(screen.getByText("Cancel"));

    expect(setData).toHaveBeenCalledWith({
      productId: "",
      productName: "",
      productDescription: "",
      productCategory: "",
      productSKU: "",
      productPrice: "",
      productStock: "",
      productImage: "",
      storeImage: null,
    });
    expect(setEditProductsShowModal).toHaveBeenCalledWith(false);
  });

  it("saves changes and closes on submit", async () => {
    const setEditProductsShowModal = jest.fn();
    const updateProduct = jest.fn(() => Promise.resolve());
    const onProductUpdated = jest.fn();

    renderModal({ setEditProductsShowModal, updateProduct, onProductUpdated });

    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => expect(updateProduct).toHaveBeenCalledWith(baseData));
    expect(setEditProductsShowModal).toHaveBeenCalledWith(false);
    expect(onProductUpdated).toHaveBeenCalled();
  });
});
