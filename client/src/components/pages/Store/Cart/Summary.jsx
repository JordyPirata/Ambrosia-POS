import { useTranslations } from "next-intl";
import { Button, Card, CardBody, CardFooter, CardHeader, Divider, NumberInput } from "@heroui/react";
import { Trash } from "lucide-react";
import { useCurrency } from "@/components/hooks/useCurrency";

export function Summary({ cartItems, discount, onRemoveProduct, onUpdateQuantity }) {
  const t = useTranslations("cart");
  const subtotal = cartItems?.reduce((sum, item) => sum + item.subtotal, 0);
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount;
  const { formatAmount } = useCurrency();


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
                    {formatAmount(item.price)} c/u
                  </div>
                </div>
                <Button
                  aria-label="Remove Product"
                  isIconOnly
                  color="danger"
                  className="text-xs text-white absolute right-5"
                  onPress={() => onRemoveProduct(item.id)}
                >
                  <Trash width={20} height={20} />
                </Button>
              </CardHeader>
              <CardBody>
                <div className="flex items-center justify-between">
                  <NumberInput
                    className="w-1/2"
                    label={t("summary.quantity")}
                    minValue={1}
                    size="sm"
                    placeholder="Enter the amount"
                    value={item.quantity}
                    onChange={(value) => onUpdateQuantity(item.id, Number(value))}
                  />
                  <div className="text-sm font-semibold text-green-900">
                    {formatAmount(item.subtotal)}
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}

          <div className="space-y-2 text-sm text-gray-800">
            <div className="flex justify-between">
              <span>{t("summary.subtotal")}</span>
              <span>{formatAmount(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>{t("summary.discount")}</span>
              <span>{formatAmount(discountAmount)}</span>
            </div>
            <Divider className="bg-green-600" />
            <div className="flex justify-between items-center font-semibold text-green-900">
              <span>{t("summary.total")}:</span>
              <span className="text-lg">{formatAmount(total)}</span>
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
