"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Button, Card, CardBody, CardFooter, CardHeader, Select, SelectItem } from "@heroui/react";
import { StoreLayout } from "../StoreLayout";
import { EditSettingsModal } from "./EditSettingsModal";
import { useConfigurations } from "../../../../providers/configurations/configurationsProvider";
import Image from "next/image";
import { storedAssetUrl } from "../../../utils/storedAssetUrl";
import { useCurrency } from "../../../hooks/useCurrency";
import { CURRENCIES_ES } from "../../Onboarding/utils/currencies_es";
import { CURRENCIES_EN } from "../../Onboarding/utils/currencies_en";
import { LanguageSwitcher } from "../../../../i18n/I18nProvider";

export function Settings() {
  const { config } = useConfigurations();
  const [data, setData] = useState(config);
  const [CURRENCIES, setCURRENCIES] = useState(CURRENCIES_ES);
  const [editSettingsShowModal, setEditSettingsModal] = useState(false);
  const t = useTranslations("settings");
  const locale = useLocale();
  const { currency } = useCurrency();

  const handleDataChange = (newData) => {
    setData((prev) => ({ ...prev, ...newData }))
  }

  const srcLogo = storedAssetUrl(data?.businessLogoUrl);

  useEffect(() => {
    if (locale === "en") {
      setCURRENCIES(CURRENCIES_EN);
    } else {
      setCURRENCIES(CURRENCIES_ES);
    }
  }, [locale]);

  const getCurrentCurrency = () => {
    const currentCurrency = CURRENCIES.find((el) => el.code === currency.acronym);
    return currentCurrency.name;
  };

  console.log(locale);

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

      <Card className="rounded-lg mb-6 p-6">
        <CardHeader className="flex flex-col items-start">
          <h2 className="text-2xl font-semibold text-green-900">
            {t("cardInfo.title")}
          </h2>
        </CardHeader>

        <CardBody>
          <div className="flex flex-col max-w-2xl ">
            <div className="flex items-start justify-between my-2">
              <div className="w-1/2">
                <div className="font-semibold text-gray-600">{t("cardInfo.name")}</div>
                <div className="text-xl mt-0.5 font-medium text-green-800">{data.businessName}</div>
              </div>

              <div className="w-1/2">
                <div className="font-semibold text-gray-600">{t("cardInfo.rfc")}</div>
                <div className="text-xl mt-0.5 font-medium text-green-800">{data.businessTaxId}</div>
              </div>

            </div>

            <div className="flex items-start justify-between my-2">
              <div className="w-1/2">
                <div className="font-semibold text-gray-600">
                  {t("cardInfo.description")}
                </div>
                <div className="text-xl mt-0.5 font-medium text-green-800">
                  {data.businessDescription ? data.businessDescription : 'Agrega la descripcion de tu negocio en editar.'}
                </div>
              </div>

              <div className="w-1/2">
                <div className="font-semibold text-gray-600">{t("cardInfo.address")}</div>
                <div className="text-xl mt-0.5 font-medium text-green-800">{data.businessAddress}</div>
              </div>
            </div>

            <div className="flex items-start justify-between my-2">
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

            <div className="w-1/2">
              <div className="font-semibold text-gray-600 mb-2">{t("cardInfo.logo")}</div>
              {srcLogo &&
                <Image
                  src={srcLogo}
                  width={200}
                  height={0}
                  alt="Logo"
                />}
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

      <Card className="rounded-lg mb-6 p-6">
        <CardHeader className="flex flex-col items-start">
          <h2 className="text-2xl font-semibold text-green-900">
            {t("cardCurrency.title")}
          </h2>
        </CardHeader>

        <CardBody>
          <div className="flex flex-col max-w-2xl max-w-2x">
            <div className="flex items-start justify-between my-2">
              <div className="w-1/2">
                <div className="font-semibold text-gray-600">{t("cardInfo.name")}</div>
                <div className="text-xl mt-0.5 font-medium text-green-800">{currency.acronym}</div>
              </div>

              <Select
                label={t("cardCurrency.currencyLabel")}
                defaultSelectedKeys={[getCurrentCurrency()]}
                value={data.businessCurrency}
                onChange={(e) => handleDataChange({ ...data, businessCurrency: e.target.value })}
              >
                {CURRENCIES.map((currency) => (
                  <SelectItem key={currency.name}>
                    {currency.name}
                  </SelectItem>
                ))}
              </Select>

            </div>

          </div>
        </CardBody>
      </Card>

      <Card className="rounded-lg mb-6 p-6">
        <CardHeader className="flex flex-col items-start">
          <h2 className="text-2xl font-semibold text-green-900">
            {t("cardLanguage.title")}
          </h2>
        </CardHeader>

        <CardBody>
          <div className="flex flex-col max-w-2xl max-w-2x">
            <div className="flex items-start justify-between my-2">
              <div className="w-1/2">
                <div className="font-semibold text-gray-600">{t("cardInfo.name")}</div>
                <div className="text-xl mt-0.5 font-medium text-green-800">{locale}</div>
              </div>

              <LanguageSwitcher />

            </div>

          </div>
        </CardBody>
      </Card>

      {editSettingsShowModal &&
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
