"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import { useTranslations } from "next-intl";
import { StoreLayout } from "../StoreLayout";
import { ProductsTable } from "./ProductsTable";
import { AddProductsModal } from "./AddProductsModal";

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
  const [addProductsShowModal, setAddProductsShowModal] = useState(false);
  const [data, setData] = useState({
    productName: "",
    productDescription: "",
    productCategory: "",
    productSKU: "",
    productPrice: "",
    productStock: "",
    productImage: ""
  });

  const handleDataChange = (newData) => {
    setData((prev) => ({ ...prev, ...newData }))
  };

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
          onPress={() => setAddProductsShowModal(true)}
        >
          {t("addProduct")}
        </Button>
      </header>
      <div className="bg-white rounded-lg shadow-lg p-8">
        <ProductsTable products={PRODUCTS} />
      </div>

      {addProductsShowModal && (
        <AddProductsModal
          addProductsShowModal={addProductsShowModal}
          setAddProductsShowModal={setAddProductsShowModal}
          data={data}
          setData={setData}
          onChange={handleDataChange}
        />
      )}
    </StoreLayout>
  );
}
