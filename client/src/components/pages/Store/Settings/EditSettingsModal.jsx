"use client";

import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { Upload, X } from "lucide-react";
import { Button, Input, Select, SelectItem, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Textarea, } from "@heroui/react";

export function EditSettingsModal({ data, setData, onChange, editSettingsShowModal, setEditSettingsShowModal }) {
  const t = useTranslations("settings");
  const [rfcError, setRfcError] = useState("");
  const fileInputRef = useRef(null);

  const handleOnCloseModal = () => {
    setData(data);
    setEditSettingsShowModal(false);
  }

  const [imagePreview, setImagePreview] = useState(data.businessLogoUrl);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    onChange({ storeImage: file, productImage: "" });

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    onChange({ storeImage: null, productImage: "" });
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const validateRFC = (value) => {
    const upperValue = value.toUpperCase();
    const rfcRegex = /^[A-ZÑ&]{3,4}(?:\d{2})(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[A-Z0-9]{3}$/;

    if (!upperValue) {
      setRfcError("");
    } else if (upperValue.length === 13 && !rfcRegex.test(upperValue)) {
      setRfcError(t("step3.fields.businessRFCInvalid") || "RFC inválido. Debe tener formato correcto.");
    } else {
      setRfcError("");
    }

    onChange({ ...data, businessTaxID: upperValue });
  };

  return (
    <Modal
      isOpen={editSettingsShowModal}
      onOpenChange={handleOnCloseModal}
      backdrop="blur"
      classNames={{
        backdrop: "backdrop-blur-xs bg-white/10",
      }}
    >
      <ModalContent>
        <ModalHeader>
          {t("modal.title")}
        </ModalHeader>
        <ModalBody>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              console.log("Settings data to submit:", data);
              setEditSettingsShowModal(false);
            }}
          >
            <Input
              label={t("modal.name")}
              type="text"
              placeholder={t("modal.namePlaceholder")}
              value={data.businessName ?? ""}
              onChange={(e) => onChange({ ...data, businessName: e.target.value })}
            />
            <Textarea
              label={t("modal.description")}
              type="text"
              placeholder={t("modal.descriptionPlaceholder")}
              value={data.businessDescription ?? ""}
              onChange={(e) => onChange({ ...data, businessDescription: e.target.value })}
            />
            <Input
              label={t("modal.rfc")}
              type="text"
              placeholder="RFC"
              maxLength={13}
              value={data.businessTaxId}
              onChange={(e) => validateRFC(e.target.value)}
              isInvalid={!!rfcError}
              errorMessage={rfcError}
            />
            <Input
              label={t("modal.address")}
              type="text"
              placeholder={t("modal.addressPlaceholder")}
              value={data.businessAddress ?? ""}
              onChange={(e) => onChange({ ...data, businessAddress: e.target.value })}
            />
            <Input
              label={t("modal.email")}
              type="email"
              placeholder={t("modal.emailPlaceholder")}
              value={data?.businessEmail ?? ""}
              onChange={(e) => onChange({ ...data, businessEmail: e.target.value })}
            />
            <Input
              label={t("modal.phone")}
              type="tel"
              placeholder={t("modal.phonePlaceholder")}
              maxLength={10}
              value={data.businessPhone ?? ""}
              onChange={(e) => {
                const onlyNumbers = e.target.value.replace(/\D/g, "");
                onChange({ ...data, businesshone: onlyNumbers });
              }}
            />

            <div>
              <p className="text-xs font-semibold text-green-900 mb-4">
                {t("modal.logo")}
              </p>
              {imagePreview ? (
                <div className="relative w-32 h-32 rounded-lg border border-border overflow-hidden bg-muted">
                  <img
                    src={imagePreview}
                    alt="Logo preview"
                    className="w-full h-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded hover:opacity-90 cursor-pointer"
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
                    {t("modal.logoUpload")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t("modal.logoUploadMessage")}
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
                className="px-6 py-2 border border-border text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                onPress={() => handleOnCloseModal()}
              >
                {t("modal.cancelButton")}
              </Button>
              <Button
                color="primary"
                className="bg-green-800"
                type="submit"
              >
                {t("modal.editButton")}
              </Button>
            </ModalFooter>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
