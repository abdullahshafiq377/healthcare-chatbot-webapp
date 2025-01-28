"use client";
import { button as buttonStyles } from "@heroui/theme";
import Lottie from "lottie-react";
import { SparklesIcon } from "@heroicons/react/24/solid";
import { useTranslations } from "next-intl";
import clsx from "clsx";

import { subtitle, title } from "@/components/primitives";
import animationData from "@/assets/animations/heartbeat.json";
import { Link } from "@/i18n/routing";

export default function Home() {
  const t = useTranslations("HomePage");

  return (
    <>
      <section className="flex absolute w-full px-6 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-4 py-8 md:py-10 sm:w-full sm:max-w-none z-20">
        <div className="inline-block  text-center justify-center">
          <div
            className="flex justify-center items-center mx-auto h-16 w-16 bg-gradient-to-t from-lime-500/30 to-lime-500/30
         rounded-full"
          >
            <div className="h-10 w-10">
              <Lottie animationData={animationData} loop={true} />
            </div>
          </div>
          <br />
          {/*Vaccine Knowledge. Your Way.*/}
          <span className={title({ color: "yellow", size: "lg" })}>
            Vaccine&nbsp;
          </span>
          <span
            className={title({
              size: "lg",
            })}
          >
            Knowledge.&nbsp;
          </span>
          <br />
          <span className={title({ size: "lg" })}>Your Way.</span>
          <div className={subtitle({ class: "mt-4" })}>{t("subtitle")}</div>
        </div>

        <div className="flex gap-4 sm:gap-3 flex-wrap justify-center">
          {/*<Button variant="shadow" color="secondary" radius="full">*/}
          {/*  Register as a Professional*/}
          {/*</Button>*/}
          <Link
            className={clsx(
              buttonStyles({
                radius: "full",
                variant: "shadow",
                size: "lg",
              }),
              "text-black dark:text-black bg-lime-500 shadow-lime-500/50 hover:bg-lime-600 transition duration-200 ease-in-out",
            )}
            href="/sign-up"
          >
            <SparklesIcon height={16} width={16} />
            {t("button")}
          </Link>
        </div>

        {/*<div className="mt-8">*/}
        {/*  <Snippet hideCopyButton hideSymbol variant="bordered">*/}
        {/*    <span>*/}
        {/*      Get started by editing <Code color="primary">app/page.tsx</Code>*/}
        {/*    </span>*/}
        {/*  </Snippet>*/}
        {/*</div>*/}
      </section>
    </>
  );
}
