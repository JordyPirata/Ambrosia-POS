import { render, screen, fireEvent, act } from "@testing-library/react";
import { I18nProvider } from "../../../../../i18n/I18nProvider";
import * as useModulesHook from "../../../../../hooks/useModules";
import * as configurationsProvider from "../../../../../providers/configurations/configurationsProvider";
import { Products} from "../Products";

function renderProducts() {
  return render(
    <I18nProvider>
      <Products />
    </I18nProvider>
  );
}

const originalWarn = console.warn;

const defaultNavigation = [
  {
    path: "/store/products",
    label: "products",
    icon: "products",
    showInNavbar: true,
  },
];
const mockLogout = jest.fn();
const mockConfig = {
  businessName: "Mi Tienda Test",
  businessType: "store",
};

beforeEach(() => {
  console.warn = (...args) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("aria-label")
    ) {
      return;
    }
    originalWarn.call(console, ...args);
  };

  jest.clearAllMocks();

  jest.spyOn(useModulesHook, "useModules").mockReturnValue({
    availableModules: {},
    availableNavigation: defaultNavigation,
    checkRouteAccess: jest.fn(),
    isAuth: true,
    isAdmin: false,
    isLoading: false,
    user: { userName: "testuser" },
    logout: mockLogout,
  });

  jest.spyOn(configurationsProvider, "useConfigurations").mockReturnValue({
    config: mockConfig,
    isLoading: false,
    businessType: "store",
    refreshConfig: jest.fn(),
    setConfig: jest.fn(),
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("Products page", () => {
  it("renders the table and header", async () => {
    await act(async () => {
      renderProducts();
    });
    expect(screen.getByText("title")).toBeInTheDocument();
    expect(screen.getByText("addProduct")).toBeInTheDocument();
    expect(screen.getByText("Jade Wallet")).toBeInTheDocument();
    expect(screen.getByText("Jade Plus")).toBeInTheDocument();
  });

  it("opens AddProductsModal when clicking Add Product", async () => {
    await act(async () => {
      renderProducts();
    });
    const btn = screen.getByText("addProduct");
    await act(async () => {
      fireEvent.click(btn);
    });
    expect(screen.getByText("modal.titleAdd")).toBeInTheDocument();
  });

  it("opens EditProductsModal with correct product data", async () => {
    await act(async () => {
      renderProducts();
    });

    const editButtons = screen.getAllByRole("button", {
      name: "Edit Product",
    });

    await act(async () => {
      fireEvent.click(editButtons[0]);
    });

    expect(screen.getByText("modal.titleEdit")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Jade Wallet")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Hardware Wallet")).toBeInTheDocument();
  });

  it("opens DeleteProductsModal", async () => {
    await act(async () => {
      renderProducts();
    });

    const deleteButtons = screen.getAllByRole("button", {
      name: "Delete Product",
    });

    await act(async () => {
      fireEvent.click(deleteButtons[1]);
    });

    expect(screen.getByText("modal.titleDelete")).toBeInTheDocument();
  });
});
