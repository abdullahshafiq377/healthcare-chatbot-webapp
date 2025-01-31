"use client";
import { Key, useCallback } from "react";
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
import { EyeIcon, TrashIcon } from "@heroicons/react/24/solid";
import { useDisclosure } from "@heroui/modal";
import { useTranslations } from "next-intl";

import ViewReportModal from "@/components/view-report-modal";

export const columns = [
  { name: "TITLE", uid: "title" },
  { name: "REPORTED_BY", uid: "reportedBy" },
  { name: "STATUS", uid: "status" },
  { name: "ACTIONS", uid: "actions" },
];

export const users = [
  {
    id: 1,
    title: "Bug in updating profile image",
    name: "Tony Reichert",
    role: "Admin",
    team: "Management",
    status: "open",
    age: "29",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    email: "tony.reichert@example.com",
  },
  {
    id: 2,
    title: "Bug in updating profile image",
    name: "Zoey Lang",
    role: "User",
    team: "Development",
    status: "open",
    age: "25",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    email: "zoey.lang@example.com",
  },
  {
    id: 3,
    title: "Bug in updating profile image",
    name: "Jane Fisher",
    role: "User",
    team: "Development",
    status: "open",
    age: "22",
    avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
    email: "jane.fisher@example.com",
  },
  {
    id: 4,
    title: "Bug in updating profile image",
    name: "William Howard",
    role: "User",
    team: "Marketing",
    status: "resolved",
    age: "28",
    avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d",
    email: "william.howard@example.com",
  },
  {
    id: 5,
    title: "Bug in updating profile image",
    name: "Kristen Copper",
    role: "User",
    team: "Sales",
    status: "resolved",
    age: "24",
    avatar: "https://i.pravatar.cc/150?u=a092581d4ef9026700d",
    email: "kristen.cooper@example.com",
  },
];

const statusColorMap = {
  resolved: "success",
  open: "danger",
};

export default function ReportsTable() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const t = useTranslations("AdminReportsPage");

  const renderCell = useCallback((user: (typeof users)[0], columnKey: Key) => {
    // @ts-ignore
    const cellValue = user[columnKey];

    switch (columnKey) {
      case "title":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">{cellValue}</p>
          </div>
        );
      case "reportedBy":
        return (
          <User
            avatarProps={{ radius: "lg", src: user.avatar }}
            description={user.email}
            name={user.name}
          >
            {user.email}
          </User>
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
                onClick={onOpen}
              >
                <EyeIcon height={20} width={20} />
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
        <TableBody items={users}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <ViewReportModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </>
  );
}
