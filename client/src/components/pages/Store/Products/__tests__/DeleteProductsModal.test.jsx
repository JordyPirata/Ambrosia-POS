import { render, screen, fireEvent } from "@testing-library/react";

import { DeleteProductsModal } from "../DeleteProductsModal";

const translations = {
  modal: {
    titleDelete: "Delete Product",
    subtitleDelete: "Are you sure you want to delete",
    warningDelete: "This action cannot be undone.",
    cancelButton: "Cancel",
    deleteButton: "Delete",
  },
};

jest.mock("next-intl", () => ({
  useTranslations: () => (key) => key.split(".").reduce((acc, k) => acc?.[k], translations) ?? key,
}));

const product = { id: 1, name: "Jade Wallet" };

const renderModal = (props = {}) => render(
  <DeleteProductsModal
    product={product}
    deleteProductsShowModal
    setDeleteProductsShowModal={jest.fn()}
    onConfirm={jest.fn()}
    {...props}
  />,
);

describe("DeleteProductsModal", () => {
  it("shows warning with product name", () => {
    renderModal();

    expect(screen.getByText("Delete Product")).toBeInTheDocument();
    expect(screen.getByText(/Jade Wallet/)).toBeInTheDocument();
    expect(screen.getByText("This action cannot be undone.")).toBeInTheDocument();
  });

  it("confirms and closes modal", () => {
    const onConfirm = jest.fn();
    const setDeleteProductsShowModal = jest.fn();

    renderModal({ onConfirm, setDeleteProductsShowModal });

    fireEvent.click(screen.getByText("Delete"));
    expect(onConfirm).toHaveBeenCalled();

    fireEvent.click(screen.getByText("Cancel"));
    expect(setDeleteProductsShowModal).toHaveBeenCalledWith(false);
  });
});
