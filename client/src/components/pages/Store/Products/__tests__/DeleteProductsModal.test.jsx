import { render, screen, fireEvent } from "@testing-library/react";

import { I18nProvider } from "@/i18n/I18nProvider";

import { DeleteProductsModal } from "../DeleteProductsModal";

const product = { id: 1, name: "Jade Wallet" };

const renderModal = (props = {}) => render(
  <I18nProvider>
    <DeleteProductsModal
      product={product}
      deleteProductsShowModal
      setDeleteProductsShowModal={jest.fn()}
      onConfirm={jest.fn()}
      {...props}
    />
  </I18nProvider>,
);

describe("DeleteProductsModal", () => {
  it("shows warning with product name", () => {
    renderModal();

    expect(screen.getByText("modal.titleDelete")).toBeInTheDocument();
    expect(screen.getByText(/Jade Wallet/)).toBeInTheDocument();
    expect(screen.getByText("modal.warningDelete")).toBeInTheDocument();
  });

  it("confirms and closes modal", () => {
    const onConfirm = jest.fn();
    const setDeleteProductsShowModal = jest.fn();

    renderModal({ onConfirm, setDeleteProductsShowModal });

    fireEvent.click(screen.getByText("modal.deleteButton"));
    expect(onConfirm).toHaveBeenCalled();

    fireEvent.click(screen.getByText("modal.cancelButton"));
    expect(setDeleteProductsShowModal).toHaveBeenCalledWith(false);
  });

  it("cancel does not trigger confirm", () => {
    const onConfirm = jest.fn();
    const setDeleteProductsShowModal = jest.fn();
    renderModal({ onConfirm, setDeleteProductsShowModal });

    fireEvent.click(screen.getByText("modal.cancelButton"));
    expect(onConfirm).not.toHaveBeenCalled();
    expect(setDeleteProductsShowModal).toHaveBeenCalledWith(false);
  });

  it("renders safely without product data", () => {
    renderModal({ product: null });
    expect(screen.getByText("modal.titleDelete")).toBeInTheDocument();
    expect(screen.getByText("modal.warningDelete")).toBeInTheDocument();
  });
});
