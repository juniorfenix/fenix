import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useAuth, s as supabase } from "./router-DHEQdz8j.mjs";
import { I as Input, B as Button } from "./input-CqozOQNs.mjs";
import { L as Label } from "./label-JU3yqRBo.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { F as Flame, E as EyeOff, g as Eye } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "./utils-H80jjgLf.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
function AuthPage() {
  const {
    user,
    loading: authLoading
  } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = reactExports.useState("signin");
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [showPassword, setShowPassword] = reactExports.useState(false);
  const [name, setName] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const {
      data: sub
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setMode("new_password");
    });
    if (typeof window !== "undefined" && window.location.hash.includes("type=recovery")) {
      setMode("new_password");
    }
    return () => sub.subscription.unsubscribe();
  }, []);
  reactExports.useEffect(() => {
    if (!authLoading && user && mode !== "new_password") navigate({
      to: "/app"
    });
  }, [user, authLoading, navigate, mode]);
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    const cleanEmail = email.trim().toLowerCase();
    try {
      if (mode === "signup") {
        const {
          error
        } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/app`,
            data: {
              display_name: name.trim()
            }
          }
        });
        if (error) throw error;
        toast.success("Conta criada! Confirme seu e-mail e entre para começar.");
        setMode("signin");
        setPassword("");
      } else if (mode === "reset") {
        const {
          error
        } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
          redirectTo: `${window.location.origin}/auth`
        });
        if (error) throw error;
        toast.success("Enviamos um link de redefinição para seu e-mail.");
        setMode("signin");
      } else if (mode === "new_password") {
        if (password.length < 6) {
          toast.error("A senha precisa ter ao menos 6 caracteres.");
          return;
        }
        const {
          error
        } = await supabase.auth.updateUser({
          password
        });
        if (error) throw error;
        toast.success("Senha atualizada. Bem-vindo de volta.");
        navigate({
          to: "/app"
        });
      } else {
        const {
          error
        } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password
        });
        if (error) throw error;
        toast.success("Bem-vindo de volta.");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao autenticar";
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  };
  const title = mode === "signin" ? "Bem-vindo de volta" : mode === "signup" ? "Comece a renascer" : mode === "new_password" ? "Definir nova senha" : "Recuperar acesso";
  const subtitle = mode === "signin" ? "Entre para continuar sua jornada." : mode === "signup" ? "Crie sua conta gratuita." : mode === "new_password" ? "Escolha uma nova senha para entrar." : "Enviaremos um link para redefinir sua senha.";
  return /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex min-h-screen items-center justify-center px-6 py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center justify-center gap-2 mb-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "h-6 w-6 text-primary", strokeWidth: 1.5 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-2xl", children: "Fênix" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-3xl p-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl text-center", children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-center text-sm text-muted-foreground", children: subtitle }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "mt-8 space-y-4", children: [
        mode === "signup" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "name", children: "Nome" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "name", value: name, onChange: (e) => setName(e.target.value), required: true, maxLength: 60 })
        ] }),
        mode !== "new_password" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "email", children: "E-mail" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "email", type: "email", autoComplete: "email", value: email, onChange: (e) => setEmail(e.target.value), required: true })
        ] }),
        mode !== "reset" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "password", children: mode === "new_password" ? "Nova senha" : "Senha" }),
            mode === "signin" && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setMode("reset"), className: "text-xs text-muted-foreground hover:text-primary transition", children: "Esqueci minha senha" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "password", type: showPassword ? "text" : "password", autoComplete: mode === "signup" || mode === "new_password" ? "new-password" : "current-password", value: password, onChange: (e) => setPassword(e.target.value), required: true, minLength: 6, className: "pr-10" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setShowPassword((s) => !s), className: "absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground", "aria-label": showPassword ? "Ocultar senha" : "Mostrar senha", children: showPassword ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: busy, className: "w-full h-12 bg-gradient-ember text-primary-foreground hover:opacity-90 shadow-ember", children: busy ? "Aguarde…" : mode === "signin" ? "Entrar" : mode === "signup" ? "Criar conta" : mode === "new_password" ? "Salvar nova senha" : "Enviar link" })
      ] }),
      mode !== "new_password" && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setMode(mode === "signin" ? "signup" : "signin"), className: "mt-6 w-full text-center text-sm text-muted-foreground hover:text-foreground", children: mode === "signin" ? "Não tem conta? Criar agora" : mode === "signup" ? "Já tem conta? Entrar" : "Voltar para o login" })
    ] })
  ] }) });
}
export {
  AuthPage as component
};
