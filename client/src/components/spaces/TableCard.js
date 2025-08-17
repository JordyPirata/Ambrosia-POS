"use client";
import { useEffect, useState } from "react";
import { createOrder } from "../../modules/orders/ordersService";
import { updateTable } from "../../modules/spaces/spacesService";
import ConfirmationPopup from "../ConfirmationPopup";
import { useRouter } from "next/navigation";
import { Sofa } from "lucide-react";

export default function TableCard({ tableData }) {
  const router = useRouter();
  const [bgColor, setBgColor] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (tableData.status === "available") {
      setBgColor("bg-green-500");
    } else if (tableData.status === "occupied") {
      setBgColor("bg-red-500");
    }
  }, [tableData]);

  async function tableClicked() {
    if (tableData.status === "available") {
      setIsOpen(true);
    } else if (tableData.status === "occupied") {
      router.push(`/modify-order/${tableData.order_id}`);
    }
  }

  async function handleConfirm() {
    const orderResponse = await createOrder(tableData.id);
    if (orderResponse.id) {
      tableData.order_id = orderResponse.id;
      tableData.status = "occupied";
      await updateTable(tableData);
    }
    router.push(`/modify-order/${orderResponse.id}`);
  }

  return (
    <>
      <ConfirmationPopup
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleConfirm}
        title="Abrir Mesa"
        message="¿Estás seguro de abrir la mesa?"
        type="danger"
        confirmText="Si"
        cancelText="No"
      />
      <button
        onClick={tableClicked}
        className={`h-full w-[200px] min-w-[200px] border-2 border-gray-400 rounded-md flex flex-col items-center justify-center p-4 hover:bg-gray-100 transition-all text-center ${bgColor}`}
      >
        <Sofa />
        <span className="text-lg font-semibold">{tableData.name}</span>
      </button>
    </>
  );
}
