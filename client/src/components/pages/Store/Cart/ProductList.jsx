import { useTranslations } from "next-intl";
import { Button, Card, CardBody, CardFooter, CardHeader, Chip } from "@heroui/react";

export function ProductList({ products, onAddProduct }) {
  const t = useTranslations("cart");
  const formatCurrency = (v) => `$ ${v.toLocaleString("es-MX", { minimumFractionDigits: 2 })}`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {products.map((product) => (
        <Card
          className="bg-white"
          key={product.id}
        >
          <CardHeader className="flex flex-col items-start">
            <h2 className="text-lg">{product.name}</h2>
            <p className="text-xs">{product.category}</p>
          </CardHeader>
          <CardBody>
            <h2 className="text-2xl font-bold text-green-800">
              {formatCurrency(product.price)}
            </h2>
            <p className="text-xs">
              SKU: <span className="text-gray-800">{product.sku}</span>
            </p>
          </CardBody>
          <CardFooter className="flex justify-between">
            <Chip
              color="secondary"
              size="sm"
            >
              {product.stock} {t("card.stock")}
            </Chip>
            <Button
              color="primary"
              size="sm"
              onPress={() => onAddProduct(product)}
            >
              {t("card.add")}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
