import { useEffect } from "react";
import { toast } from "sonner";
import { usePwa } from "@/hooks/use-pwa";

const TOAST_ID = "pwa-update-available";

export function PwaUpdateToast() {
  const { swUpdated, applyUpdate } = usePwa();

  useEffect(() => {
    if (!swUpdated) return;

    toast("Nova versão disponível", {
      id: TOAST_ID,
      description: "Atualize para ter as últimas melhorias e correções.",
      duration: Infinity,
      action: {
        label: "Atualizar agora",
        onClick: applyUpdate,
      },
    });
  }, [swUpdated, applyUpdate]);

  return null;
}
