import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import { AddUsersModal } from "../AddUsersModal";

const translations = {
  title: "Users",
  subtitle: "Manage your store staff",
  addUser: "Add User",
  name: "Name",
  role: "Role",
  email: "Email",
  phone: "Phone",
  actions: "Actions",
  modal: {
    titleAdd: "Add User",
    titleEdit: "Edit User",
    titleDelete: "Delete User",
    subtitleDelete: "Are you sure you want to delete",
    warningDelete: "This action cannot be undone.",
    userNameLabel: "Name",
    userEmailLabel: "Email",
    userPhoneLabel: "Phone",
    userPinLabel: "PIN",
    userRoleLabel: "Role",
    submitButton: "Add",
    editButton: "Save",
    cancelButton: "Cancel",
    deleteButton: "Delete",
  },
};

jest.mock("next-intl", () => ({
  useTranslations: () => (key) => key.split(".").reduce((acc, k) => acc?.[k], translations) ?? key,
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

    expect(screen.getByText("Add User")).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Phone")).toBeInTheDocument();
    expect(screen.getByLabelText("PIN")).toBeInTheDocument();
  });

  it("normalizes phone and pin to digits on change", () => {
    const onChange = jest.fn();
    renderModal({ onChange });

    fireEvent.change(screen.getByLabelText("Phone"), { target: { value: "123-45a" } });
    expect(onChange).toHaveBeenLastCalledWith({ ...baseData, userPhone: "12345a".replace(/\D/g, "") });

    fireEvent.change(screen.getByLabelText("PIN"), { target: { value: "9x8y" } });
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

    fireEvent.click(screen.getByText("Add"));

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
