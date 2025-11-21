"use client";

import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import {
  Button,
  Input,
  NumberInput,
  Textarea,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { Upload, X } from "lucide-react";

export function AddProductsModal({
  data,
  setData,
  onChange,
  addProductsShowModal,
  setAddProductsShowModal,
}) {
  const t = useTranslations("products");
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    onChange({ storeImage: file });

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    onChange({ storeImage: null });
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(data);

    setAddProductsShowModal(false);
  };

  return (
    <Modal
      isOpen={addProductsShowModal}
      onOpenChange={setAddProductsShowModal}
      backdrop="blur"
      classNames={{
        backdrop: "backdrop-blur-xs bg-white/10",
      }}
    >
      <ModalContent>
        <ModalHeader>{t("modal.titleAdd")}</ModalHeader>

        <ModalBody>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              label={t("modal.productNameLabel")}
              placeholder={t("modal.productNamePlaceholder")}
              value={data.productName}
              onChange={(e) =>
                onChange({ productName: e.target.value })
              }
            />

            <Textarea
              label={t("modal.productDescriptionLabel")}
              placeholder={t("modal.productDescriptionPlaceholder")}
              value={data.productDescription}
              onChange={(e) =>
                onChange({ productDescription: e.target.value })
              }
            />

            <Input
              label={t("modal.productCategoryLabel")}
              placeholder={t("modal.productCategoryPlaceholder")}
              value={data.productCategory}
              onChange={(e) =>
                onChange({ productCategory: e.target.value })
              }
            />

            <Input
              label={t("modal.productSKULabel")}
              placeholder={t("modal.productSKUPlaceholder")}
              value={data.productSKU}
              onChange={(e) =>
                onChange({ productSKU: e.target.value })
              }
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <NumberInput
                label={t("modal.productPriceLabel")}
                placeholder={t("modal.productPricePlaceholder")}
                startContent={
                  <span className="text-default-400 text-small">$</span>
                }
                value={data.productPrice}
                onValueChange={(value) => {
                  const numeric = value === null ? "" : Number(value);
                  onChange({ productPrice: numeric });
                }}
                min={0}
                step={0.01}
              />

              <NumberInput
                label={t("modal.productStockLabel")}
                placeholder={t("modal.productStockPlaceholder")}
                value={data.productStock}
                onValueChange={(value) => {
                  const numeric = value === null ? "" : Number(value);
                  onChange({ productStock: numeric });
                }}
                min={0}
                step={1}
              />
            </div>

            <div>
              {imagePreview ? (
                <div className="relative w-32 h-32 rounded-lg border border-border overflow-hidden bg-muted">
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className="w-full h-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded hover:opacity-90"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full p-8 rounded-lg border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-colors flex flex-col items-center justify-center cursor-pointer"
                >
                  <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                  <p className="text-sm font-medium">
                    {t("modal.productImageUpload")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t("modal.productImageUploadMessage")}
                  </p>
                </button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            <ModalFooter className="flex justify-between p-0 my-4">
              <Button
                variant="bordered"
                type="button"
                onPress={() => setAddProductsShowModal(false)}
              >
                {t("modal.cancelButton")}
              </Button>

              <Button color="primary" className="bg-green-800" type="submit">
                {t("modal.submitButton")}
              </Button>
            </ModalFooter>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
