"use client";
import { Key, useCallback, useState } from "react";
import { Tooltip } from "@heroui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { Chip } from "@heroui/chip";
import { User } from "@heroui/user";
import {
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { useDisclosure } from "@heroui/modal";
import { useTranslations } from "next-intl";

import { useRouter } from "@/i18n/routing";
import ResetPasswordConfirmationModal from "@/components/reset-password-confirmation-modal";
import { UserDataType } from "@/types/dataTypes";
import { axiosInstance } from "@/utils/axiosInstance";

export const columns = [
  { name: "NAME", uid: "name" },
  { name: "ROLE", uid: "role" },
  { name: "STATUS", uid: "status" },
  { name: "ACTIONS", uid: "actions" },
];

export const users = [
  {
    id: 1,
    name: "Tony Reichert",
    role: "Admin",
    team: "Management",
    status: "active",
    age: "29",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    email: "tony.reichert@example.com",
  },
  {
    id: 2,
    name: "Zoey Lang",
    role: "User",
    team: "Development",
    status: "active",
    age: "25",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    email: "zoey.lang@example.com",
  },
  {
    id: 3,
    name: "Jane Fisher",
    role: "User",
    team: "Development",
    status: "active",
    age: "22",
    avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
    email: "jane.fisher@example.com",
  },
  {
    id: 4,
    name: "William Howard",
    role: "User",
    team: "Marketing",
    status: "active",
    age: "28",
    avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d",
    email: "william.howard@example.com",
  },
  {
    id: 5,
    name: "Kristen Copper",
    role: "User",
    team: "Sales",
    status: "active",
    age: "24",
    avatar: "https://i.pravatar.cc/150?u=a092581d4ef9026700d",
    email: "kristen.cooper@example.com",
  },
];

const statusColorMap = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};

export default function UsersTable({
  data,
  fetchData,
}: {
  data: UserDataType[];
  fetchData: () => void;
}) {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [selectedUserForResetPassword, setSelectedUserForResetPassword] =
    useState<string | null>(null);
  const t = useTranslations("AdminUsersPage");

  const handleResetPasswordClick = (id: string) => {
    if (id) {
      setSelectedUserForResetPassword(id);
      onOpen();
    }
  };

  const handleResetPassword = async () => {
    try {
      console.log(selectedUserForResetPassword);
      const res = await axiosInstance.put(
        `/users/reset-password/${selectedUserForResetPassword}`,
      );

      console.log(res);
      onClose();
    } catch (e) {
      console.log(e);
    }
  };

  const renderCell = useCallback((user: UserDataType, columnKey: Key) => {
    // @ts-ignore
    const cellValue = user[columnKey];

    switch (columnKey) {
      case "name":
        return (
          <User
            avatarProps={{ radius: "lg" }}
            description={user.email}
            name={user?.firstName + " " + user?.lastName}
          >
            {user.email}
          </User>
        );
      case "role":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">{cellValue}</p>
          </div>
        );
      case "status":
        return (
          <Chip
            className="capitalize"
            // @ts-ignore
            color={statusColorMap[user.status]}
            size="sm"
            variant="flat"
          >
            {cellValue}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content={t("tooltip.details")}>
              <span
                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                role="button"
                onClick={() => router.push(`/admin/users/${user._id}`)}
              >
                <EyeIcon height={20} width={20} />
              </span>
            </Tooltip>
            <Tooltip content={t("tooltip.resetPassword")}>
              <span
                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                role="button"
                onClick={() => handleResetPasswordClick(user._id)}
              >
                <PencilSquareIcon height={20} width={20} />
              </span>
            </Tooltip>
            <Tooltip color="danger" content={t("tooltip.delete")}>
              <span className="text-lg text-danger cursor-pointer active:opacity-50">
                <TrashIcon height={20} width={20} />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  return (
    <>
      <Table removeWrapper>
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
            >
              {t(`table.${column.name}`)}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={data}>
          {(item) => (
            <TableRow key={item._id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <ResetPasswordConfirmationModal
        isOpen={isOpen}
        onConfirm={handleResetPassword}
        onOpenChange={onOpenChange}
      />
    </>
  );
}
