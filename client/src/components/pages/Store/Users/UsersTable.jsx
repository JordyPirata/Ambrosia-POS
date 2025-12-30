"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Chip,
} from "@heroui/react";
import { Pencil, Trash } from "lucide-react";
import { useTranslations } from "next-intl";

export function UsersTable({ users, onEditUser, onDeleteUser }) {
  const t = useTranslations("users");

  return (
    <section>
      <Table removeWrapper>
        <TableHeader>
          <TableColumn className="py-2 px-3">{t("name")}</TableColumn>
          <TableColumn className="py-2 px-3">{t("role")}</TableColumn>
          <TableColumn className="py-2 px-3">{t("email")}</TableColumn>
          <TableColumn className="py-2 px-3">{t("phone")}</TableColumn>
          <TableColumn className="py-2 px-3 text-right">{t("actions")}</TableColumn>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user.id}
            >
              <TableCell>{user.name}</TableCell>
              <TableCell>
                <Chip
                  className="bg-green-200 text-xs text-green-800 border border-green-300"
                >
                  {user.role}
                </Chip>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phone}</TableCell>
              <TableCell className="flex justify-end space-x-4 py-2 px-3">
                <Button
                  aria-label="Edit User"
                  isIconOnly
                  className="text-xs text-white bg-blue-500"
                  onPress={() => onEditUser(user)}
                >
                  <Pencil />
                </Button>
                <Button
                  aria-label="Delete User"
                  isIconOnly
                  color="danger"
                  className="text-xs text-white"
                  onPress={() => onDeleteUser(user)}
                >
                  <Trash />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}
