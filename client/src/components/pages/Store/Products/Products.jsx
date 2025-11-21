"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import { useTranslations } from "next-intl";
import { StoreLayout } from "../StoreLayout";
import { ProductsTable } from "./ProductsTable";
import { AddProductsModal } from "./AddProductsModal";
import { EditProductsModal } from "./EditProductsModal";

const PRODUCTS = [
  {
    id: 1,
    name: "Jade Wallet",
    description: "Blockstream hardware wallet",
    category: "Hardware Wallet",
    sku: "jade-wallet",
    price: 1600,
    stock: 20,
    image: "https://store.blockstream.com/cdn/shop/files/Jade_Bitcoin_Hardware_Wallet_-_Green_-_Front.png",
  },
  {
    id: 2,
    name: "Jade Plus",
    description: "Blockstream hardware wallet",
    category: "Hardware Wallet",
    sku: "jade-plus-wallet",
    price: 4000,
    stock: 10,
    image: "https://store.blockstream.com/cdn/shop/files/Blockstream_Jade_Plus_Bitcoin_Wallet_Angled_Back_Grey.jpg",
  },
  {
    id: 3,
    name: "M5 Stickplus2",
    description: "Electronic device",
    category: "Electronica",
    sku: "m5-stickplus-2",
    price: 600,
    stock: 5,
    image: "https://m.media-amazon.com/images/I/51-SwqSQHNL._AC_SL1500_.jpg",
  },
];

export function Products() {
  const [addProductsShowModal, setAddProductsShowModal] = useState(false);
  const [editProductsShowModal, setEditProductsShowModal] = useState(false);
  const [data, setData] = useState({
    productName: "",
    productDescription: "",
    productCategory: "",
    productSKU: "",
    productPrice: "",
    productStock: "",
    productImage: ""
  });
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleDataChange = (newData) => {
    setData((prev) => ({ ...prev, ...newData }))
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);

    setData({
      productName: product.name,
      productDescription: product.description,
      productCategory: product.category,
      productSKU: product.sku,
      productPrice: product.price,
      productStock: product.stock,
      productImage: product.image
    });

    setEditProductsShowModal(true);
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
        <ProductsTable
          products={PRODUCTS}
          onEditProduct={handleEditProduct}
        />
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

      {editProductsShowModal && (
        <EditProductsModal
          data={data}
          setData={setData}
          product={selectedProduct}
          onChange={handleDataChange}
          editProductsShowModal={editProductsShowModal}
          setEditProductsShowModal={setEditProductsShowModal}
        />
      )}
    </StoreLayout>
  );
}
