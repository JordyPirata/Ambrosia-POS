"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import { useTranslations } from "next-intl";
import { StoreLayout } from "../StoreLayout";
import { ProductsTable } from "./ProductsTable";

const PRODUCTS = [
  {
    id: 1,
    name: "Jade Wallet",
    category: "Hardware Wallet",
    sku: "jade-wallet",
    price: 1600,
    stockLabel: "20 unidades",
    stockColor: "bg-green-100 text-green-800",
  },
  {
    id: 2,
    name: "Jade Plus",
    category: "Hardware Wallet",
    sku: "jade-plus-wallet",
    price: 4000,
    stockLabel: "10 unidades",
    stockColor: "bg-yellow-100 text-yellow-800",
  },
  {
    id: 3,
    name: "M5 Stickplus2",
    category: "Electronica",
    sku: "m5-stickplus-2",
    price: 600,
    stockLabel: "5 unidades",
    stockColor: "bg-red-100 text-red-700",
  },
];

export function Products() {
  const [showModal, setShowModal] = useState(false);
  const t = useTranslations("products");

  return (
    <StoreLayout>
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-4xl font-semibold text-green-900">{t("title")}</h1>
          <p className="text-gray-800 mt-4">
            {t("subtitle")}
          </p>
        </div>
        <Button
          color="primary"
          className="bg-green-800"
          onPress={() => setShowModal(true)}
        >
          {t("addProduct")}
        </Button>
      </header>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <ProductsTable products={PRODUCTS} />
      </div>


      {/* Modal: Agregar Producto */}
      {showModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-2xl rounded-lg bg-[#f5ffe9] shadow-xl border border-green-200 p-6">
            <h2 className="text-xl font-semibold text-green-900 mb-4">
              Agregar Producto
            </h2>

            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                setShowModal(false);
              }}
            >
              {/* Nombre del Producto */}
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Nombre del Producto
                </label>
                <input
                  type="text"
                  placeholder="Nombre de producto"
                  className="w-full rounded border border-green-200 bg-white px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-green-400"
                />
              </div>

              {/* Categoria */}
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Categoria
                </label>
                <select className="w-full rounded border border-green-200 bg-white px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-green-400">
                  <option>Electronica</option>
                  <option>Hardware Wallet</option>
                  <option>Accesorios</option>
                </select>
              </div>

              {/* SKU */}
              <div>
                <label className="block text-xs text-gray-600 mb-1">SKU</label>
                <input
                  type="text"
                  placeholder="SKU Unico"
                  className="w-full rounded border border-green-200 bg-white px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-green-400"
                />
              </div>

              {/* Precio + Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Precio
                  </label>
                  <input
                    type="number"
                    placeholder="$ 0.00"
                    className="w-full rounded border border-green-200 bg-white px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-green-400"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Stock
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full rounded border border-green-200 bg-white px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-green-400"
                  />
                </div>
              </div>

              {/* Foto del producto */}
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Foto del producto
                </label>
                <div className="mt-1 rounded-lg border-2 border-dashed border-green-200 bg-[#f5ffe9] px-4 py-8 text-center text-xs text-gray-600">
                  <div className="mb-2 text-2xl">📷</div>
                  <p>Sube una imagen</p>
                  <p className="mt-1 text-[11px] text-gray-500">
                    PNG, JPG o GIF (max. 5MB)
                  </p>
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-6 flex justify-between">
                <button
                  type="button"
                  className="rounded-full border border-green-400 px-6 py-2 text-sm font-medium text-green-800 bg-transparent hover:bg-green-50"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-green-600 px-6 py-2 text-sm font-medium text-white hover:bg-green-700"
                >
                  Agregar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </StoreLayout>
  );
}
