import { render, screen, fireEvent } from "@testing-library/react";

import { EditUsersModal } from "../EditUsersModal";

const translations = {
  title: "Users",
  subtitle: "Manage your store staff",
  addUser: "Add User",
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
  userId: 7,
  userName: "Jane Doe",
  userPin: "4321",
  userPhone: "0987654321",
  userEmail: "jane@test.com",
  userRole: "admin",
};

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

const renderModal = (props = {}) => render(
  <EditUsersModal
    data={baseData}
    setData={jest.fn()}
    roles={roles}
    onChange={jest.fn()}
    updateUser={jest.fn()}
    editUsersShowModal
    setEditUsersShowModal={jest.fn()}
    {...props}
  />,
);

describe("EditUsersModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders user data and translations", () => {
    renderModal();

    expect(screen.getByText("Edit User")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Jane Doe")).toBeInTheDocument();
    expect(screen.getByDisplayValue("0987654321")).toBeInTheDocument();
    expect(screen.getByLabelText("PIN")).toBeInTheDocument();
  });

  it("closes and resets data on cancel", () => {
    const setData = jest.fn();
    const setEditUsersShowModal = jest.fn();

    renderModal({ setData, setEditUsersShowModal });

    fireEvent.click(screen.getByText("Cancel"));

    expect(setData).toHaveBeenCalledWith({
      userId: "",
      userName: "",
      userPin: "",
      userPhone: "",
      userEmail: "",
      userRole: roles[0].id,
    });
    expect(setEditUsersShowModal).toHaveBeenCalledWith(false);
  });

  it("saves changes and closes on submit", () => {
    const setData = jest.fn();
    const setEditUsersShowModal = jest.fn();
    const updateUser = jest.fn();

    renderModal({ setData, setEditUsersShowModal, updateUser });

    fireEvent.click(screen.getByText("Save"));

    expect(updateUser).toHaveBeenCalledWith(baseData);
    expect(setData).toHaveBeenCalledWith({
      userId: "",
      userName: "",
      userPin: "",
      userPhone: "",
      userEmail: "",
      userRole: "Vendedor",
    });
    expect(setEditUsersShowModal).toHaveBeenCalledWith(false);
  });
});
