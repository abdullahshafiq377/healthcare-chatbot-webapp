"use client";
import { Card, CardBody, CardHeader } from "@heroui/card";
import {
  CalendarIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/solid";
import { Divider } from "@heroui/divider";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

import ConversationSection from "@/components/conversation-section";
import ConversationItem from "@/components/conversation-item";
import SentMessage from "@/components/sent-message";
import ReceivedMessage from "@/components/recieved-message";

export default function UserDetailsPage() {
  const t = useTranslations("ChatsPage");
  const params = useParams<{ userId: string }>();
  const { userId } = params;

  console.log(userId);

  return (
    <div className="flex gap-5 h-[calc(100vh-64px-72px)] scroll-smooth">
      <Card
        isBlurred
        className="w-1/4 border-none bg-default/10 dark:bg-white/5 hidden md:flex"
      >
        <CardHeader>
          <div className="flex gap-2 justify-center items-center">
            <CalendarIcon height={20} width={20} />
            <span className={"text-lg font-medium"}>{t("chatHistory")}</span>
          </div>
        </CardHeader>
        <Divider />
        <CardBody className="flex gap-5">
          <ConversationSection title="Yesterday">
            <ConversationItem title="Hello there!" />
          </ConversationSection>
          <ConversationSection title="Last 7 days">
            <ConversationItem title="Hello there!" />
            <ConversationItem title="Hello there!" />
          </ConversationSection>
        </CardBody>
      </Card>
      <Card className="flex w-full md:w-3/4 border-none bg-default/10 dark:bg-white/5">
        <CardHeader>
          <div className="flex gap-2 justify-center items-center">
            <ChatBubbleLeftRightIcon height={20} width={20} />
            <span className={"text-lg font-medium"}>{t("conversation")}</span>
          </div>
        </CardHeader>
        <Divider />
        <CardBody className="flex flex-col gap-5 h-[calc(100vh-64px-48px-280px)]">
          <SentMessage
            text="In Tailwind CSS, you can use the calc() function to define
          custom heights (or widths) by using the theme() function or by
          directly defining the value within the [] syntax for arbitrary
          values."
          />
          <ReceivedMessage
            text="In Tailwind CSS, you can use the calc() function to define
          custom heights (or widths) by using the theme() function or by
          directly defining the value within the [] syntax for arbitrary
          values."
          />
          <SentMessage
            text="In Tailwind CSS, you can use the calc() function to define
          custom heights (or widths) by using the theme() function or by
          directly defining the value within the [] syntax for arbitrary
          values."
          />
          <ReceivedMessage
            text="In Tailwind CSS, you can use the calc() function to define
          custom heights (or widths) by using the theme() function or by
          directly defining the value within the [] syntax for arbitrary
          values."
          />
          <SentMessage
            text="In Tailwind CSS, you can use the calc() function to define
          custom heights (or widths) by using the theme() function or by
          directly defining the value within the [] syntax for arbitrary
          values."
          />
          <ReceivedMessage
            isLoading
            text="In Tailwind CSS, you can use the calc() function to define
          custom heights (or widths) by using the theme() function or by
          directly defining the value within the [] syntax for arbitrary
          values."
          />
        </CardBody>
      </Card>
    </div>
  );
}
