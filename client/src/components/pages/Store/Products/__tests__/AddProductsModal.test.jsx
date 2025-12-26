import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import { I18nProvider } from "@/i18n/I18nProvider";

import { AddProductsModal } from "../AddProductsModal";

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
  <I18nProvider>
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
    />
  </I18nProvider>,
);

describe("AddProductsModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders form fields and labels", () => {
    renderModal();

    expect(screen.getByText("modal.titleAdd")).toBeInTheDocument();
    expect(screen.getByLabelText("modal.productNameLabel")).toBeInTheDocument();
    expect(screen.getByLabelText("modal.productDescriptionLabel")).toBeInTheDocument();
    expect(screen.getByText("modal.productImageUpload")).toBeInTheDocument();
  });

  it("creates category when clicking add category", async () => {
    const createCategory = jest.fn(() => Promise.resolve("cat-2"));
    const onChange = jest.fn();
    renderModal({ createCategory, onChange });

    fireEvent.change(screen.getByLabelText("modal.createCategoryLabel"), { target: { value: "New Cat" } });
    fireEvent.click(screen.getByText("modal.createCategoryButton"));

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

    fireEvent.click(screen.getByText("modal.submitButton"));

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
