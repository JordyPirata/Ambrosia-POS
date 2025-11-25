import { useState } from "react";
import { useTranslations } from "next-intl";
import { Input, Button } from "@heroui/react";
import { Search } from "lucide-react";
import { ProductList } from "./ProductList";

export function SearchProducts({ products, onAddProduct }) {
  const t = useTranslations("cart");

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState(null);

  const categories = Array.from(new Set(products.map((product) => product.category)))

  const filteredProducts = products.filter((product) => {
    const searchMatch = product.name.toLowerCase().includes(search.toLowerCase())
    const categoryMatch = !categoryFilter || product.category === categoryFilter;
    return searchMatch && categoryMatch && product.stock > 0
  });

  return (
    <div className="flex flex-col">
      <Input
        isClearable
        className="mb-4"
        label={t("search.label")}
        placeholder={t("search.placeholder")}
        startContent={
          <Search width={20} height={20} />
        }
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="mb-4 flex flex-wrap gap-2">
        <Button
          color="primary"
          radius="full"
          size="sm"
          onPress={() => setCategoryFilter(null)}
        >
          {t("search.filterAll")}
        </Button>
        { categories.map((category) => (
          <Button
            key={category}
            onPress={() => setCategoryFilter(category)}
            className="bg-slate-100"
            radius="full"
            size="sm"
          >
            {category}
          </Button>
        ))

        }
      </div>
      <ProductList products={filteredProducts} onAddProduct={onAddProduct}/>
    </div>
  );
};
