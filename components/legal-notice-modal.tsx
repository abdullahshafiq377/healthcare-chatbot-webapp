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
import { Checkbox } from "@heroui/checkbox";

export default function LegalNoticeModal({
  isOpen,
  onOpenChange,
  onAccept,
  selected,
  setSelected,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
  onAccept?: () => void;
  selected?: boolean;
  setSelected?: (selected: boolean) => void;
}) {
  const t = useTranslations("LegalNoticeModal");

  return (
    <Modal
      hideCloseButton={true}
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
              <p>
                This platform is not a substitute for patient-provider decision
                making. By clicking Accept, you understand that responses are
                intended to be informative, are AI-based, and should get more
                precise over time.
              </p>
            </ModalBody>
            <ModalFooter className="flex justify-between">
              <Checkbox
                color="warning"
                isSelected={selected}
                onValueChange={setSelected}
              >
                {t("showAgain")}
              </Checkbox>
              <Button
                className="text-black dark:text-black bg-lime-500 shadow-lime-500/50 hover:bg-lime-600 transition duration-200 ease-in-out"
                radius="full"
                onPress={onAccept}
              >
                {t("accept")}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
