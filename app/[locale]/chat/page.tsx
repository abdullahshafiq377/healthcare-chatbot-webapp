"use client";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import {
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  PaperAirplaneIcon,
  PlusIcon,
  ShareIcon,
  SparklesIcon,
  XMarkIcon
} from "@heroicons/react/24/solid";
import { Divider } from "@heroui/divider";
import { Textarea } from "@heroui/input";
import { Button } from "@heroui/button";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { Navbar, NavbarMenu, NavbarMenuToggle } from "@heroui/navbar";
import { useDisclosure } from "@heroui/modal";
import clsx from "clsx";
import { button as buttonStyles } from "@heroui/theme";
import { Alert } from "@heroui/alert";

import ConversationSection from "@/components/conversation-section";
import ConversationItem from "@/components/conversation-item";
import SentMessage from "@/components/sent-message";
import ReceivedMessage from "@/components/recieved-message";
import { axiosInstance } from "@/utils/axiosInstance";
import { MessageType, UserConversationType } from "@/types/dataTypes";
import Loader from "@/components/loader";
import ShareModal from "@/components/share-with-friend-modal";
import { Link } from "@/i18n/routing";

export interface CategorizedConversations {
  today: UserConversationType[];
  last7Days: UserConversationType[];
  older: UserConversationType[];
}

