import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import { AddUsersModal } from "../AddUsersModal";

jest.mock("next-intl", () => ({
  useTranslations: () => (key) => key,
}));

jest.mock("framer-motion", () => {
  const React = require("react");
  const Mock = React.forwardRef(({ children, ...props }, ref) => (
    <div ref={ref} {...props}>{children}</div>
  ));

  Mock.displayName = "MotionDiv";

  return {
    __esModule: true,
    AnimatePresence: ({ children }) => children,
    LazyMotion: ({ children }) => children,
    domAnimation: {},
    motion: new Proxy({}, { get: () => Mock }),
    m: new Proxy({}, { get: () => Mock }),
  };
});

const roles = [
  { id: "seller", role: "Seller" },
  { id: "admin", role: "Admin" },
];

const baseData = {
  userName: "John Doe",
  userPin: "1234",
  userPhone: "1234567890",
  userEmail: "john@test.com",
  userRole: "seller",
};

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

const renderModal = (props = {}) => render(
  <AddUsersModal
    data={baseData}
    setData={jest.fn()}
    roles={roles}
    addUser={jest.fn()}
    onChange={jest.fn()}
    addUsersShowModal
    setAddUsersShowModal={jest.fn()}
    {...props}
  />,
);

describe("AddUsersModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders modal and basic fields", () => {
    renderModal();

    expect(screen.getByText("modal.titleAdd")).toBeInTheDocument();
    expect(screen.getByLabelText("modal.userNameLabel")).toBeInTheDocument();
    expect(screen.getByLabelText("modal.userEmailLabel")).toBeInTheDocument();
    expect(screen.getByLabelText("modal.userPhoneLabel")).toBeInTheDocument();
    expect(screen.getByLabelText("modal.userPinLabel")).toBeInTheDocument();
  });

  it("normalizes phone and pin to digits on change", () => {
    const onChange = jest.fn();
    renderModal({ onChange });

    fireEvent.change(screen.getByLabelText("modal.userPhoneLabel"), { target: { value: "123-45a" } });
    expect(onChange).toHaveBeenLastCalledWith({ ...baseData, userPhone: "12345a".replace(/\D/g, "") });

    fireEvent.change(screen.getByLabelText("modal.userPinLabel"), { target: { value: "9x8y" } });
    expect(onChange).toHaveBeenLastCalledWith({ ...baseData, userPin: "98" });
  });

  it("submits form, calls addUser and resets data", async () => {
    const addUser = jest.fn(() => Promise.resolve());
    const setData = jest.fn();
    const setAddUsersShowModal = jest.fn();

    renderModal({
      addUser,
      setData,
      setAddUsersShowModal,
    });

    fireEvent.click(screen.getByText("modal.submitButton"));

    await waitFor(() => expect(addUser).toHaveBeenCalledWith(baseData));
    expect(setData).toHaveBeenCalledWith({
      userName: "",
      userPin: "",
      userPhone: "",
      userEmail: "",
      userRole: "Vendedor",
    });
    expect(setAddUsersShowModal).toHaveBeenCalledWith(false);
  });
});
