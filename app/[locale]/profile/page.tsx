"use client";
import React, { useState } from "react";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { Alert } from "@heroui/alert";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import { useTranslations } from "next-intl";

const defaultValue = {
  id: "",
  name: "",
  email: "",
};

type VisibilityKeys = "oldPassword" | "newPassword" | "confirmPassword";

const ProfilePage = () => {
  const t = useTranslations("ProfilePage");
  const [userInfo, setUserInfo] = useState(defaultValue);
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isUserInfoLoading, setIsUserInfoLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState({
    name: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isVisible, setIsVisible] = useState<Record<VisibilityKeys, boolean>>({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Add smooth scrolling animation
    });
  };

  const validateName = (value: string) => {
    if (value.trim().length === 0) {
      setValidationErrors((prevState) => ({
        ...prevState,
        name: "Name cannot be empty.",
      }));

      return false;
    }
    if (value.trim().length < 3) {
      setValidationErrors((prevState) => ({
        ...prevState,
        name: "Name too short.",
      }));

      return false;
    }
    setValidationErrors((prevState) => ({
      ...prevState,
      name: "",
    }));

    return true;
  };

  const validatePassword = (password: string, confirmPassword: string) => {
    // Check if the new password is the same as the old password
    if (passwords.oldPassword === password) {
      setValidationErrors((prevState) => ({
        ...prevState,
        newPassword: "New password cannot be the same as the current password.",
      }));

      return false;
    }

    // Check if password meets criteria
    if (password.length < 8) {
      setValidationErrors((prevState) => ({
        ...prevState,
        newPassword: "Password must be at least 8 characters long.",
      }));

      return false;
    } else if (!/[A-Z]/.test(password)) {
      setValidationErrors((prevState) => ({
        ...prevState,
        newPassword: "Password must contain at least one uppercase letter.",
      }));

      return false;
    } else if (!/[a-z]/.test(password)) {
      setValidationErrors((prevState) => ({
        ...prevState,
        newPassword: "Password must contain at least one lowercase letter.",
      }));

      return false;
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      setValidationErrors((prevState) => ({
        ...prevState,
        newPassword: "Password must contain at least one special character.",
      }));

      return false;
    }

    setValidationErrors((prevState) => ({
      ...prevState,
      newPassword: "",
    }));

    // Check if passwords match
    if (password !== confirmPassword) {
      setValidationErrors((prevState) => ({
        ...prevState,
        confirmPassword: "Passwords do not match.",
      }));

      return false;
    }

    setValidationErrors((prevState) => ({
      ...prevState,
      newPassword: "",
      confirmPassword: "",
    }));

    return true;
  };

  const toggleVisibility = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.target as HTMLButtonElement;
    const name = target.name as VisibilityKeys; // Assert that the name matches VisibilityKeys

    setIsVisible((prevState) => ({
      ...prevState,
      [name]: !prevState[name],
    }));
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      {(isSuccess || isError) && (
        <Alert
          color={isSuccess ? "success" : isError ? "danger" : "default"}
          description={alertMessage}
          title={
            isSuccess ? "Update successful" : isError ? "An error occurred" : ""
          }
          variant="faded"
        />
      )}
      <Card>
        <CardBody className="flex flex-row px-8 py-7">
          <div className="flex flex-col gap-2 flex-1">
            <h2 className="text-lg font-medium">{t("profileTitle")}</h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {t("profileDescription")}
            </span>
          </div>
          <div className="flex flex-col gap-4 flex-grow max-w-2xl">
            <Input
              errorMessage={validationErrors.name}
              isInvalid={Boolean(validationErrors.name)}
              label={t("name")}
              labelPlacement="outside"
              placeholder="Jhon Doe"
              value={userInfo.name}
              onChange={(e) => {
                setUserInfo((prevState) => ({
                  ...prevState,
                  name: e.target.value,
                }));
                validateName(e.target.value);
              }}
            />
            <Input
              disabled
              description="Updating email is not supported at the moment."
              label={t("email")}
              labelPlacement="outside"
              placeholder="jhon.doe@example.com"
              type="email"
              value={userInfo.email}
            />
          </div>
        </CardBody>
        <CardFooter className="flex justify-end gap-4">
          <Button color="default" variant="ghost">
            {t("cancel")}
          </Button>
          <Button
            className="text-black dark:text-black bg-lime-500 shadow-lime-500/50 hover:bg-lime-600 transition duration-200 ease-in-out"
            isLoading={isUserInfoLoading}
            variant="solid"
          >
            {t("updateProfile")}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardBody className="flex flex-row px-8 py-7">
          <div className="flex flex-col gap-2 flex-1 ">
            <h2 className="text-lg font-medium">{t("privacyTitle")}</h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {t("privacyDescription")}
            </span>
          </div>
          <div className="flex flex-col gap-4 flex-grow max-w-2xl">
            <Input
              endContent={
                <button
                  aria-label="toggle password visibility"
                  className="focus:outline-none"
                  name="oldPassword"
                  type="button"
                  onClick={toggleVisibility}
                >
                  {isVisible ? (
                    <EyeSlashIcon
                      className="text-default-400 pointer-events-none"
                      height={20}
                      width={20}
                    />
                  ) : (
                    <EyeIcon
                      className="text-default-400 pointer-events-none"
                      height={20}
                      width={20}
                    />
                  )}
                </button>
              }
              label={t("currentPassword")}
              labelPlacement="outside"
              placeholder="Enter your current password"
              type={isVisible.oldPassword ? "text" : "password"}
              onChange={(e) => {
                setPasswords((prevState) => ({
                  ...prevState,
                  oldPassword: e.target.value,
                }));
              }}
            />
            <Input
              endContent={
                <button
                  aria-label="toggle password visibility"
                  className="focus:outline-none"
                  name="newPassword"
                  type="button"
                  onClick={toggleVisibility}
                >
                  {isVisible ? (
                    <EyeSlashIcon
                      className="text-default-400 pointer-events-none"
                      height={20}
                      width={20}
                    />
                  ) : (
                    <EyeIcon
                      className="text-default-400 pointer-events-none"
                      height={20}
                      width={20}
                    />
                  )}
                </button>
              }
              errorMessage={validationErrors.newPassword}
              isInvalid={Boolean(validationErrors.newPassword)}
              label={t("newPassword")}
              labelPlacement="outside"
              placeholder="Enter your new password"
              type={isVisible.newPassword ? "text" : "password"}
              onChange={(e) => {
                setPasswords((prevState) => ({
                  ...prevState,
                  newPassword: e.target.value,
                }));
                validatePassword(e.target.value, passwords.confirmPassword);
              }}
            />
            <Input
              endContent={
                <button
                  aria-label="toggle password visibility"
                  className="focus:outline-none"
                  name="confirmPassword"
                  type="button"
                  onClick={toggleVisibility}
                >
                  {isVisible ? (
                    <EyeSlashIcon
                      className="text-default-400 pointer-events-none"
                      height={20}
                      width={20}
                    />
                  ) : (
                    <EyeIcon
                      className="text-default-400 pointer-events-none"
                      height={20}
                      width={20}
                    />
                  )}
                </button>
              }
              errorMessage={validationErrors.confirmPassword}
              isInvalid={Boolean(validationErrors.confirmPassword)}
              label={t("confirmPassword")}
              labelPlacement="outside"
              placeholder="Confirm Password"
              type={isVisible.confirmPassword ? "text" : "password"}
              onChange={(e) => {
                setPasswords((prevState) => ({
                  ...prevState,
                  confirmPassword: e.target.value,
                }));
                validatePassword(passwords.newPassword, e.target.value);
              }}
            />
          </div>
        </CardBody>
        <CardFooter className="flex justify-end gap-4">
          <Button color="default" variant="ghost">
            {t("cancel")}
          </Button>
          <Button
            className="text-black dark:text-black bg-lime-500 shadow-lime-500/50 hover:bg-lime-600 transition duration-200 ease-in-out"
            isLoading={isPasswordLoading}
            variant="solid"
          >
            {t("updatePassword")}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardBody className="flex flex-row px-8 py-7">
          <div className="flex flex-col gap-2 flex-1">
            <h2 className="text-lg font-medium">{t("myReportsTitle")}</h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {t("myReportsDescription")}
            </span>
          </div>
          <div className="flex flex-col gap-8 flex-grow max-w-2xl">
            <Card isHoverable isPressable>
              <CardHeader className="flex justify-between gap-4">
                <p className="font-medium text-left">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam pulvinar risus non risus hendrerit venenatis.
                </p>
                <Chip color="danger" size="sm" variant="flat">
                  Open
                </Chip>
              </CardHeader>
              <Divider />
              <CardBody>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam pulvinar risus non risus hendrerit venenatis.
                  Pellentesque sit amet hendrerit risus, sed porttitor quam.
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam pulvinar risus non risus hendrerit venenatis.
                  Pellentesque sit amet hendrerit risus, sed porttitor quam.
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam pulvinar risus non risus hendrerit venenatis.
                  Pellentesque sit amet hendrerit risus, sed porttitor quam.
                </p>
                <p>
                  Magna exercitation reprehenderit magna aute tempor cupidatat
                  consequat elit dolor adipisicing. Mollit dolor eiusmod sunt ex
                  incididunt cillum quis. Velit duis sit officia eiusmod Lorem
                  aliqua enim laboris do dolor eiusmod. Et mollit incididunt
                  nisi consectetur esse laborum eiusmod pariatur proident Lorem
                  eiusmod et. Culpa deserunt nostrud ad veniam.
                </p>
              </CardBody>
            </Card>
            <Card isHoverable isPressable>
              <CardHeader className="flex justify-between gap-4">
                <p className="font-medium text-left">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam pulvinar risus non risus hendrerit venenatis.
                </p>
                <Chip color="success" size="sm" variant="flat">
                  Resolved
                </Chip>
              </CardHeader>
              <Divider />
              <CardBody>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam pulvinar risus non risus hendrerit venenatis.
                  Pellentesque sit amet hendrerit risus, sed porttitor quam.
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam pulvinar risus non risus hendrerit venenatis.
                  Pellentesque sit amet hendrerit risus, sed porttitor quam.
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam pulvinar risus non risus hendrerit venenatis.
                  Pellentesque sit amet hendrerit risus, sed porttitor quam.
                </p>
                <p>
                  Magna exercitation reprehenderit magna aute tempor cupidatat
                  consequat elit dolor adipisicing. Mollit dolor eiusmod sunt ex
                  incididunt cillum quis. Velit duis sit officia eiusmod Lorem
                  aliqua enim laboris do dolor eiusmod. Et mollit incididunt
                  nisi consectetur esse laborum eiusmod pariatur proident Lorem
                  eiusmod et. Culpa deserunt nostrud ad veniam.
                </p>
              </CardBody>
            </Card>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody className="flex flex-row px-8 py-7">
          <div className="flex flex-col gap-2 flex-1">
            <h2 className="text-lg font-medium">{t("deleteAccountTitle")}</h2>
          </div>
          <div className="flex flex-col gap-4 flex-grow max-w-2xl">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {t("deleteAccountDescription")}
            </span>
          </div>
        </CardBody>
        <CardFooter className="flex justify-end gap-4">
          <Button color="danger" variant="solid">
            {t("deleteAccount")}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProfilePage;
