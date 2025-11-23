"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@heroui/react";
import { StoreLayout } from "../StoreLayout";
import { UsersTable } from "./UsersTable";
import { AddUsersModal } from "./AddUsersModal";
import { EditUsersModal } from "./EditUsersModal";
import { DeleteUsersModal } from "./DeleteUsersModal";
import { useUsers } from "./../hooks/useUsers";
import { useRoles } from "./../hooks/useRoles";


export function Users() {

  const [addUsersShowModal, setAddUsersShowModal] = useState(false);
  const [editUsersShowModal, setEditUsersShowModal] = useState(false);
  const [deleteUsersShowModal, setDeleteUsersShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const { users, updateUser, addUser, deleteUser } = useUsers();
  const { roles } = useRoles();

  const [data, setData] = useState({
    userId: "",
    userName: "",
    userPin: "",
    userPhone: "",
    userEmail: "",
    userRole: "",
  })

  const handleEditUser = (user) => {
    setSelectedUser(user);

    setData({
      userId: user.id,
      userName: user.name ?? "",
      userPin: "",
      userPhone: user.phone ?? "",
      userEmail: user.email ?? "",
      userRole: user.role_id ?? "",
    });

    setEditUsersShowModal(true);
  };

  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setDeleteUsersShowModal(true);
  };

  const handleDataChange = (newData) => {
    setData((prev) => ({ ...prev, ...newData }))
  }

  const t = useTranslations("users");

  useEffect(() => {
    if (!data.userRole && roles.length > 0) {
      setData((prev) => ({ ...prev, userRole: roles[0].id }));
    }
  }, [roles]);

  return (
    <StoreLayout>
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-4xl font-semibold text-green-900">{t("title")}</h1>
          <p className="text-gray-800 mt-4">
            {t("subtitle")}
          </p>
        </div>
        <Button
          color="primary"
          className="bg-green-800"
          onPress={() => {
            setData({
              userId: "",
              userName: "",
              userPin: "",
              userPhone: "",
              userEmail: "",
              userRole: roles?.[0]?.id || "",
            });
            setAddUsersShowModal(true)
          }}
        >
          {t("addUser")}
        </Button>
      </header>
      <div className="bg-white rounded-lg shadow-lg p-8">
        <UsersTable
          users={users}
          onEditUser={handleEditUser}
          onDeleteUser={handleDeleteUser}
        />
      </div>
      {addUsersShowModal && (
        <AddUsersModal
          data={data}
          setData={setData}
          roles={roles}
          addUser={addUser}
          onChange={handleDataChange}
          addUsersShowModal={addUsersShowModal}
          setAddUsersShowModal={setAddUsersShowModal}
        />
      )}
      {editUsersShowModal && (
        <EditUsersModal
          data={data}
          setData={setData}
          roles={roles}
          user={selectedUser}
          updateUser={updateUser}
          onChange={handleDataChange}
          editUsersShowModal={editUsersShowModal}
          setEditUsersShowModal={setEditUsersShowModal}
        />
      )}
      {deleteUsersShowModal && (
        <DeleteUsersModal
          user={userToDelete}
          deleteUsersShowModal={deleteUsersShowModal}
          setDeleteUsersShowModal={setDeleteUsersShowModal}
          onConfirm={async () => {
            if (userToDelete?.id) {
              await deleteUser(userToDelete.id);
            }
            setDeleteUsersShowModal(false);
          }}
        />
      )}
    </StoreLayout>
  );
}
