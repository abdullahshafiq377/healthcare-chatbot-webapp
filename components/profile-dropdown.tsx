"use client";
import React from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { User } from "@heroui/user";
import { useDisclosure } from "@heroui/modal";
import { useTranslations } from "next-intl";

import ReportModal from "@/components/report-modal";
import { useRouter } from "@/i18n/routing";

const ProfileDropdown = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const router = useRouter();
  const t = useTranslations("ProfileDropdown");

  return (
    <>
      <Dropdown placement="bottom-start">
        <DropdownTrigger>
          <User
            className="transition-transform"
            as="button"
            // avatarProps={{
            //   isBordered: true,
            //   src: "https://i.pravatar.cc/150?u=a042581f4e29026024d"
            // }}
            classNames={{
              name: "hidden sm:block",
              description: "hidden sm:block"
            }}
            description="user@example.com"
            name="John Doe"
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="User Actions" variant="flat">
          <DropdownItem key="profile" className="h-14 gap-2">
            <p className="font-bold">{t("signedInAs")}</p>
            <p className="font-bold">user@example.com</p>
          </DropdownItem>
          <DropdownItem key="settings" onPress={() => router.push("/profile")}>
            {t("mySettings")}
          </DropdownItem>
          <DropdownItem key="report" onPress={onOpen}>
            {t("report")}
          </DropdownItem>
          <DropdownItem key="logout" color="danger">
            {t("logOut")}
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <ReportModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </>
  );
};

export default ProfileDropdown;
