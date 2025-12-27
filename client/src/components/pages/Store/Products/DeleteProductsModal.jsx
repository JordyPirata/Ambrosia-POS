"use client";

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";
import { useTranslations } from "next-intl";

export function DeleteProductsModal({ product, deleteProductsShowModal, setDeleteProductsShowModal, onConfirm }) {
  const t = useTranslations("products");
  return (
    <Modal
      isOpen={deleteProductsShowModal}
      onOpenChange={setDeleteProductsShowModal}
      backdrop="blur"
      classNames={{
        backdrop: "backdrop-blur-xs bg-white/10",
      }}
    >
      <ModalContent>
        <ModalHeader>{t("modal.titleDelete")}</ModalHeader>
        <ModalBody>
          <p>{t("modal.subtitleDelete")}<b> {product?.name}</b>?</p>
          <p className="text-red-500 text-sm">{t("modal.warningDelete")}</p>
        </ModalBody>
        <ModalFooter>
          <Button onPress={() => setDeleteProductsShowModal(false)}>
            {t("modal.cancelButton")}
          </Button>
          <Button color="danger" onPress={onConfirm}>
            {t("modal.deleteButton")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