export default function ChatPage() {
  const t = useTranslations("ChatsPage");

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const {
    isOpen: isShareOpen,
    onOpen: onShareOpen,
    onOpenChange: onShareOpenChange,
    onClose: onShareClose
  } = useDisclosure();

  const [conversations, setConversations] = useState<CategorizedConversations>({
    today: [],
    last7Days: [],
    older: []
  });
  const [isConversationsLoading, setIsConversationsLoading] = useState(false);
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [messages, setMessages] = useState<MessageType[]>([
    {
      _id: "initial_message",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      text: t("initialMessage"),
      conversationId: "",
      sender: "bot"
    }
  ]);
  const [messageText, setMessageText] = useState<string>("");
  const [isMessageSentLoading, setIsMessageSentLoading] = useState(false);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [limitReached, setLimitReached] = useState(false);

  const sendMessage = async () => {
    try {
      if (messageText.trim().length === 0) {
        return;
      }
      let convoId = selectedConversationId;

      setIsMessageSentLoading(true);
      setTimeout(() => {
        scrollToBottom(chatContainerRef);
      }, 100);
      if (!convoId) {
        const newConversation = await axiosInstance.post("/chat/conversation", {
          title: messageText
        });

        convoId = newConversation?.data?._id;
        const newConversations = { ...conversations };

        newConversations.today.push(newConversation?.data);
        setConversations(newConversations);
        setSelectedConversationId(convoId);
      }
      const dummyMessage: MessageType = {
        _id: "dummy_message_id",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        text: messageText,
        conversationId: convoId ? convoId : "",
        sender: "user"
      };

      setMessageText("");
      let dummyMessages = [...messages, dummyMessage];

      setMessages([...dummyMessages]);
      setTimeout(() => {
        scrollToBottom(chatContainerRef);
      }, 100);
      const res = await axiosInstance.post("/chat/message", {
        conversationId: convoId,
        text: messageText
      });

      if (res?.data) {
        console.log(res?.data);
        const updatedMessages = [...dummyMessages];

        updatedMessages.pop();
        updatedMessages.push(res?.data?.userMessage);
        updatedMessages.push(res?.data?.botMessage);
        setMessages([...updatedMessages]);
        setIsMessageSentLoading(false);
        setTimeout(() => {
          scrollToBottom(chatContainerRef);
        }, 100);
      }
    } catch (e: any) {
      console.log(e);
      if (e?.response?.data?.message === "Daily message limit reached") {
        setLimitReached(true);
      } else {
        setLimitReached(false);
      }
      setIsMessageSentLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      if (selectedConversationId) {
        setIsMessagesLoading(true);
        const res = await axiosInstance.get(
          `/chat/messages/${selectedConversationId}`
        );

        if (res?.data) {
          setMessages([
            {
              _id: "initial_message",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              text: t("initialMessage"),
              conversationId: "",
              sender: "bot"
            },
            ...res.data
          ]);
          setIsMessagesLoading(false);
          setTimeout(() => {
            scrollToBottom(chatContainerRef);
          }, 100);
        }
      }
    } catch (e) {
      console.log(e);
      setIsMessagesLoading(false);
    }
  };

  const fetchConversations = async () => {
    try {
      setIsConversationsLoading(true);
      const res = await axiosInstance.get<UserConversationType[]>(
        "/chat/conversations"
      );

      if (res?.data) {
        arrangeConversations(res?.data);
      }
    } catch (e) {
      console.error("Error fetching conversations:", e);
    } finally {
      setIsConversationsLoading(false);
    }
  };

  const arrangeConversations = (conversations: UserConversationType[]) => {
    const now = new Date();

    const categorizedConversations: CategorizedConversations = {
      today: [],
      last7Days: [],
      older: []
    };

    conversations.forEach((conversation) => {
      const createdAt = new Date(conversation.createdAt);
      const timeDiff =
        (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24); // Difference in days

      if (createdAt.toDateString() === now.toDateString()) {
        categorizedConversations.today.push(conversation);
      } else if (timeDiff < 7) {
        categorizedConversations.last7Days.push(conversation);
      } else {
        categorizedConversations.older.push(conversation);
      }
    });

    setConversations(categorizedConversations);
  };

  const handleNewConversation = () => {
    setSelectedConversationId(null);
    setMessages([
      {
        _id: "initial_message",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        text: t("initialMessage"),
        conversationId: "",
        sender: "bot"
      }
    ]);
    setIsMenuOpen(false);
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [selectedConversationId]);

  const scrollToBottom = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollTo({
        top: ref.current.scrollHeight,
        behavior: "smooth"
      });
    }
  };

  return (
    <div
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 h-[calc(100vh-64px-48px)] scroll-smooth md:gap-5">
      <Card
        isBlurred
        className="w-full col-span-1 border-none bg-default/10 dark:bg-white/5 hidden md:flex"
      >
        <CardHeader>
          <div className="flex gap-2 justify-center items-center">
            <CalendarIcon height={20} width={20} />
            <span className={"text-lg font-medium"}>{t("chatHistory")}</span>
          </div>
        </CardHeader>
        <Divider />
        <CardBody className="flex gap-5">
          <div className="w-full flex">
            <Card
              fullWidth
              isHoverable
              isPressable
              className="border dark:border-default/50"
              radius="sm"
              shadow="sm"
              onPress={handleNewConversation}
            >
              <CardBody>
                <div className="text-sm font-medium flex gap-2">
                  <PlusIcon height={20} width={20} />
                  {t("startNewConversation")}
                </div>
              </CardBody>
            </Card>
          </div>
          {conversations.today.length > 0 && (
            <ConversationSection title="Today">
              {conversations?.today?.map((conversation) => (
                <ConversationItem
                  key={conversation._id}
                  selected={selectedConversationId === conversation._id}
                  title={conversation.title}
                  onClick={() => setSelectedConversationId(conversation._id)}
                />
              ))}
            </ConversationSection>
          )}
          {conversations.last7Days.length > 0 && (
            <ConversationSection title="Last 7 days">
              {conversations?.last7Days?.map((conversation) => (
                <ConversationItem
                  key={conversation._id}
                  selected={selectedConversationId === conversation._id}
                  title={conversation.title}
                  onClick={() => setSelectedConversationId(conversation._id)}
                />
              ))}
            </ConversationSection>
          )}
          {conversations.older.length > 0 && (
            <ConversationSection title="Older">
              {conversations?.older?.map((conversation) => (
                <ConversationItem
                  key={conversation._id}
                  selected={selectedConversationId === conversation._id}
                  title={conversation.title}
                  onClick={() => setSelectedConversationId(conversation._id)}
                />
              ))}
            </ConversationSection>
          )}
        </CardBody>
      </Card>
      <div className="flex col-span-2 w-full md:hidden">
        <Navbar
          className="z-0"
          classNames={{ wrapper: "p-0 z-0" }}
          isMenuOpen={isMenuOpen}
          onMenuOpenChange={setIsMenuOpen}
        >
          <NavbarMenuToggle
            className="w-full flex justify-start p-0"
            icon={
              <Card fullWidth>
                <CardHeader>
                  <span className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className={"sm:text-lg font-medium"}>
                      {t("chatHistory")}
                    </span>
                  </span>
                </CardHeader>
              </Card>
            }
          />
          <NavbarMenu className="bg-black/25">
            <div className="flex justify-between items-stretch">
              <Card
                isHoverable
                isPressable
                className="border dark:border-default/50 overflow-visible"
                radius="sm"
                shadow="sm"
                onPress={handleNewConversation}
              >
                <CardBody>
                <span className="text-sm font-medium flex gap-2">
                  <PlusIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                  {t("startNewConversation")}
                </span>
                </CardBody>
              </Card>
              <Button className="bg-background" isIconOnly>
                <XMarkIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>
            {conversations.today.length > 0 && (
              <ConversationSection title="Today">
                {conversations?.today?.map((conversation) => (
                  <ConversationItem
                    key={conversation._id}
                    selected={selectedConversationId === conversation._id}
                    title={conversation.title}
                    onClick={() => {
                      setSelectedConversationId(conversation._id);
                      setIsMenuOpen(false);
                    }}
                  />
                ))}
              </ConversationSection>
            )}
            {conversations.last7Days.length > 0 && (
              <ConversationSection title="Last 7 days">
                {conversations?.last7Days?.map((conversation) => (
                  <ConversationItem
                    key={conversation._id}
                    selected={selectedConversationId === conversation._id}
                    title={conversation.title}
                    onClick={() => {
                      setSelectedConversationId(conversation._id);
                      setIsMenuOpen(false);
                    }}
                  />
                ))}
              </ConversationSection>
            )}
            {conversations.older.length > 0 && (
              <ConversationSection title="Older">
                {conversations?.older?.map((conversation) => (
                  <ConversationItem
                    key={conversation._id}
                    selected={selectedConversationId === conversation._id}
                    title={conversation.title}
                    onClick={() => {
                      setSelectedConversationId(conversation._id);
                      setIsMenuOpen(false);
                    }}
                  />
                ))}
              </ConversationSection>
            )}
          </NavbarMenu>
        </Navbar>
      </div>
      <Card
        className="flex w-full col-span-2 border-none bg-default/10 dark:bg-white/5">
        <CardHeader>
          <div className="flex gap-2 justify-center items-center">
            <ChatBubbleLeftRightIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            <span
              className={"sm:text-lg font-medium"}>{t("conversation")}</span>
          </div>
        </CardHeader>
        <Divider />
        <div
          ref={chatContainerRef}
          className="p-4 flex flex-col gap-5 h-[calc(100vh-64px-48px-120px)] overflow-y-auto"
        >
          <Loader isLoading={isMessagesLoading} />
          {messages.length > 0
            ? messages?.map((message) =>
              message?.sender === "user" ? (
                <SentMessage key={message?._id} text={message?.text} />
              ) : (
                <ReceivedMessage key={message?._id} text={message?.text} />
              )
            )
            : ""}
          {isMessageSentLoading && <ReceivedMessage isLoading text="" />}
        </div>
        <Divider />
        <CardFooter>
          <div className="flex gap-4 w-full">
            {limitReached ? (
              <Alert
                className="text-left"
                color="warning"
                title="Daily limit reached"
                variant="faded"
              />
            ) : (
              <>
                <Textarea
                  isClearable
                  maxRows={3}
                  minRows={1}
                  placeholder="Type your message here"
                  value={messageText}
                  variant="bordered"
                  onChange={(e) => setMessageText(e.target.value)}
                  onClear={() => setMessageText("")}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault(); // Prevent newline
                      sendMessage(); // Send message
                    }
                  }}
                />
                <Button
                  isIconOnly
                  className="text-black dark:text-black bg-lime-500 hover:bg-lime-600 transition duration-200 ease-in-out"
                  radius="full"
                  onPress={sendMessage}
                >
                  <PaperAirplaneIcon height={20} width={20} />
                </Button>
              </>
            )}
          </div>
        </CardFooter>
      </Card>
      <div className="hidden flex-col gap-4 w-full lg:flex">
        <Card
          className="flex w-full h-[35%] border dark:border-gray-700 bg-default/10 dark:bg-white/5">
          <CardHeader  className="py-2">
            <div className="flex items-center justify-center gap-2">
              <ShareIcon height={16} width={16} />
              <span
                className="text-base font-semibold">{t("refer.title")}</span>
            </div>
          </CardHeader>
          <Divider />
          <CardBody  className="py-2">
            <div className="flex flex-col gap-2 justify-between h-full">
              <p
                className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                {t("refer.description")}
              </p>
              {/*<div className="w-fit p-4 rounded-full mx-auto bg-lime-50 dark:bg-lime-500/20">*/}
              {/*  <img className="h-16" src={shareImage.src} alt="share" />*/}
              {/*</div>*/}
              <Button
                className="text-black dark:text-black bg-lime-500 hover:bg-lime-600 transition duration-200 ease-in-out"
                radius="full"
                size="sm"
                onPress={onShareOpen}
              >
                {t("refer.button")}
              </Button>
            </div>
          </CardBody>
        </Card>

        <Card
          className="flex w-full h-[32.5%] border-none bg-default/10 dark:bg-white/5">
          <CardHeader  className="py-2">
            <div className="flex gap-2 justify-center items-center">
              <EnvelopeIcon height={16} width={16} />
              <span className={"text-base font-medium"}>
                {t("feedback.title")}
              </span>
            </div>
          </CardHeader>
          <Divider />
          <CardBody  className="py-2">
            <div className="flex flex-col gap-2 justify-between h-full">
              <p
                className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                {t("feedback.description")}
              </p>
              {/*<div className="w-fit p-4 rounded-full mx-auto bg-lime-50 dark:bg-lime-500/20">*/}
              {/*  <img className="h-16" src={shareImage.src} alt="share" />*/}
              {/*</div>*/}
              <Link
                className={clsx(
                  buttonStyles({
                    size: "sm",
                    radius: "full"
                  }),
                  "text-black dark:text-black bg-lime-500 shadow-lime-500/50 hover:bg-lime-600 transition duration-200 ease-in-out"
                )}
                href="mailto:info@vaccifi.co?subject=Response%20Feedback"
              >
                {t("feedback.button")}
              </Link>
            </div>
          </CardBody>
        </Card>
        <Card
          className="flex w-full h-[32.5%]  border-none bg-default/10 dark:bg-white/5">
          <CardHeader className="py-2">
            <div className="flex gap-2 justify-center items-center">
              <SparklesIcon height={16} width={16} />
              <span className={"text-base font-medium"}>
                {t("enhancements.title")}
              </span>
            </div>
          </CardHeader>
          <Divider />
          <CardBody  className="py-2">
            <div className="flex flex-col gap-2 justify-between h-full">
              <p
                className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {t("enhancements.description")}
              </p>
              {/*<div className="w-fit p-4 rounded-full mx-auto bg-lime-50 dark:bg-lime-500/20">*/}
              {/*  <img className="h-16" src={shareImage.src} alt="share" />*/}
              {/*</div>*/}
              <Link
                className={clsx(
                  buttonStyles({
                    size: "sm",
                    radius: "full"
                  }),
                  "text-black dark:text-black bg-lime-500 shadow-lime-500/50 hover:bg-lime-600 transition duration-200 ease-in-out"
                )}
                href="mailto:info@vaccifi.co?subject=Site%20Enhancments"
              >
                {t("enhancements.button")}
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>
      <Loader isLoading={isConversationsLoading} />
      <ShareModal
        isOpen={isShareOpen}
        onClose={onShareClose}
        onOpenChange={onShareOpenChange}
      />
    </div>
  );
}
