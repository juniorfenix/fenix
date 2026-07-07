import { useEffect, useState, useCallback, useRef } from "react";

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
  /** Envia SKIP_WAITING ao novo SW e recarrega a página quando ele assumir o controle */
  applyUpdate: () => void;
}

export function usePwa(): PwaState {
  const [isStandalone, setIsStandalone] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const [swUpdated, setSwUpdated] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [pendingRegistration, setPendingRegistration] =
    useState<ServiceWorkerRegistration | null>(null);
  const reloadTriggeredRef = useRef(false);

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
    const onSwUpdateAvailable = (e: Event) => {
      const detail = (e as CustomEvent<{ registration?: ServiceWorkerRegistration }>).detail;
      setSwUpdated(true);
      if (detail?.registration) setPendingRegistration(detail.registration);
    };
    window.addEventListener("sw:update-available", onSwUpdateAvailable);

    // ── Mensagens do Service Worker ─────────────────────────────────────────
    // Reservado para push notifications e outros canais futuros do SW.
    const onMessage = (e: MessageEvent) => {
      if (e.data?.type === "SW_UPDATED") setSwUpdated(true);
    };
    navigator.serviceWorker?.addEventListener("message", onMessage);

    const onControllerChange = () => {
      if (reloadTriggeredRef.current) {
        window.location.reload();
      }
    };
    navigator.serviceWorker?.addEventListener("controllerchange", onControllerChange);

    return () => {
      mq.removeEventListener("change", checkStandalone);
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("sw:update-available", onSwUpdateAvailable);
      navigator.serviceWorker?.removeEventListener("message", onMessage);
      navigator.serviceWorker?.removeEventListener("controllerchange", onControllerChange);
    };
  }, []);

  const applyUpdate = useCallback(() => {
    if (!pendingRegistration?.waiting) return;
    reloadTriggeredRef.current = true;
    pendingRegistration.waiting.postMessage({ type: "SKIP_WAITING" });
  }, [pendingRegistration]);

  const triggerInstall = useCallback(async (): Promise<boolean> => {
    if (!deferredPrompt) return false;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setCanInstall(false);
    return outcome === "accepted";
  }, [deferredPrompt]);

  return { isStandalone, canInstall, swUpdated, triggerInstall, applyUpdate };
}
