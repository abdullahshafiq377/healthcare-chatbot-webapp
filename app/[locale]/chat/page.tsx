import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import {
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/solid";
import { Divider } from "@heroui/divider";
import { Textarea } from "@heroui/input";
import { Button } from "@heroui/button";
import { Skeleton } from "@heroui/skeleton";

const ConversationItem = ({ title }: { title: string }) => {
  return (
    <Card
      isHoverable
      isPressable
      className="border dark:border-default/50"
      shadow="sm"
    >
      <CardBody>
        <span className="text-sm font-medium">{title}</span>
      </CardBody>
    </Card>
  );
};

const ConversationSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm font-medium">{title}</span>
      {children}
    </div>
  );
};

const SentMessage = ({ text }: { text: string }) => {
  return (
    <div className="flex justify-end">
      <Card
        isBlurred
        className="max-w-[280px] md:max-w-lg bg-violet-500/40 dark:bg-violet-500/20 border border-violet-500/70 dark:border-violet-500/50 rounded-tr-none"
      >
        <CardBody>{text}</CardBody>
      </Card>
    </div>
  );
};

const ReceivedMessage = ({
  text,
  isLoading,
}: {
  text: string;
  isLoading?: boolean;
}) => {
  return (
    <div className="flex justify-start">
      <Card className="rounded-tl-none max-w-[280px] md:max-w-lg border dark:border-default/50">
        <CardBody>
          {isLoading ? (
            <div className="flex flex-col gap-2">
              <Skeleton className="w-full rounded-full">
                <div className="h-3 w-[250px] rounded-lg bg-default-300" />
              </Skeleton>
              <Skeleton className="w-full rounded-full">
                <div className="h-3 w-[250px] rounded-lg bg-default-300" />
              </Skeleton>
              <Skeleton className="w-full rounded-full">
                <div className="h-3 w-[250px] md:w-[600px] rounded-lg bg-default-300" />
              </Skeleton>
            </div>
          ) : (
            text
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default function ChatPage() {
  return (
    <div className="flex gap-5 h-[calc(100vh-64px-48px)] scroll-smooth">
      <Card
        isBlurred
        className="w-1/4 border-none bg-default/10 dark:bg-white/5 hidden md:flex"
      >
        <CardHeader>
          <div className="flex gap-2 justify-center items-center">
            <CalendarIcon height={20} width={20} />
            <span className={"text-lg font-medium"}>Chat history</span>
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
            <ConversationItem title="Hello there!" />
          </ConversationSection>
        </CardBody>
      </Card>
      <Card className="flex w-full md:w-3/4 border-none bg-default/10 dark:bg-white/5">
        <CardHeader>
          <div className="flex gap-2 justify-center items-center">
            <ChatBubbleLeftRightIcon height={20} width={20} />
            <span className={"text-lg font-medium"}>Conversation</span>
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
        <Divider />
        <CardFooter>
          <div className="flex gap-4 w-full">
            <Textarea
              isClearable
              maxRows={3}
              minRows={1}
              placeholder="Type your message here"
              variant="bordered"
            />
            <Button isIconOnly color="secondary">
              <PaperAirplaneIcon height={20} width={20} />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
