import { addToast } from "@heroui/react";

export const formatSats = (amount) => (new Intl.NumberFormat().format(amount));

export const copyToClipboard = async (text) => {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      addToast({
        title: "Copiado",
        description: "Texto copiado al portapapeles",
        variant: "solid",
        color: "success",
      });
    } catch (err) {
      console.error("Error al copiar con clipboard API", err);
      fallbackCopy(text);
    }
  } else {
    fallbackCopy(text);
  }
};

const fallbackCopy = (text) => {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  try {
    document.execCommand("copy");
    addToast({
      title: "Copiado",
      description: "Texto copiado al portapapeles",
      variant: "solid",
      color: "success",
    });
  } catch (err) {
    console.error("Fallback copy failed", err);
    addToast({
      title: "Error",
      description: "No se pudo copiar al portapapeles",
      variant: "solid",
      color: "danger",
    });
  }
  document.body.removeChild(textarea);
};
