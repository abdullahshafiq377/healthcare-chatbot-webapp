"use client";

import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import React, { useState } from "react";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import clsx from "clsx";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { useTranslations } from "next-intl";
import { useDisclosure } from "@heroui/modal";
import { Alert } from "@heroui/alert";

import { title } from "@/components/primitives";
import { Link, useRouter } from "@/i18n/routing";
import PrivacyPolicyModal from "@/components/privacy-policy-modal";
import { axiosInstance } from "@/utils/axiosInstance";

interface Errors {
  [key: string]: string | undefined;
}

interface ResponseMessageType {
  message: string;
  description: string;
  type: "success" | "danger";
}

export default function SignupPage() {
  const t = useTranslations("SignUpPage");
  const router = useRouter();

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    birthYear: "",
    country: "",
    state: "",
    privacyPolicyAcceptedAt: ""
  });
  const [errors, setErrors] = useState<Errors>({});
  const [isVisible, setIsVisible] = React.useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [displayMessage, setDisplayMessage] = useState(false);
  const [responseMessage, setResponseMessage] = useState<ResponseMessageType>({
    type: "success",
    message: "",
    description: ""
  });

  const toggleVisibility = () => setIsVisible(!isVisible);

  // Real-time password validation
  const getPasswordError = (value: string): string | null => {
    if (value.length === 0) {
      return "Password is required";
    }

    // if ((value.match(/[A-Z]/g) || []).length < 1) {
    //   return "Password needs at least 1 uppercase letter";
    // }
    // if ((value.match(/[^a-z]/gi) || []).length < 1) {
    //   return "Password needs at least 1 symbol";
    // }
    return null;
  };

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

  const getPhoneError = (value: string): string | null => {
    if (!value) {
      return "Phone number is required";
    }
    const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 format

    if (!phoneRegex.test(value)) {
      return "Please enter a valid phone number";
    }

    return null;
  };

  const getCountryError = (value: string): string | null => {
    if (!value) {
      return "Country is required";
    }
    if (value.length < 2 || value.length > 56) {
      return "Country name must be between 2 and 56 characters";
    }

    return null;
  };

  const getStateError = (value: string): string | null => {
    if (!value) {
      return "State is required";
    }
    if (value.length < 2 || value.length > 50) {
      return "State name must be between 2 and 50 characters";
    }

    return null;
  };

  const getBirthYearError = (value: string): string | null => {
    if (!value) {
      return "Birth year is required";
    }
    const birthYear = parseInt(value, 10);
    const currentYear = new Date().getFullYear();
    const minYear = currentYear - 120; // Assuming max age 120

    if (isNaN(birthYear) || birthYear < minYear || birthYear > currentYear) {
      return `Please enter a valid birth year between ${minYear} and ${currentYear}`;
    }

    return null;
  };

  const handleSignUpClick = () => {
    const newErrors: Errors = {};

    // Password validation
    const passwordError = getPasswordError(credentials.password);
    const emailError = getEmailError(credentials.email);
    const birthYear = getBirthYearError(credentials.birthYear);
    const phoneError = getPhoneError(credentials.phone);
    const countryError = getCountryError(credentials.country);
    const stateError = getStateError(credentials.state);

    if (passwordError) {
      newErrors.password = passwordError;
    }
    if (emailError) {
      newErrors.email = emailError;
    }
    if (birthYear) {
      newErrors.birthYear = birthYear;
    }
    if (phoneError) {
      newErrors.phone = phoneError;
    }
    if (countryError) {
      newErrors.country = countryError;
    }
    if (stateError) {
      newErrors.state = stateError;
    }
    if (credentials.firstName.length === 0) {
      newErrors.firstName = "First name is required";
    }

    console.log("Error:", newErrors);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);

      return;
    }

    // Clear errors and submit
    setErrors({});
    handleSubmit();
    // onOpen();
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    onClose();
    try {
      credentials.privacyPolicyAcceptedAt = new Date().toISOString();
      await axiosInstance.post("/auth/register", credentials);

      setIsLoading(false);
      setResponseMessage({
        type: "success",
        message: "Successfully registered!",
        description:
          "Your account has been created successfully. You will be redirected to the sign in page. Please sign in using the credentials you provided."
      });
      setDisplayMessage(true);
      setCredentials({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        phone: "",
        birthYear: "",
        country: "",
        state: "",
        privacyPolicyAcceptedAt: ""
      });
      setTimeout(() => {
        setDisplayMessage(false);
        router.push("/sign-in");
      }, 4000);
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div
        className="z-20 w-full px-4 sm:px-0 sm:max-w-md flex flex-col gap-4 ">
        <Card
          isBlurred
          className="border-none bg-background/40 dark:bg-white/5"
        >
          <CardHeader className="px-5 pt-6">
            <div
              className="flex flex-col gap-4 w-full text-center justify-center">
              <h1 className={clsx(title({ size: "sm" }))}>{t("title")}</h1>
              <h2 className="text-md">{t("subtitle")}</h2>
              {displayMessage && (
                <Alert
                  className="text-left"
                  color={responseMessage.type}
                  description={responseMessage.description}
                  title={responseMessage?.message}
                  variant="faded"
                />
              )}
            </div>
          </CardHeader>
          <Divider />
          <CardBody className="px-5">
            <Form className="w-full justify-center items-center space-y-4 pt-6">
              <div className="flex flex-col gap-4 w-full">
                <div className="flex gap-4 w-full">
                  <Input
                    isRequired
                    classNames={{
                      inputWrapper: "bg-white dark:bg-gray-950",
                      errorMessage: "text-left"
                    }}
                    errorMessage={errors.firstName}
                    isInvalid={Boolean(errors?.firstName)}
                    label={t("fields.firstName")}
                    labelPlacement="outside"
                    name="firstName"
                    placeholder="Dean"
                    radius="sm"
                    type="text"
                    value={credentials.firstName}
                    variant="bordered"
                    onValueChange={(value) =>
                      setCredentials((prevState) => ({
                        ...prevState,
                        firstName: value
                      }))
                    }
                  />

                  <Input
                    isRequired
                    classNames={{
                      inputWrapper: "bg-white dark:bg-gray-950",
                      errorMessage: "text-left"
                    }}
                    errorMessage={errors.lastName}
                    isInvalid={Boolean(errors?.lastName)}
                    label={t("fields.lastName")}
                    labelPlacement="outside"
                    name="lastName"
                    placeholder="Winchester"
                    radius="sm"
                    type="text"
                    value={credentials.lastName}
                    variant="bordered"
                    onValueChange={(value) =>
                      setCredentials((prevState) => ({
                        ...prevState,
                        lastName: value
                      }))
                    }
                  />
                </div>
                <div className="flex gap-4 w-full">
                  <Input
                    isRequired
                    classNames={{
                      inputWrapper: "bg-white dark:bg-gray-950",
                      errorMessage: "text-left"
                    }}
                    errorMessage={errors.phone}
                    isInvalid={Boolean(errors?.phone)}
                    label={t("fields.phone")}
                    labelPlacement="outside"
                    name="phone"
                    placeholder="+1 234 567 890"
                    radius="sm"
                    type="text"
                    value={credentials.phone}
                    variant="bordered"
                    onValueChange={(value) =>
                      setCredentials((prevState) => ({
                        ...prevState,
                        phone: value
                      }))
                    }
                  />

                  <Input
                    isRequired
                    classNames={{
                      inputWrapper: "bg-white dark:bg-gray-950",
                      errorMessage: "text-left"
                    }}
                    errorMessage={errors.birthYear}
                    isInvalid={Boolean(errors?.birthYear)}
                    label={t("fields.birthYear")}
                    labelPlacement="outside"
                    name="birthYear"
                    placeholder="1990"
                    radius="sm"
                    type="text"
                    value={credentials.birthYear}
                    variant="bordered"
                    onValueChange={(value) =>
                      setCredentials((prevState) => ({
                        ...prevState,
                        birthYear: value
                      }))
                    }
                  />
                </div>
                <div className="flex gap-4 w-full">
                  <Input
                    isRequired
                    classNames={{
                      inputWrapper: "bg-white dark:bg-gray-950",
                      errorMessage: "text-left"
                    }}
                    errorMessage={errors.country}
                    isInvalid={Boolean(errors?.country)}
                    label={t("fields.country")}
                    labelPlacement="outside"
                    name="country"
                    placeholder="USA"
                    radius="sm"
                    type="text"
                    value={credentials.country}
                    variant="bordered"
                    onValueChange={(value) =>
                      setCredentials((prevState) => ({
                        ...prevState,
                        country: value
                      }))
                    }
                  />
                  <Input
                    isRequired
                    classNames={{
                      inputWrapper: "bg-white dark:bg-gray-950",
                      errorMessage: "text-left"
                    }}
                    errorMessage={errors.state}
                    isInvalid={Boolean(errors?.state)}
                    label={t("fields.state")}
                    labelPlacement="outside"
                    name="state"
                    placeholder="Chicago"
                    radius="sm"
                    type="text"
                    value={credentials.state}
                    variant="bordered"
                    onValueChange={(value) =>
                      setCredentials((prevState) => ({
                        ...prevState,
                        state: value
                      }))
                    }
                  />
                </div>

                <Input
                  isRequired
                  classNames={{
                    inputWrapper: "bg-white dark:bg-gray-950",
                    errorMessage: "text-left"
                  }}
                  errorMessage={errors.email}
                  isInvalid={Boolean(errors?.email)}
                  label={t("fields.email")}
                  labelPlacement="outside"
                  name="email"
                  placeholder="dean.winchester@example.com"
                  radius="sm"
                  type="email"
                  value={credentials.email}
                  variant="bordered"
                  onValueChange={(value) =>
                    setCredentials((prevState) => ({
                      ...prevState,
                      email: value
                    }))
                  }
                />

                <Input
                  isRequired
                  classNames={{
                    inputWrapper: "bg-white dark:bg-gray-950",
                    errorMessage: "text-left"
                  }}
                  endContent={
                    <button
                      aria-label="toggle password visibility"
                      className="focus:outline-none"
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
                  errorMessage={errors?.password || undefined}
                  isInvalid={Boolean(errors?.password)}
                  label={t("fields.password")}
                  labelPlacement="outside"
                  name="password"
                  placeholder="Enter your password"
                  radius="sm"
                  type={isVisible ? "text" : "password"}
                  value={credentials.password}
                  variant="bordered"
                  onValueChange={(value) =>
                    setCredentials((prevState) => ({
                      ...prevState,
                      password: value
                    }))
                  }
                />
              </div>
            </Form>
          </CardBody>
          {/*<Divider/>*/}
          <CardFooter className="px-5 pb-6">
            <div className="flex flex-col gap-4 w-full">
              <div className="text-center">
                <Link
                  className="text-lime-500 hover:text-lime-600 transition duration-200 ease-in-out"
                  href="/sign-in"
                >
                  {t("fields.alreadyAccount")}
                </Link>
              </div>

              <p className="text-sm text-gray-400 dark:text-gray-500">
                {t("fields.privacyPolicyText")}
                {' '}
                <Link
                  href="https://vaccinesupport.co/privacy-and-disclaimers"
                  target="_blank"
                  className="underline text-lime-500 hover:text-lime-600">{t("fields.privacyPolicyLink")}</Link>.
              </p>

              <div className="flex gap-4">
                <Button
                  className="w-full text-black dark:text-black bg-lime-500 shadow-lime-500/50 hover:bg-lime-600 transition duration-200 ease-in-out"
                  isLoading={isLoading}
                  radius="full"
                  type="button"
                  variant="shadow"
                  onPress={handleSignUpClick}
                >
                  {t("button")}
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
      <PrivacyPolicyModal
        isOpen={isOpen}
        onAccept={handleSubmit}
        onOpenChange={onOpenChange}
      />
    </div>
  );
}
