"use client";
import { Button } from "@heroui/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader
} from "@heroui/modal";
import { Input } from "@heroui/input";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Alert } from "@heroui/alert";

import { axiosInstance } from "@/utils/axiosInstance";

export default function ForgetPasswordModal({
                                      isOpen,
                                      onOpenChange,
                                      onClose
                                    }: {
  isOpen: boolean;
  onOpenChange: () => void;
  onClose: () => void;
}) {
  const t = useTranslations("ForgetPasswordModal");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errors, setErrors] = useState("");

  const getEmailError = (value: string): string | null => {
    if (!value) {
      return "Email is required";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(value)) {
      return "Please enter a valid email address";
    }
    if (value.length > 254) {
      return "Email must be 254 characters or less";
    }

    return null;
  };

  const handleSubmit = async () => {
    try {
      const emailError = getEmailError(email);

      if (emailError) {
        setErrors(emailError);

        return;
      }

      setIsLoading(true);
      console.log(email);
      const res = await axiosInstance.put("/users/forget-password", { email });

      console.log(res);
      if (res.status === 201) {
      }
      setShowSuccessMessage(true);
      setEmail("");
      setIsLoading(false);
      setTimeout(() => {
        setShowSuccessMessage(false);
        onClose();
      }, 3000);
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
  };

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
              {t("modalTitle")}
            </ModalHeader>
            <ModalBody>
              {showSuccessMessage && (
                <Alert color="success"
                       title="Password reset successfull."
                       description="An email has been sent to your registered email address." />
              )}
              <Input
                isRequired
                classNames={{
                  errorMessage: "text-left"
                }}
                errorMessage={errors}
                isInvalid={Boolean(errors)}
                label={t("email")}
                labelPlacement="outside"
                name="email"
                placeholder="Enter your email."
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose}>
                {t("cancel")}
              </Button>
              <Button
                className="text-black dark:text-black bg-lime-500 shadow-lime-500/50 hover:bg-lime-600 transition duration-200 ease-in-out"
                isLoading={isLoading}
                onPress={handleSubmit}
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
