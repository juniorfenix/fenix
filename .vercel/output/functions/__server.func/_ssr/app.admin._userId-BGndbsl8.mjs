import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as useQuery, u as useQueryClient, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { b as Route, u as useAuth, s as supabase } from "./router-DHEQdz8j.mjs";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./card-DK4TJU2r.mjs";
import { B as Button, I as Input } from "./input-CqozOQNs.mjs";
import { T as Textarea } from "./textarea-DSyJ1nlY.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { M as MEAL_KEYS, a as MEAL_LABELS, C as CATEGORIA_LABELS } from "./substituicao-DzIb7esG.mjs";
import { A as AlertasTrocas } from "./alertas-trocas-DGTybFI8.mjs";
import { A as ArrowLeft, ah as Download, l as ClipboardList, G as Save, P as Plus, af as Trash2, f as Search } from "../_libs/lucide-react.mjs";
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
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/tslib.mjs";
import "../_libs/supabase__functions-js.mjs";
import "./utils-H80jjgLf.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
function ProtocoloEditor({ userId }) {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["protocolo_admin", userId],
    queryFn: async () => {
      const { data: prot } = await supabase.from("protocolos_prescritos").select("id,meta_kcal,meta_proteinas,meta_carboidratos,meta_gorduras,observacoes").eq("user_id", userId).maybeSingle();
      let itens = [];
      if (prot) {
        const res = await supabase.from("protocolo_itens").select(
          "id,refeicao,alimento_id,gramas,ordem,alimento:alimentos_padrao(id,nome,categoria,porcao_referencia_g,calorias,proteinas,carboidratos,gorduras)"
        ).eq("protocolo_id", prot.id).order("ordem", { ascending: true });
        itens = res.data ?? [];
      }
      return { protocolo: prot, itens };
    }
  });
  const { data: alimentos = [] } = useQuery({
    queryKey: ["alimentos_padrao_all"],
    staleTime: 5 * 60 * 1e3,
    queryFn: async () => {
      const { data: data2, error } = await supabase.from("alimentos_padrao").select("id,nome,categoria,porcao_referencia_g,calorias,proteinas,carboidratos,gorduras").eq("ativo", true).order("nome", { ascending: true }).limit(500);
      if (error) throw error;
      return data2 ?? [];
    }
  });
  const [metas, setMetas] = reactExports.useState(null);
  const protocolo = data?.protocolo;
  const formInit = reactExports.useMemo(
    () => protocolo ? {
      meta_kcal: String(protocolo.meta_kcal ?? 0),
      meta_proteinas: String(protocolo.meta_proteinas ?? 0),
      meta_carboidratos: String(protocolo.meta_carboidratos ?? 0),
      meta_gorduras: String(protocolo.meta_gorduras ?? 0),
      observacoes: protocolo.observacoes ?? ""
    } : { meta_kcal: "", meta_proteinas: "", meta_carboidratos: "", meta_gorduras: "", observacoes: "" },
    [protocolo]
  );
  const form = metas ?? formInit;
  reactExports.useEffect(() => {
    setMetas(null);
  }, [userId]);
  const saveMetas = useMutation({
    mutationFn: async () => {
      const payload = {
        user_id: userId,
        meta_kcal: parseInt(form.meta_kcal || "0", 10),
        meta_proteinas: parseFloat(form.meta_proteinas || "0"),
        meta_carboidratos: parseFloat(form.meta_carboidratos || "0"),
        meta_gorduras: parseFloat(form.meta_gorduras || "0"),
        observacoes: form.observacoes.trim() || null
      };
      const { error } = await supabase.from("protocolos_prescritos").upsert(payload, { onConflict: "user_id" });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Metas salvas.");
      qc.invalidateQueries({ queryKey: ["protocolo_admin", userId] });
      qc.invalidateQueries({ queryKey: ["protocolo_aluno", userId] });
    },
    onError: (e) => toast.error(e.message ?? "Erro ao salvar.")
  });
  const addItem = useMutation({
    mutationFn: async (input) => {
      let protId = protocolo?.id;
      if (!protId) {
        const { data: existing } = await supabase.from("protocolos_prescritos").select("id").eq("user_id", userId).maybeSingle();
        if (existing?.id) {
          protId = existing.id;
        } else {
          const { data: created, error } = await supabase.from("protocolos_prescritos").insert({ user_id: userId }).select("id").single();
          if (error) throw error;
          protId = created.id;
        }
      }
      const ordem = (data?.itens ?? []).filter((i) => i.refeicao === input.refeicao).length;
      const { error: ie } = await supabase.from("protocolo_itens").insert({
        protocolo_id: protId,
        refeicao: input.refeicao,
        alimento_id: input.alimento_id,
        gramas: input.gramas,
        ordem
      });
      if (ie) throw ie;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["protocolo_admin", userId] });
      qc.invalidateQueries({ queryKey: ["protocolo_aluno", userId] });
    },
    onError: (e) => toast.error(e.message ?? "Erro ao adicionar item.")
  });
  const delItem = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("protocolo_itens").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["protocolo_admin", userId] });
      qc.invalidateQueries({ queryKey: ["protocolo_aluno", userId] });
    }
  });
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-6 text-sm text-muted-foreground", children: "Carregando protocolo…" }) });
  }
  const itensPorRefeicao = (data?.itens ?? []).reduce((acc, it) => {
    (acc[it.refeicao] ??= []).push(it);
    return acc;
  }, {});
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-base", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { className: "h-4 w-4 text-primary" }),
      " Protocolo Prescrito"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 sm:grid-cols-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Kcal", value: form.meta_kcal, onChange: (v) => setMetas({ ...form, meta_kcal: v }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Proteínas (g)", value: form.meta_proteinas, onChange: (v) => setMetas({ ...form, meta_proteinas: v }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Carbo (g)", value: form.meta_carboidratos, onChange: (v) => setMetas({ ...form, meta_carboidratos: v }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Gord. (g)", value: form.meta_gorduras, onChange: (v) => setMetas({ ...form, meta_gorduras: v }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-1 text-xs text-muted-foreground", children: "Observações" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Textarea,
          {
            value: form.observacoes,
            onChange: (e) => setMetas({ ...form, observacoes: e.target.value }),
            placeholder: "Notas para o aluno (opcional)…",
            className: "min-h-[60px]"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          onClick: () => saveMetas.mutate(),
          disabled: saveMetas.isPending,
          className: "bg-gradient-ember text-primary-foreground",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-4 w-4" }),
            " ",
            saveMetas.isPending ? "Salvando…" : "Salvar metas"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 pt-2", children: MEAL_KEYS.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        RefeicaoBloco,
        {
          refeicao: m,
          itens: itensPorRefeicao[m] ?? [],
          alimentos,
          onAdd: (alimento_id, gramas) => addItem.mutate({ refeicao: m, alimento_id, gramas }),
          onDelete: (id) => delItem.mutate(id)
        },
        m
      )) })
    ] })
  ] });
}
function Field({
  label,
  value,
  onChange
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-1 text-xs text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Input,
      {
        type: "number",
        inputMode: "decimal",
        value,
        onChange: (e) => onChange(e.target.value)
      }
    )
  ] });
}
function RefeicaoBloco({
  refeicao,
  itens,
  alimentos,
  onAdd,
  onDelete
}) {
  const [adding, setAdding] = reactExports.useState(false);
  const [q, setQ] = reactExports.useState("");
  const [picked, setPicked] = reactExports.useState(null);
  const [gramas, setGramas] = reactExports.useState("100");
  const filtered = reactExports.useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return alimentos.slice(0, 30);
    return alimentos.filter((a) => a.nome.toLowerCase().includes(t)).slice(0, 30);
  }, [q, alimentos]);
  const submit = () => {
    const g = parseFloat(gramas);
    if (!picked || !Number.isFinite(g) || g <= 0) {
      toast.error("Escolha um alimento e informe os gramas.");
      return;
    }
    onAdd(picked.id, g);
    setPicked(null);
    setGramas("100");
    setQ("");
    setAdding(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card/30 p-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] uppercase tracking-widest text-muted-foreground", children: MEAL_LABELS[refeicao] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "ghost", onClick: () => setAdding((s) => !s), className: "h-7 gap-1 text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3 w-3" }),
        " Adicionar"
      ] })
    ] }),
    itens.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-xs text-muted-foreground", children: "Nenhum item." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-2 space-y-1.5", children: itens.map((it) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "li",
      {
        className: "flex items-center justify-between gap-2 border-b border-border/40 pb-1.5 last:border-0",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate text-sm font-medium", children: it.alimento.nome }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-muted-foreground", children: [
              CATEGORIA_LABELS[it.alimento.categoria] ?? it.alimento.categoria,
              " · ",
              it.gramas,
              " g"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "icon",
              variant: "ghost",
              onClick: () => onDelete(it.id),
              className: "h-7 w-7 text-muted-foreground hover:text-destructive",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
            }
          )
        ]
      },
      it.id
    )) }),
    adding && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 space-y-2 rounded-lg border border-dashed border-border p-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            value: q,
            onChange: (e) => setQ(e.target.value),
            placeholder: "Buscar alimento…",
            className: "pl-8 h-9"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-40 overflow-y-auto rounded-md border border-border/60", children: filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 text-xs text-muted-foreground", children: "Nenhum alimento." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y divide-border/40 text-sm", children: filtered.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => setPicked(a),
          className: `flex w-full items-center justify-between px-2 py-1.5 text-left ${picked?.id === a.id ? "bg-primary/10 text-primary" : "hover:bg-secondary/40"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: a.nome }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: CATEGORIA_LABELS[a.categoria] ?? a.categoria })
          ]
        }
      ) }, a.id)) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            type: "number",
            inputMode: "decimal",
            value: gramas,
            onChange: (e) => setGramas(e.target.value),
            placeholder: "gramas",
            className: "h-9"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", onClick: submit, children: "Adicionar" })
      ] })
    ] })
  ] });
}
function AdminAlunoDetalhe() {
  const {
    userId
  } = Route.useParams();
  const {
    user,
    loading
  } = useAuth();
  const navigate = useNavigate();
  const {
    data: isAdmin,
    isLoading: roleLoading
  } = useQuery({
    queryKey: ["is-admin", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const {
        data: data2
      } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
      return !!data2;
    }
  });
  reactExports.useEffect(() => {
    if (loading || roleLoading) return;
    if (!user || isAdmin === false) navigate({
      to: "/app"
    });
  }, [user, isAdmin, loading, roleLoading, navigate]);
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["admin-aluno", userId],
    enabled: !!isAdmin,
    queryFn: async () => {
      const [profile2, weights2, diario2, alimentar2, metas, hidrat2, prefs2] = await Promise.all([supabase.from("profiles").select("*").eq("id", userId).maybeSingle(), supabase.from("weight_logs").select("logged_date,weight").eq("user_id", userId).order("logged_date", {
        ascending: false
      }), supabase.from("diario_registro").select("registrado_em,pergunta,resposta,humor").eq("user_id", userId).order("registrado_em", {
        ascending: false
      }).limit(200), supabase.from("diario_alimentar").select("data,refeicao,nome,calorias,proteinas,carboidratos,gorduras").eq("user_id", userId).order("data", {
        ascending: false
      }).limit(300), supabase.from("metas_usuario").select("objetivo_ativo").eq("user_id", userId).maybeSingle(), supabase.from("hidratacao_diaria").select("data,copos").eq("user_id", userId).order("data", {
        ascending: false
      }).limit(60), supabase.from("preferencias_alimentares").select("essenciais,detestados,estilo_refeicao,restricoes").eq("user_id", userId).maybeSingle()]);
      return {
        profile: profile2.data,
        weights: weights2.data ?? [],
        diario: diario2.data ?? [],
        alimentar: alimentar2.data ?? [],
        objetivo: metas.data?.objetivo_ativo ?? null,
        hidrat: hidrat2.data ?? [],
        prefs: prefs2.data ?? null
      };
    }
  });
  if (loading || roleLoading || !isAdmin) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 text-sm text-muted-foreground", children: "Verificando acesso…" });
  }
  if (isLoading || !data) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 text-sm text-muted-foreground", children: "Carregando…" });
  const {
    profile,
    weights,
    diario,
    alimentar,
    objetivo,
    hidrat,
    prefs
  } = data;
  const exportFull = () => {
    const sections = [];
    sections.push(["Aluno", profile?.display_name ?? "—"]);
    sections.push(["Objetivo", objetivo ?? "—"]);
    sections.push(["Peso atual (kg)", profile?.current_weight ?? "—"]);
    sections.push(["Meta (kg)", profile?.goal_weight ?? "—"]);
    sections.push(["Altura (cm)", profile?.height ?? "—"]);
    sections.push([]);
    sections.push(["=== Histórico de Peso ==="]);
    sections.push(["Data", "Peso (kg)"]);
    weights.forEach((w) => sections.push([w.logged_date, Number(w.weight)]));
    sections.push([]);
    sections.push(["=== Diário Alimentar ==="]);
    sections.push(["Data", "Refeição", "Item", "Kcal", "Prot", "Carb", "Gord"]);
    alimentar.forEach((m) => sections.push([m.data, m.refeicao ?? "", m.nome, m.calorias, m.proteinas, m.carboidratos, m.gorduras]));
    sections.push([]);
    sections.push(["=== Reflexões ==="]);
    sections.push(["Data", "Humor", "Pergunta", "Resposta"]);
    diario.forEach((d) => sections.push([d.registrado_em, d.humor ?? "", d.pergunta, d.resposta ?? ""]));
    sections.push([]);
    sections.push(["=== Hidratação ==="]);
    sections.push(["Data", "Copos"]);
    hidrat.forEach((h) => sections.push([h.data, h.copos]));
    downloadCSV(`aluno-${(profile?.display_name ?? userId).replace(/\s+/g, "_")}.csv`, sections);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container max-w-5xl px-4 py-6 space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/admin", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
        " Voltar"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: exportFull, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4" }),
        " Exportar tudo (CSV)"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: profile?.display_name ?? "Aluno" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { label: "Peso atual", value: `${profile?.current_weight ?? "—"} kg` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { label: "Meta", value: `${profile?.goal_weight ?? "—"} kg` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { label: "Altura", value: `${profile?.height ?? "—"} cm` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { label: "Idade", value: `${profile?.age ?? "—"}` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { label: "Gênero", value: profile?.gender === "male" ? "Masculino" : profile?.gender === "female" ? "Feminino" : "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { label: "Atividade", value: profile?.activity_level ?? "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { label: "Meta diária", value: `${profile?.daily_calorie_goal ?? "—"} kcal` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { label: "Objetivo Fênix", value: objetivoFenixLabel(profile?.objetivo_fenix) ?? objetivo ?? "—" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "Respostas do Quiz de Cadastro" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "grid gap-4 text-sm sm:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { label: "Alimento favorito", value: profile?.alimento_favorito ?? "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { label: "Não come de jeito nenhum", value: Array.isArray(profile?.alimentos_evitar) && profile.alimentos_evitar.length ? profile.alimentos_evitar.join(", ") : "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { label: "Tem restrição médica / lesão", value: profile?.tem_restricao === true ? "Sim" : profile?.tem_restricao === false ? "Não" : "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sm:col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Descrição da restrição" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "whitespace-pre-wrap font-medium", children: profile?.restricao_descricao || "—" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "Preferências Alimentares" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "grid gap-4 text-sm sm:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { label: "Não pode faltar na mesa", value: prefs?.essenciais?.length ? prefs.essenciais.join(", ") : "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { label: "Estilo de refeição", value: prefs?.estilo_refeicao ?? "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { label: "Restrições alimentares", value: prefs?.restricoes?.length ? prefs.restricoes.join(", ") : "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sm:col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Alimentos que detesta" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: prefs?.detestados?.length ? prefs.detestados.join(", ") : "—" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ProtocoloEditor, { userId }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertasTrocas, { userId, limit: 50 }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base", children: [
        "Histórico de Peso (",
        weights.length,
        ")"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "max-h-80 overflow-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "text-sm space-y-1", children: [
        weights.map((w, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex justify-between border-b border-border/40 py-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: w.logged_date }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium", children: [
            Number(w.weight),
            " kg"
          ] })
        ] }, i)),
        !weights.length && /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "text-muted-foreground", children: "Sem registros." })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base", children: [
        "Reflexões do Diário (",
        diario.length,
        ")"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "max-h-96 overflow-auto space-y-3", children: [
        diario.map((d, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-l-2 border-primary/40 pl-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
            d.registrado_em,
            " ",
            d.humor ? `· ${d.humor}` : ""
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: d.pergunta }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm", children: d.resposta })
        ] }, i)),
        !diario.length && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Sem reflexões." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base", children: [
        "Diário Alimentar (",
        alimentar.length,
        ")"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "max-h-96 overflow-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "text-sm divide-y divide-border/40", children: [
        alimentar.map((m, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "py-1.5 flex justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: m.data }),
            " ·",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "capitalize", children: m.refeicao }),
            " · ",
            m.nome
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium", children: [
            m.calorias,
            " kcal"
          ] })
        ] }, i)),
        !alimentar.length && /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "text-muted-foreground", children: "Sem registros." })
      ] }) })
    ] })
  ] });
}
function objetivoFenixLabel(o) {
  if (o === "emagrecer") return "Emagrecer";
  if (o === "ganhar_musculo") return "Ganhar Músculo";
  if (o === "condicionamento") return "Condicionamento";
  return null;
}
function Info({
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: value })
  ] });
}
function downloadCSV(filename, rows) {
  const csv = rows.map((r) => r.map((v) => {
    const s = String(v ?? "");
    return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  }).join(",")).join("\n");
  const blob = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8"
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
export {
  AdminAlunoDetalhe as component
};
