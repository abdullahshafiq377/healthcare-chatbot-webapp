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

import { title } from "@/components/primitives";
import { Link } from "@/i18n/routing";
import PrivacyPolicyModal from "@/components/privacy-policy-modal";

interface Errors {
  [key: string]: string | undefined;
}

export default function SignupPage() {
  const t = useTranslations("SignUpPage");

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [usertype, setUsertype] = useState("customer");
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [isVisible, setIsVisible] = React.useState(false);

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

  const onSubmit = () => {
    // Custom validation checks
    const newErrors: Errors = {};

    // Password validation
    const passwordError = getPasswordError(credentials.password);
    const emailError = getEmailError(credentials.email);

    if (passwordError) {
      newErrors.password = passwordError;
    }
    if (emailError) {
      newErrors.email = emailError;
    }

    console.log("Error:", newErrors);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);

      return;
    }

    // Clear errors and submit
    setErrors({});
    console.log(credentials);
  };

  return (
    <div>
      {/*<div className="absolute top-0 left-0 w-[100vw] h-full z-0 object-fill">*/}
      {/*  <img*/}
      {/*    alt="background"*/}
      {/*    className="opacity-20 dark:opacity-10 h-[100vh] w-[100vw]"*/}
      {/*    src={bgImage.src}*/}
      {/*  />*/}
      {/*</div>*/}
      <div className="z-20 w-full px-4 sm:px-0 sm:max-w-md flex flex-col gap-4 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <Card
          isBlurred
          className="border-none bg-background/40 dark:bg-white/5"
        >
          <CardHeader className="px-5 pt-6">
            <div className="flex flex-col gap-4 w-full text-center justify-center">
              <h1 className={clsx(title({ size: "sm" }))}>{t("title")}</h1>
              <h2 className="text-md">{t("subtitle")}</h2>
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
                      errorMessage: "text-left",
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
                        firstName: value,
                      }))
                    }
                  />

                  <Input
                    isRequired
                    classNames={{
                      inputWrapper: "bg-white dark:bg-gray-950",
                      errorMessage: "text-left",
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
                        lastName: value,
                      }))
                    }
                  />
                </div>

                <Input
                  isRequired
                  classNames={{
                    inputWrapper: "bg-white dark:bg-gray-950",
                    errorMessage: "text-left",
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
                      email: value,
                    }))
                  }
                />

                <Input
                  isRequired
                  classNames={{
                    inputWrapper: "bg-white dark:bg-gray-950",
                    errorMessage: "text-left",
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
                      password: value,
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

              <div className="flex gap-4">
                <Button
                  className="w-full text-black dark:text-black bg-lime-500 shadow-lime-500/50 hover:bg-lime-600 transition duration-200 ease-in-out"
                  radius="full"
                  type="button"
                  variant="shadow"
                  onPress={onOpen}
                >
                  {t("button")}
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
      <PrivacyPolicyModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </div>
  );
}
