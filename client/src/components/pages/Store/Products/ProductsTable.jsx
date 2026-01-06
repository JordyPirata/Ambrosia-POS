"use client";
import { useMemo } from "react";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Chip,
  Image,
} from "@heroui/react";
import { Pencil, Trash } from "lucide-react";
import { useTranslations } from "next-intl";

import { useCurrency } from "@/components/hooks/useCurrency";
import { storedAssetUrl } from "@/components/utils/storedAssetUrl";

export function ProductsTable({ products, categories = [], onEditProduct, onDeleteProduct }) {
  const t = useTranslations("products");
  const { formatAmount } = useCurrency();
  const categoryNameById = useMemo(() => categories.reduce((map, category) => {
    const categoryId = String(category.id);
    map[categoryId] = category.name;
    return map;
  }, {})
  , [categories]);

  return (
    <section>
      <Table removeWrapper>
        <TableHeader>
          <TableColumn className="py-2 px-3">{t("image")}</TableColumn>
          <TableColumn className="py-2 px-3">{t("name")}</TableColumn>
          <TableColumn className="py-2 px-3">{t("description")}</TableColumn>
          <TableColumn className="py-2 px-3">{t("category")}</TableColumn>
          <TableColumn className="py-2 px-3">{t("sku")}</TableColumn>
          <TableColumn className="py-2 px-3">{t("price")}</TableColumn>
          <TableColumn className="py-2 px-3">{t("stock")}</TableColumn>
          <TableColumn className="py-2 px-3 text-right">{t("actions")}</TableColumn>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.sku}>
              <TableCell>
                <Image src={storedAssetUrl(product?.image_url)} width={75} alt={product.name} />
              </TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>
                <div className="truncate w-48">
                  {product.description}
                </div>
              </TableCell>
              <TableCell>
                <Chip
                  className="bg-green-200 text-xs text-green-800 border border-green-300"
                >
                  {categoryNameById[String(product.category_id)] ?? product.category_id}
                </Chip>
              </TableCell>
              <TableCell>{product.SKU}</TableCell>
              <TableCell>{formatAmount(product.price_cents)}</TableCell>
              <TableCell>
                <Chip
                  className="bg-green-200 text-xs text-green-800 border border-green-300"
                >
                  {product.quantity}
                </Chip>
              </TableCell>
              <TableCell>
                <div className="flex justify-end space-x-4 py-2 px-3">
                  <Button
                    aria-label="Edit Product"
                    isIconOnly
                    className="text-xs text-white bg-blue-500"
                    onPress={() => onEditProduct(product)}
                  >
                    <Pencil />
                  </Button>
                  <Button
                    aria-label="Delete Product"
                    isIconOnly
                    color="danger"
                    className="text-xs text-white"
                    onPress={() => onDeleteProduct(product)}
                  >
                    <Trash />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}
