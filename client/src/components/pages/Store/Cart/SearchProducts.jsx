import { useTranslations } from "next-intl";
import { Input, Button } from "@heroui/react";
import { Search } from "lucide-react";

export function SearchProducts() {
  const t = useTranslations("cart");
  return (
    <div className="flex flex-col">
      <Input
        className="mb-4"
        label={t("search.label")}
        placeholder={t("search.placeholder")}
        startContent={
          <Search width={20} height={20} />
        }
      />

      <div className="mb-4 flex flex-wrap gap-2">
        <Button
          color="primary"
          radius="full"
          size="sm"
        >
          {t("search.filterAll")}
        </Button>
        <Button
          className="bg-slate-100"
          radius="full"
          size="sm"
        >
          Electronica
        </Button>
        <Button
          className="bg-slate-100"
          radius="full"
          size="sm"
        >
          Accesorios
        </Button>
        <Button
          className="bg-slate-100"
          radius="full"
          size="sm"
        >
          Hardware Wallet
        </Button>
      </div>
    </div>
  );
};
