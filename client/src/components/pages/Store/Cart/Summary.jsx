import { useTranslations } from "next-intl";
import { Button, Card, CardBody, CardFooter, CardHeader, Divider, NumberInput } from "@heroui/react";
import { Trash } from "lucide-react";

export function Summary({ cartItems }) {
  const t = useTranslations("cart");
  const formatCurrency = (v) => `$ ${v.toLocaleString("es-MX", { minimumFractionDigits: 2 })}`;
  const subtotal = cartItems.reduce((sum, item) => sum + item.total, 0);
  const discount = 0;
  const total = subtotal - discount;
  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold text-green-900">
          {t("summary.title")}
        </h2>
      </CardHeader>
      <CardBody>
        <div className="space-y-4">
        {cartItems.map((item) => (
          <Card key={item.id} className="shadow-none border-1 border-green-600">
            <CardHeader>
              <div className="flex flex-col">
                <h3 className="text-sm font-medium text-green-900">
                  {item.name}
                </h3>
                <div className="text-xs text-gray-700">
                  {formatCurrency(item.price)} c/u
                </div>
              </div>
              <Button
                aria-label="Remove Product"
                isIconOnly
                color="danger"
                className="text-xs text-white absolute right-5"
              >
                <Trash width={20} height={20}/>
              </Button>
            </CardHeader>
            <CardBody>
              <div className="flex items-center justify-between">
                <NumberInput
                  className="w-1/2"
                  defaultValue={1}
                  label="Amount"
                  minValue={0}
                  size="sm"
                  placeholder="Enter the amount"
                >
                  {item.qty}
                </NumberInput>
                <div className="text-sm font-semibold text-green-900">
                  {formatCurrency(item.total)}
                </div>
              </div>
            </CardBody>
          </Card>
        ))}

        <div className="space-y-2 text-sm text-gray-800">
          <div className="flex justify-between">
            <span>{t("summary.subtotal")}</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>{t("summary.discount")}</span>
            <span>{formatCurrency(discount)}</span>
          </div>
          <Divider className="bg-green-600"/>
          <div className="flex justify-between items-center font-semibold text-green-900">
            <span>{t("summary.total")}:</span>
            <span className="text-lg">{formatCurrency(total)}</span>
          </div>
        </div>
      </div>
      </CardBody>
      <CardFooter>
        <Button
          color="primary"
          className="w-full"
          size="lg"
        >
          {t("summary.pay")}
        </Button>
      </CardFooter>
    </Card>
  );
}
