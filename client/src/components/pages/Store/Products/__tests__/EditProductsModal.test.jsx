import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import { I18nProvider } from "@/i18n/I18nProvider";

import { EditProductsModal } from "../EditProductsModal";

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
  <I18nProvider>
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
    />
  </I18nProvider>,
);

describe("EditProductsModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders product data and translations", () => {
    renderModal();

    expect(screen.getByText("modal.titleEdit")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Jade Wallet")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Hardware wallet")).toBeInTheDocument();
  });

  it("closes and resets data on cancel", () => {
    const setData = jest.fn();
    const setEditProductsShowModal = jest.fn();

    renderModal({ setData, setEditProductsShowModal });

    fireEvent.click(screen.getByText("modal.cancelButton"));

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

    fireEvent.click(screen.getByText("modal.editButton"));

    await waitFor(() => expect(updateProduct).toHaveBeenCalledWith(baseData));
    expect(setEditProductsShowModal).toHaveBeenCalledWith(false);
    expect(onProductUpdated).toHaveBeenCalled();
  });
});
