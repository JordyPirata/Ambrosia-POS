import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import { AddProductsModal } from "../AddProductsModal";

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
    submitButton: "Add",
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
  <AddProductsModal
    data={baseData}
    setData={jest.fn()}
    addProduct={jest.fn()}
    onChange={jest.fn()}
    onProductCreated={jest.fn()}
    categories={categories}
    categoriesLoading={false}
    createCategory={jest.fn()}
    addProductsShowModal
    setAddProductsShowModal={jest.fn()}
    {...props}
  />,
);

describe("AddProductsModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders form fields and labels", () => {
    renderModal();

    expect(screen.getByText("Add Product")).toBeInTheDocument();
    expect(screen.getByLabelText("Product Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Product Description")).toBeInTheDocument();
    expect(screen.getByText("Upload image")).toBeInTheDocument();
  });

  it("creates category when clicking add category", async () => {
    const createCategory = jest.fn(() => Promise.resolve("cat-2"));
    const onChange = jest.fn();
    renderModal({ createCategory, onChange });

    fireEvent.change(screen.getByLabelText("Create a new category"), { target: { value: "New Cat" } });
    fireEvent.click(screen.getByText("Add category"));

    await waitFor(() => expect(createCategory).toHaveBeenCalledWith("New Cat"));
    expect(onChange).toHaveBeenCalledWith({ productCategory: "cat-2" });
  });

  it("submits form, calls addProduct, resets data and closes", async () => {
    const addProduct = jest.fn(() => Promise.resolve());
    const setData = jest.fn();
    const setAddProductsShowModal = jest.fn();
    const onProductCreated = jest.fn();

    renderModal({
      addProduct,
      setData,
      setAddProductsShowModal,
      onProductCreated,
    });

    fireEvent.click(screen.getByText("Add"));

    await waitFor(() => expect(addProduct).toHaveBeenCalledWith(baseData));
    expect(setData).toHaveBeenCalledWith({
      productName: "",
      productDescription: "",
      productCategory: "",
      productSKU: "",
      productPrice: "",
      productStock: "",
      productImage: "",
      storeImage: null,
    });
    expect(setAddProductsShowModal).toHaveBeenCalledWith(false);
    expect(onProductCreated).toHaveBeenCalled();
  });
});
