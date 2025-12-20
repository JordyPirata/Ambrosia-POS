import { render, screen, fireEvent } from "@testing-library/react";

import { DeleteUsersModal } from "../DeleteUsersModal";

const translations = {
  modal: {
    titleDelete: "Delete User",
    subtitleDelete: "Are you sure you want to delete",
    warningDelete: "This action cannot be undone.",
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

const user = {
  id: 3,
  name: "Test User",
};

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

const renderModal = (props = {}) => render(
  <DeleteUsersModal
    user={user}
    deleteUsersShowModal
    setDeleteUsersShowModal={jest.fn()}
    onConfirm={jest.fn()}
    {...props}
  />,
);

describe("DeleteUsersModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows warning with user name", () => {
    renderModal();

    expect(screen.getByText("Delete User")).toBeInTheDocument();
    expect(screen.getByText(/Test User/)).toBeInTheDocument();
    expect(screen.getByText("This action cannot be undone.")).toBeInTheDocument();
  });

  it("confirms and closes modal", () => {
    const onConfirm = jest.fn();
    const setDeleteUsersShowModal = jest.fn();

    renderModal({ onConfirm, setDeleteUsersShowModal });

    fireEvent.click(screen.getByText("Delete"));
    expect(onConfirm).toHaveBeenCalled();

    fireEvent.click(screen.getByText("Cancel"));
    expect(setDeleteUsersShowModal).toHaveBeenCalledWith(false);
  });
});
