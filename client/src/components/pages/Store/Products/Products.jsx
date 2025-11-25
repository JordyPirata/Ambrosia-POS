"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import { useTranslations } from "next-intl";
import { StoreLayout } from "../StoreLayout";
import { ProductsTable } from "./ProductsTable";
import { AddProductsModal } from "./AddProductsModal";
import { EditProductsModal } from "./EditProductsModal";
import { DeleteProductsModal } from "./DeleteProductsModal";
import { useProducts } from "../hooks/useProducts";
import { useCategories } from "../hooks/useCategories";

export function Products() {
  const [addProductsShowModal, setAddProductsShowModal] = useState(false);
  const [editProductsShowModal, setEditProductsShowModal] = useState(false);
  const [deleteProductsShowModal, setDeleteProductsShowModal] = useState(false);
  const [data, setData] = useState({
    productId: "",
    productName: "",
    productDescription: "",
    productCategory: "",
    productSKU: "",
    productPrice: "",
    productStock: "",
    productImage: "",
    storeImage: null,
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null)
  const { products, addProduct, updateProduct, isUploading, refetch: refetchProducts } = useProducts();
  const {
    categories,
    loading: categoriesLoading,
    createCategory,
    refetch: refetchCategories
  } = useCategories("product");

  const handleDataChange = (newData) => {
    setData((prev) => ({ ...prev, ...newData }))
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);

    setData({
      productId: product.id,
      productName: product.name,
      productDescription: product.description,
      productCategory: product.category_id,
      productSKU: product.SKU,
      productPrice: product.price_cents ? product.price_cents / 100 : "",
      productStock: product.quantity,
      productImage: product.image_url,
      storeImage: null,
    });

    setEditProductsShowModal(true);
  };

  const handleDeleteProduct = (product) => {
    setProductToDelete(product);
    setDeleteProductsShowModal(true);
  };

  const handleRefreshData = async () => {
    await Promise.all([refetchProducts(), refetchCategories()]);
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
          products={products}
          categories={categories}
          onEditProduct={handleEditProduct}
          onDeleteProduct={handleDeleteProduct}
        />
      </div>

      {addProductsShowModal && (
        <AddProductsModal
          addProductsShowModal={addProductsShowModal}
          setAddProductsShowModal={setAddProductsShowModal}
          data={data}
          setData={setData}
          addProduct={addProduct}
          isUploading={isUploading}
          categories={categories}
          categoriesLoading={categoriesLoading}
          createCategory={createCategory}
          onChange={handleDataChange}
          onProductCreated={handleRefreshData}
        />
      )}

      {editProductsShowModal && (
        <EditProductsModal
          data={data}
          setData={setData}
          product={selectedProduct}
          onChange={handleDataChange}
          updateProduct={updateProduct}
          isUploading={isUploading}
          onProductUpdated={handleRefreshData}
          categories={categories}
          categoriesLoading={categoriesLoading}
          createCategory={createCategory}
          editProductsShowModal={editProductsShowModal}
          setEditProductsShowModal={setEditProductsShowModal}
        />
      )}

      {deleteProductsShowModal && (
        <DeleteProductsModal
          product={productToDelete}
          deleteProductsShowModal={deleteProductsShowModal}
          setDeleteProductsShowModal={setDeleteProductsShowModal}
          onConfirm={() => {
            setDeleteProductsShowModal(false);
          }}
        />
      )}
    </StoreLayout>
  );
}
