import { render, screen, fireEvent, act } from "@testing-library/react";
import { I18nProvider } from "../../../../../i18n/I18nProvider";
import * as useModulesHook from "../../../../../hooks/useModules";
import * as configurationsProvider from "../../../../../providers/configurations/configurationsProvider";
import { Cart } from "../Cart";

function renderCart() {
  return render(
    <I18nProvider>
      <Cart />
    </I18nProvider>
  );
}

const originalWarn = console.warn;

const defaultNavigation = [
  {
    path: "/store/cart",
    label: "cart",
    icon: "shopping-cart",
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

describe("Cart page", () => {
  it("renders the header, search input, cards and summary", async () => {
    await act(async () => {
      renderCart();
    });
    expect(screen.getByText("title")).toBeInTheDocument();
    expect(screen.getByText("search.label")).toBeInTheDocument();
    expect(screen.getAllByText("card.add")).toHaveLength(3);
    expect(screen.getByText("summary.title")).toBeInTheDocument();
  });

  it("product search", async () => {
    await act(async () => {
      renderCart();
    });
    const input = screen.getByLabelText("search.label");
    await act(async () => {
      fireEvent.change(input, { target: { value: "jade" } });
    });
    expect(screen.getAllByText("card.add")).toHaveLength(2);
  });

  it("select a product category", async () => {
    await act(async () => {
      renderCart();
    });
    const btn = screen.getByText("search.filterAll");
    await act(async () => {
      fireEvent.click(btn);
    });
    expect(screen.getAllByText("card.add")).toHaveLength(3);
  });

  it("Add a product to summary", async () => {
    await act(async () => {
      renderCart();
    });
    const btn = screen.getAllByText("card.add");
    await act(async () => {
      fireEvent.click(btn[2]);
    });
    expect(screen.getAllByText("Jade Plus")).toHaveLength(2)
  });

});
