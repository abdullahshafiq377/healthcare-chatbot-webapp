"use client";
import { Link } from "@heroui/link";
import { button as buttonStyles } from "@heroui/theme";
import Lottie from "lottie-react";
import { BriefcaseIcon, UserIcon } from "@heroicons/react/24/solid";

import { subtitle, title } from "@/components/primitives";
import animationData from "@/assets/animations/heartbeat.json";

export default function Home() {
  return (
    <>
      <section className="flex absolute w-full px-6 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-4 py-8 md:py-10 sm:w-full sm:max-w-none z-20">
        <div className="inline-block  text-center justify-center">
          <div
            className="flex justify-center items-center mx-auto h-16 w-16 bg-gradient-to-t from-[#FF1CF7]/30 to-[#b249f8]/30
         rounded-full"
          >
            <div className="h-10 w-10">
              <Lottie animationData={animationData} loop={true} />
            </div>
          </div>
          <br />
          <span className={title({ size: "lg" })}>Your&nbsp;</span>
          <span
            className={title({
              color: "violet",
              size: "lg",
            })}
          >
            Health&nbsp;
          </span>
          <br />
          <span className={title({ size: "lg" })}>Made Smarter with AI.</span>
          <div className={subtitle({ class: "mt-4" })}>
            Instant answers, personalized care, always available.
          </div>
        </div>

        <div className="flex gap-4 sm:gap-3 flex-wrap justify-center">
          {/*<Button variant="shadow" color="secondary" radius="full">*/}
          {/*  Register as a Professional*/}
          {/*</Button>*/}
          <Link
            className={buttonStyles({
              color: "secondary",
              radius: "full",
              variant: "shadow",
              size: "lg",
            })}
            href="/sign-up?userType=professional"
          >
            <BriefcaseIcon height={16} width={16} />
            Register as Professional
          </Link>
          <Link
            className={buttonStyles({
              variant: "bordered",
              radius: "full",
              size: "lg",
            })}
            href="/sign-up"
          >
            <UserIcon height={16} width={16} />
            Sign up as client
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
