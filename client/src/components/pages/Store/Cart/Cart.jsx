  "use client";
  import { useState } from "react";
  import { useTranslations } from "next-intl";
  import { StoreLayout } from "../StoreLayout";
  import { SearchProducts } from "./SearchProducts";
  import { Summary } from "./Summary";

  const PRODUCTS = [
    {
      id: 1,
      name: "M5 Stickplus 2",
      category: "Electronica",
      price: 600,
      stock: 9,
      sku: "m5-stickplus-2",
    },
    {
      id: 2,
      name: "Jade Wallet",
      category: "Hardware Wallet",
      price: 1600,
      stock: 18,
      sku: "jade-wallet",
    },
    {
      id: 3,
      name: "Jade Plus",
      category: "Hardware Wallet",
      price: 4000,
      stock: 19,
      sku: "jade-plus-wallet",
    },
  ];

  const CART_ITEMS = [
    {
      id: 1,
      name: "M5 Stickplus 2",
      price: 600,
      quantity: 2,
      subtotal: 1200,
    },
    {
      id: 2,
      name: "Jade Wallet",
      price: 1600,
      quantity: 1,
      subtotal: 1600,
    },
  ];

  export function Cart() {
    const t = useTranslations("cart");
    const [cart, setCart] = useState(CART_ITEMS);
    const [discount, setDiscount] = useState(0);

    const addProduct = (product) => {
      const itemExist = cart.find((item) => item.id === product.id);

      if (itemExist) {
        setCart(
          cart.map((item) =>
            item.id === product.id
              ? {
                ...item,
                quantity: item.quantity + 1,
                subtotal: (item.quantity + 1) * item.price,
              }
              : item,
          )
        )
      } else {
        setCart([
          ...cart,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            subtotal: product.price,
          }
        ])
      }
    };

    const updateQuantity = (id, quantity) => {
      if (quantity <= 0) {
        removeProduct(id);
        return;
      }
      setCart(
        cart.map((item) =>
          item.id === id
            ? {
              ...item,
              quantity,
              subtotal: quantity * item.price,
            }
            : item,
        ),
      )
    }

    const removeProduct = (id) => {
      setCart(cart.filter((item) => item.id !== id));
    }

    return (
      <StoreLayout>
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-semibold text-green-800">{t("title")}</h1>
            <p className=" text-gray-800 mt-4">
              {t("subtitle")}
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2">
            <SearchProducts products={PRODUCTS} onAddProduct={addProduct} />
          </section>
          <Summary
            cartItems={cart}
            discount={discount}
            setDiscount={setDiscount}
            setCart={setCart}
            onRemoveProduct={removeProduct}
            onUpdateQuantity={updateQuantity}
          />
        </div>
      </StoreLayout>
    );
  }
