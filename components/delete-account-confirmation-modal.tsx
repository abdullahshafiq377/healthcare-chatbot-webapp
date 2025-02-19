"use client";
import { Button } from "@heroui/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { useTranslations } from "next-intl";

export default function DeleteAccountConfirmationModal({
  isOpen,
  onOpenChange,
  onConfirm,
  isLoading,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}) {
  const t = useTranslations("DeleteAccountConfirmationModal");

  return (
    <Modal
      isDismissable={false}
      isOpen={isOpen}
      scrollBehavior="inside"
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {t("title")}
            </ModalHeader>
            <ModalBody>
              <p>{t("message")}</p>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose}>
                {t("cancel")}
              </Button>
              <Button
                color="danger"
                isLoading={isLoading}
                variant="ghost"
                onPress={onConfirm}
              >
                {t("confirm")}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
