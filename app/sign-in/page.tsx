"use client";

import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import React, { useState } from "react";
import { Link } from "@heroui/link";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import clsx from "clsx";
import { Divider } from "@heroui/divider";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

import bgImage from "@/assets/Gradient Background 1.png";
import { title } from "@/components/primitives";

interface Errors {
  [key: string]: string | undefined;
}

export default function SigninPage() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
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

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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
      <div className="absolute top-0 left-0 w-[100vw] h-full z-0 object-fill">
        <img
          alt="background"
          className="opacity-20 dark:opacity-10 h-[100vh] w-[100vw]"
          src={bgImage.src}
        />
      </div>
      <div className="z-20 w-full px-4 sm:px-0 sm:max-w-sm flex flex-col gap-4 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <Card
          isBlurred
          className="border-none bg-background/40 dark:bg-white/5"
        >
          <CardHeader className="py-6 px-5">
            <div className="flex flex-col gap-4 w-full text-center justify-center">
              <h1 className={clsx(title({ size: "sm" }))}>Welcome Back!</h1>
              <h2 className="text-md">
                Sign in to access your personalized healthcare assistant.
              </h2>
            </div>
          </CardHeader>
          <Divider />
          <CardBody className="py-6 px-5">
            <Form
              className="w-full justify-center items-center space-y-4"
              onSubmit={onSubmit}
            >
              <div className="flex flex-col gap-4 w-full">
                <Input
                  isRequired
                  classNames={{
                    inputWrapper: "bg-white dark:bg-gray-950",
                    errorMessage: "text-left",
                  }}
                  errorMessage={errors.email}
                  isInvalid={Boolean(errors?.email)}
                  label="Email"
                  labelPlacement="outside"
                  name="email"
                  placeholder="dean.winchester@example.com"
                  radius="full"
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
                  label="Password"
                  labelPlacement="outside"
                  name="password"
                  placeholder="Enter your password"
                  radius="full"
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
          <CardFooter className="px-5 pb-6">
            <div className="flex flex-col gap-4 w-full">
              <div className="text-center">
                <Link color="secondary" href="/sign-up" size="sm">
                  Create a new account?
                </Link>
              </div>

              <div className="flex gap-4">
                <Button
                  className="w-full"
                  color="secondary"
                  radius="full"
                  type="submit"
                  variant="shadow"
                >
                  Sign in
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
