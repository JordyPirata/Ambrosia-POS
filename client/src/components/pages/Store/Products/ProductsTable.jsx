"use client";

import { useTranslations } from "next-intl";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Chip,
  Image
} from "@heroui/react";
import { Pencil, Trash } from 'lucide-react';

export function ProductsTable({ products, onEditProduct }) {
  const formatCurrency = (v) =>
  `$ ${v.toLocaleString("es-MX", { minimumFractionDigits: 2 })}`;
  const t = useTranslations("products");
  return(
    <section>
        <Table removeWrapper>
          <TableHeader>
            <TableColumn className="py-2 px-3">{t("image")}</TableColumn>
            <TableColumn className="py-2 px-3">{t("name")}</TableColumn>
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
                  <Image src={product.image} width={75}/>
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>
                  <Chip
                    className="bg-green-200 text-xs text-green-800 border border-green-300"
                  >
                    {product.category}
                  </Chip>
                </TableCell>
                <TableCell>{product.sku}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>
                  <Chip
                    className="bg-green-200 text-xs text-green-800 border border-green-300"
                  >
                    {product.stock}
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
