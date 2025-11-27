"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button, Card, CardBody, CardFooter, CardHeader } from "@heroui/react";
import { StoreLayout } from "../StoreLayout";
import { EditSettingsModal } from "./EditSettingsModal";

const settings = {
  businessName: "LSS Restaurant",
  businessRFC: "GASE23432",
  businessDescription: "Restaurante de comida típica mexicana.",
  businessAddress: "Galeana #286",
  businessEmail: "contacto@lssrestaurant.com",
  businessPhone: "44313244566"
}

export function Settings() {
  const [data, setData] = useState(settings);
  const [editSettingsShowModal, setEditSettingsModal] = useState(false);
  const t = useTranslations("settings");

  const handleDataChange = (newData) => {
    setData((prev) => ({ ...prev, ...newData }))
  }

  return (
    <StoreLayout>
      <header className="mb-6">
        <h1 className="text-4xl font-semibold text-green-900">
          {t("title")}
        </h1>
        <p className="text-gray-800 mt-4">
          {t("subtitle")}
        </p>
      </header>

      <Card className="rounded-lg">
        <CardHeader className="flex flex-col items-start">
          <h2 className="text-2xl font-semibold text-green-900">
            {t("cardInfo.title")}
          </h2>
          <p className="text-gray-600">
            {t("cardInfo.subtitle")}
          </p>
        </CardHeader>

        <CardBody>
          <div className="flex flex-col max-w-2xl ">
            <div className="flex items-center justify-between my-2">
              <div className="w-1/2">
                <div className="font-semibold text-gray-600">{t("cardInfo.name")}</div>
                <div className="text-xl mt-0.5 font-medium text-green-800">{data.businessName}</div>
              </div>

              <div className="w-1/2">
                <div className="font-semibold text-gray-600">{t("cardInfo.rfc")}</div>
                <div className="text-xl mt-0.5 font-medium text-green-800">{data.businessRFC}</div>
              </div>

            </div>

            <div className="flex items-center justify-between my-2">
              <div className="w-1/2">
                <div className="font-semibold text-gray-600">
                  {t("cardInfo.description")}
                </div>
                <div className="text-xl mt-0.5 font-medium text-green-800">
                  {data.businessDescription}
                </div>
              </div>

              <div className="w-1/2">
                <div className="font-semibold text-gray-600">{t("cardInfo.address")}</div>
                <div className="text-xl mt-0.5 font-medium text-green-800">{data.businessAddress}</div>
              </div>
            </div>

            <div className="flex items-center justify-between my-2">
              <div className="w-1/2">
                <div className="font-semibold text-gray-600">{t("cardInfo.email")}</div>
                <div className="text-xl mt-0.5 font-medium text-green-800">
                  {data.businessEmail}
                </div>
              </div>

              <div className="w-1/2">
                <div className="font-semibold text-gray-600">{t("cardInfo.phone")}</div>
                <div className="text-xl mt-0.5 font-medium text-green-800">{data.businessPhone}</div>
              </div>
            </div>
          </div>
        </CardBody>
        <CardFooter>
          <Button
            color="primary"
            onPress={() => setEditSettingsModal(true)}
          >
            Editar Información
          </Button>
        </CardFooter>
      </Card>
      { editSettingsShowModal &&
        <EditSettingsModal
          data={data}
          setData={setData}
          onChange={handleDataChange}
          editSettingsShowModal={editSettingsShowModal}
          setEditSettingsShowModal={setEditSettingsModal}
        />
      }
    </StoreLayout>
  );
}
