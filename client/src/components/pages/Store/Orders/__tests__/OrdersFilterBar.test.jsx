import { render, screen, fireEvent } from "@testing-library/react";

import { OrdersFilterBar } from "../OrdersFilterBar";

jest.mock("@heroui/react", () => {
  const React = require("react");
  const actual = jest.requireActual("@heroui/react");
  const Input = ({ placeholder, value, onChange }) => (
    <input placeholder={placeholder} value={value} onChange={onChange} />
  );
  const Select = ({ "aria-label": ariaLabel, selectedKeys, onSelectionChange, children }) => (
    <select
      aria-label={ariaLabel}
      value={selectedKeys?.[0] || ""}
      onChange={(e) => onSelectionChange?.(new Set([e.target.value]))}
    >
      {children}
    </select>
  );
  const SelectItem = ({ value, children }) => (
    <option value={value}>{children}</option>
  );
  const Tabs = ({ selectedKey, onSelectionChange, children }) => (
    <div>
      {React.Children.map(children, (child) => React.cloneElement(child, {
        selectedKey,
        onSelectionChange,
        tabKey: child.key,
      }),
      )}
    </div>
  );
  const Tab = ({ title, tabKey, onSelectionChange }) => (
    <button type="button" onClick={() => onSelectionChange?.(tabKey)}>
      {title}
    </button>
  );

  return { ...actual, Input, Select, SelectItem, Tabs, Tab };
});

describe("OrdersFilterBar", () => {
  it("triggers search, rows per page, and filter callbacks", () => {
    const onSearchChange = jest.fn();
    const onRowsPerPageChange = jest.fn();
    const onFilterChange = jest.fn();

    render(
      <OrdersFilterBar
        filter="paid"
        searchTerm=""
        rowsPerPage={10}
        paidCount={4}
        onSearchChange={onSearchChange}
        onRowsPerPageChange={onRowsPerPageChange}
        onFilterChange={onFilterChange}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText("filter.searchPlaceholder"), {
      target: { value: "order-1" },
    });
    expect(onSearchChange).toHaveBeenCalledWith("order-1");

    fireEvent.change(screen.getByLabelText("Rows per page"), {
      target: { value: "5" },
    });
    expect(onRowsPerPageChange).toHaveBeenCalledWith("5");

    fireEvent.click(screen.getByText("filter.tabPaid"));
    expect(onFilterChange).toHaveBeenCalledWith("paid");
    expect(screen.getByText("4")).toBeInTheDocument();
  });
});
