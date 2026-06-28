import { useEffect, useState, useCallback } from "react";

// O evento beforeinstallprompt não está nos tipos DOM padrão
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
  prompt(): Promise<void>;
}

interface PwaState {
  /** true quando rodando como app instalado (standalone) */
  isStandalone: boolean;
  /** true quando o Chrome Android disponibilizou o prompt de instalação */
  canInstall: boolean;
  /** true quando um novo Service Worker foi ativado (nova versão disponível) */
  swUpdated: boolean;
  /** Dispara o prompt nativo de instalação (Android Chrome) */
  triggerInstall: () => Promise<boolean>;
}

export function usePwa(): PwaState {
  const [isStandalone, setIsStandalone] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const [swUpdated, setSwUpdated] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // ── Detecção de standalone ──────────────────────────────────────────────
    // matchMedia cobre Android/Desktop; navigator.standalone cobre iOS Safari
    const mq = window.matchMedia("(display-mode: standalone)");
    const checkStandalone = () =>
      setIsStandalone(
        mq.matches ||
          (navigator as Navigator & { standalone?: boolean }).standalone === true
      );
    checkStandalone();
    mq.addEventListener("change", checkStandalone);

    // ── Prompt de instalação (Android Chrome) ───────────────────────────────
    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setCanInstall(true);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);

    // ── Nova versão disponível ──────────────────────────────────────────────
    // Disparado por __root.tsx quando um novo SW termina de instalar e aguarda.
    const onSwUpdateAvailable = () => setSwUpdated(true);
    window.addEventListener("sw:update-available", onSwUpdateAvailable);

    // ── Mensagens do Service Worker ─────────────────────────────────────────
    // Reservado para push notifications e outros canais futuros do SW.
    const onMessage = (e: MessageEvent) => {
      if (e.data?.type === "SW_UPDATED") setSwUpdated(true);
    };
    navigator.serviceWorker?.addEventListener("message", onMessage);

    return () => {
      mq.removeEventListener("change", checkStandalone);
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("sw:update-available", onSwUpdateAvailable);
      navigator.serviceWorker?.removeEventListener("message", onMessage);
    };
  }, []);

  const triggerInstall = useCallback(async (): Promise<boolean> => {
    if (!deferredPrompt) return false;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setCanInstall(false);
    return outcome === "accepted";
  }, [deferredPrompt]);

  return { isStandalone, canInstall, swUpdated, triggerInstall };
}
