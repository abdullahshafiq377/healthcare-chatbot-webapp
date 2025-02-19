"use client";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import {
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  PlusIcon
} from "@heroicons/react/24/solid";
import { Divider } from "@heroui/divider";
import { Textarea } from "@heroui/input";
import { Button } from "@heroui/button";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { Navbar, NavbarMenu, NavbarMenuToggle } from "@heroui/navbar";

import ConversationSection from "@/components/conversation-section";
import ConversationItem from "@/components/conversation-item";
import SentMessage from "@/components/sent-message";
import ReceivedMessage from "@/components/recieved-message";
import { axiosInstance } from "@/utils/axiosInstance";
import { MessageType, UserConversationType } from "@/types/dataTypes";
import Loader from "@/components/loader";

export interface CategorizedConversations {
  today: UserConversationType[];
  last7Days: UserConversationType[];
  older: UserConversationType[];
}

export default function ChatPage() {
  const t = useTranslations("ChatsPage");

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const [conversations, setConversations] = useState<CategorizedConversations>({
    today: [],
    last7Days: [],
    older: []
  });
  const [isConversationsLoading, setIsConversationsLoading] = useState(false);
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [messageText, setMessageText] = useState<string>("");
  const [isMessageSentLoading, setIsMessageSentLoading] = useState(false);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const sendMessage = async () => {
    try {
      if (messageText.trim().length === 0) {
        return;
      }
      let convoId = selectedConversationId;

      setIsMessageSentLoading(true);
      if (!convoId) {
        const newConversation = await axiosInstance.post("/chat/conversation", {
          title: messageText
        });

        console.log(newConversation?.data?._id);
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
      scrollToBottom(chatContainerRef);
      const res = await axiosInstance.post("/chat/message", {
        conversationId: convoId,
        text: messageText
      });

      console.log(res?.data);
      if (res?.data) {
        const updatedMessages = [...dummyMessages];

        updatedMessages.pop();
        updatedMessages.push(res?.data?.userMessage);
        updatedMessages.push(res?.data?.botMessage);
        setMessages([...updatedMessages]);
        setIsMessageSentLoading(false);
        scrollToBottom(chatContainerRef);
      }
    } catch (e) {
      console.log(e);
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

        console.log(res.data);
        if (res?.data) {
          setMessages(res.data);
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
    setMessages([]);
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
      console.log("scrolling to bottom...");
      ref.current.scrollTo({
        top: ref.current.scrollHeight,
        behavior: "smooth"
      });
    }
  };

  return (
    <div
      className="flex gap-2 h-[calc(100vh-64px-48px)] scroll-smooth flex-col md:flex-row md:gap-5">
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
                  Start New Conversation
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
      <div className="flex md:hidden">
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
                    <CalendarIcon height={20} width={20} />
                    <span className={"text-lg font-medium"}>
                      {t("chatHistory")}
                    </span>
                  </span>
                </CardHeader>
              </Card>
            }
          />
          <NavbarMenu>
            <Card
              isHoverable
              isPressable
              className="border dark:border-default/50"
              radius="sm"
              shadow="sm"
              onPress={handleNewConversation}
            >
              <CardBody>
                <span className="text-sm font-medium flex gap-2">
                  <PlusIcon height={20} width={20} />
                  Start New Conversation
                </span>
              </CardBody>
            </Card>
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
        className="flex w-full md:w-3/4 border-none bg-default/10 dark:bg-white/5">
        <CardHeader>
          <div className="flex gap-2 justify-center items-center">
            <ChatBubbleLeftRightIcon height={20} width={20} />
            <span className={"text-lg font-medium"}>{t("conversation")}</span>
          </div>
        </CardHeader>
        <Divider />
        <div
          ref={chatContainerRef}
          className="p-4 flex flex-col gap-5 h-[calc(100vh-64px-48px-120px)] overflow-y-auto"
        >
          <Loader isLoading={isMessagesLoading} />
          {messages.length > 0 ? (
            messages?.map((message) =>
              message?.sender === "user" ? (
                <SentMessage key={message?._id} text={message?.text} />
              ) : (
                <ReceivedMessage key={message?._id} text={message?.text} />
              )
            )
          ) : (
            <div
              className="flex flex-col gap-2 text-center h-full w-full items-center justify-center">
              <ChatBubbleLeftRightIcon
                className="text-gray-400 dark:text-gray-500"
                height={40}
                width={40}
              />
              <span
                className="text-3xl font-medium text-gray-600 dark:text-gray-300">
                What can I help you with today?
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                I can answer your questions and queries related to vaccines.
              </span>
            </div>
          )}
          {isMessageSentLoading && <ReceivedMessage isLoading text="" />}
        </div>
        <Divider />
        <CardFooter>
          <div className="flex gap-4 w-full">
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
              onPress={sendMessage}
            >
              <PaperAirplaneIcon height={20} width={20} />
            </Button>
          </div>
        </CardFooter>
      </Card>
      <Loader isLoading={isConversationsLoading} />
    </div>
  );
}
