"use client";
import { useTranslations } from "next-intl";
import { StoreLayout } from "../StoreLayout";
import { SearchProducts } from "./SearchProducts";
import { ProductCard } from "./ProductCard";

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

        {/* Right: resumen */}
        <aside className="lg:col-span-1">
          <div className="rounded-lg bg-[#f5ffe9] border border-green-200 shadow-sm p-4 flex flex-col h-full">
            <h2 className="text-lg font-semibold text-green-900 mb-4">
              Resumen
            </h2>

            <div className="space-y-3 mb-4">
              {CART_ITEMS.map((item) => (
                <div
                  key={item.id}
                  className="rounded-md bg-[#d8f2c5] px-3 py-3 flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-green-900">
                        {item.name}
                      </div>
                      <div className="text-xs text-gray-700">
                        {formatCurrency(item.price)} c/u
                      </div>
                    </div>
                    <button className="text-xs text-gray-500 hover:text-red-600">
                      🗑
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center rounded-full bg-white px-2 py-1 text-xs text-gray-700 border border-green-200">
                      <button className="px-1 text-sm font-bold">-</button>
                      <span className="px-2">{item.qty}</span>
                      <button className="px-1 text-sm font-bold">+</button>
                    </div>
                    <div className="text-sm font-semibold text-green-900">
                      {formatCurrency(item.total)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mt-auto space-y-2 text-sm text-gray-800">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Descuento</span>
                <span>{formatCurrency(discount)}</span>
              </div>
              <div className="border-t border-green-200 pt-2 flex justify-between items-center font-semibold text-green-900">
                <span>Total:</span>
                <span className="text-lg">{formatCurrency(total)}</span>
              </div>

              {/* Payment method */}
              <div className="pt-3">
                <label className="block text-xs text-gray-600 mb-1">
                  Metodo de pago
                </label>
                <select className="w-full rounded border border-green-200 bg-white px-2 py-1 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-green-400">
                  <option>BTC Lightning</option>
                  <option>Tarjeta</option>
                  <option>Efectivo</option>
                </select>
              </div>

              <button className="mt-4 w-full rounded bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700">
                Procesar Pago
              </button>
            </div>
          </div>
        </aside>
      </div>
    </StoreLayout>
  );
}
