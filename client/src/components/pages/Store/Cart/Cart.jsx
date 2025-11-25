"use client";
import { useTranslations } from "next-intl";
import { StoreLayout } from "../StoreLayout";
import { SearchProducts } from "./SearchProducts";
import { ProductCard } from "./ProductCard";
import { Summary } from "./Summary";

const PRODUCTS = [
  {
    id: 1,
    name: "Jade Plus",
    category: "Hardware Wallet",
    price: 4000,
    stock: 19,
    sku: "jade-plus-wallet",
  },
  {
    id: 2,
    name: "Jade Wallet",
    category: "Hardware Wallet",
    price: 1600,
    stock: 18,
    sku: "jade-wallet",
  },
  {
    id: 3,
    name: "M5 Stickplus 2",
    category: "Electronica",
    price: 600,
    stock: 9,
    sku: "m5-stickplus-2",
  },
  {
    id: 4,
    name: "Jade Plus",
    category: "Hardware Wallet",
    price: 4000,
    stock: 19,
    sku: "jade-plus-wallet-2",
  },
  {
    id: 5,
    name: "Jade Wallet",
    category: "Hardware Wallet",
    price: 1600,
    stock: 18,
    sku: "jade-wallet-2",
  },
  {
    id: 6,
    name: "M5 Stickplus 2",
    category: "Electronica",
    price: 600,
    stock: 9,
    sku: "m5-stickplus-2-2",
  },
];

const CART_ITEMS = [
  {
    id: 1,
    name: "M5 Stickplus 2",
    price: 600,
    qty: 2,
    total: 1200,
  },
  {
    id: 2,
    name: "Jade Wallet",
    price: 1600,
    qty: 1,
    total: 1600,
  },
];

const formatCurrency = (v) => `$ ${v.toLocaleString("es-MX", { minimumFractionDigits: 2 })}`;

export function Cart() {
  const t = useTranslations("cart");
  const subtotal = CART_ITEMS.reduce((sum, item) => sum + item.total, 0);
  const discount = 0;
  const total = subtotal - discount;

  return (
    <StoreLayout>
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-4xl font-semibold text-green-800">{t("title")}</h1>
          <p className=" text-gray-800 mt-4">
            {t("subtitle")}
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2">
          <SearchProducts />
          <ProductCard products={PRODUCTS} />
        </section>
        <Summary cartItems={CART_ITEMS} />
      </div>
    </StoreLayout>
  );
}
