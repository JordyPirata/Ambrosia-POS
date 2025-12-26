import { render, screen, act } from "@testing-library/react";

import * as useModulesHook from "@hooks/useModules";
import { I18nProvider } from "@i18n/I18nProvider";
import * as configurationsProvider from "@providers/configurations/configurationsProvider";

import { Settings } from "../Settings";

function renderCart() {
  return render(
    <I18nProvider>
      <Settings />
    </I18nProvider>,
  );
}

const originalWarn = console.warn;

const defaultNavigation = [
  {
    path: "/store/settings",
    label: "settings",
    icon: "settings",
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

describe("Settings page", () => {
  it("renders store info, currency, and languages", async () => {
    await act(async () => {
      renderCart();
    });
    expect(screen.getByText("cardInfo.title")).toBeInTheDocument();
    expect(screen.getByText("cardCurrency.title")).toBeInTheDocument();
    expect(screen.getByText("cardLanguage.title")).toBeInTheDocument();
  });
});
