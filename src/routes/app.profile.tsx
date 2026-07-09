import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { profileQuery, badgesQuery, weightsQuery, perfilQuery } from "@/lib/queries";
import { LogOut, Award, Flame, Lock, Pencil, Scale, Briefcase, Mail } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MetricChip } from "@/components/ui/metric-chip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { calculateDailyCalories, type ActivityLevel } from "@/lib/calories";
import { ALL_BADGES } from "@/lib/badges";
import { toast } from "sonner";
import { z } from "zod";

const editSchema = z.object({
  display_name: z.string().trim().min(1, "Informe um nome").max(60, "Máx. 60 caracteres"),
  goal_weight: z
    .number({ invalid_type_error: "Peso inválido" })
    .min(30, "Mínimo 30 kg")
    .max(300, "Máximo 300 kg"),
  activity_level: z.enum(["sedentary", "light", "moderate", "active", "very_active"]),
});

type FormErrors = Partial<Record<"display_name" | "goal_weight" | "activity_level", string>>;

export const Route = createFileRoute("/app/profile")({
  component: Profile,
});

const ACTIVITY_OPTIONS: { value: ActivityLevel; label: string }[] = [
  { value: "sedentary", label: "Sedentário" },
  { value: "light", label: "Leve" },
  { value: "moderate", label: "Moderado" },
  { value: "active", label: "Ativo" },
  { value: "very_active", label: "Muito ativo" },
];

const profissionalSchema = z.object({
  nome: z.string().trim().min(1, "Informe um nome").max(80, "Máx. 80 caracteres"),
  especialidade: z.string().trim().max(120, "Máx. 120 caracteres").optional(),
});

type ProfissionalFormErrors = Partial<Record<"nome" | "especialidade", string>>;

const PAPEL_LABEL: Record<string, string> = {
  instrutor: "Instrutor",
  nutricionista: "Nutricionista",
  admin: "Administrador",
};

function ProfileProfissional() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const userId = user?.id ?? "";
  const qc = useQueryClient();

  const { data: perfil } = useQuery({ ...perfilQuery(userId), enabled: !!userId });

  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({ nome: "", especialidade: "" });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<ProfissionalFormErrors>({});

  const openEdit = () => {
    if (!perfil) return;
    setErrors({});
    setForm({
      nome: perfil.nome ?? "",
      especialidade: perfil.especialidade ?? "",
    });
    setEditOpen(true);
  };

  const saveEdit = async () => {
    if (!user) return;
    const parsed = profissionalSchema.safeParse({
      nome: form.nome,
      especialidade: form.especialidade || undefined,
    });
    if (!parsed.success) {
      const fe: ProfissionalFormErrors = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as keyof typeof fe;
        if (k && !fe[k]) fe[k] = issue.message;
      }
      setErrors(fe);
      toast.error("Verifique os campos");
      return;
    }
    setErrors({});
    setSaving(true);
    try {
      const { nome, especialidade } = parsed.data;
      const { error } = await supabase
        .from("perfis")
        .update({ nome, especialidade: especialidade ?? null })
        .eq("id", user.id);
      if (error) throw error;
      toast.success("Perfil atualizado");
      setEditOpen(false);
      qc.invalidateQueries({ queryKey: ["perfil", userId] });
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  return (
    <main className="mx-auto max-w-md px-5 pt-10 pb-8">
      <header className="text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-ember shadow-ember">
          <Briefcase className="h-9 w-9 text-primary-foreground" strokeWidth={1.4} />
        </div>
        <h1 className="mt-4 text-3xl">{perfil?.nome ?? "Profissional"}</h1>
        <p className="text-sm text-muted-foreground">{user?.email}</p>
        {perfil?.papel && (
          <span className="mt-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {PAPEL_LABEL[perfil.papel] ?? perfil.papel}
          </span>
        )}
        <Button
          onClick={openEdit}
          variant="outline"
          size="sm"
          className="mt-4 h-10"
          disabled={!perfil}
        >
          <Pencil className="h-3.5 w-3.5 mr-1.5" /> Editar perfil
        </Button>
      </header>

      {/* Informações profissionais */}
      {perfil?.especialidade && (
        <section className="mt-8">
          <div className="flex items-center gap-2 mb-3">
            <Briefcase className="h-4 w-4 text-primary" />
            <h2 className="text-xs uppercase tracking-widest text-muted-foreground">
              Informações profissionais
            </h2>
          </div>
          <div className="glass rounded-2xl px-4 py-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Especialidade</span>
              <span className="font-medium">{perfil.especialidade}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tipo</span>
              <span className="font-medium">{PAPEL_LABEL[perfil.papel] ?? perfil.papel}</span>
            </div>
          </div>
        </section>
      )}

      {/* Conta */}
      <section className="mt-8">
        <div className="flex items-center gap-2 mb-3">
          <Mail className="h-4 w-4 text-primary" />
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground">Conta</h2>
        </div>
        <div className="glass rounded-2xl px-4 py-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Email</span>
            <span className="font-medium truncate max-w-[200px]">{user?.email}</span>
          </div>
        </div>
      </section>

      <Button onClick={handleSignOut} variant="outline" className="mt-10 w-full h-12">
        <LogOut className="h-4 w-4 mr-2" /> Sair
      </Button>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar perfil</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Nome</Label>
              <Input
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                maxLength={80}
                placeholder="Seu nome completo"
                aria-invalid={!!errors.nome}
              />
              {errors.nome && <p className="text-xs text-destructive">{errors.nome}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Especialidade</Label>
              <Input
                value={form.especialidade}
                onChange={(e) => setForm({ ...form, especialidade: e.target.value })}
                maxLength={120}
                placeholder="Ex: Musculação, Nutrição esportiva…"
                aria-invalid={!!errors.especialidade}
              />
              {errors.especialidade && (
                <p className="text-xs text-destructive">{errors.especialidade}</p>
              )}
            </div>
            <div className="rounded-xl border border-border/40 bg-secondary/30 px-3 py-2.5 text-xs text-muted-foreground">
              Tipo de conta:{" "}
              <span className="font-medium text-foreground">
                {PAPEL_LABEL[perfil?.papel ?? ""] ?? perfil?.papel ?? "—"}
              </span>
            </div>
            <Button
              onClick={saveEdit}
              disabled={saving}
              className="w-full h-12 bg-gradient-ember text-primary-foreground shadow-ember"
            >
              {saving ? "Salvando…" : "Salvar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}

function Profile() {
  const { user } = useAuth();
  const userId = user?.id ?? "";
  const { data: perfil } = useQuery({ ...perfilQuery(userId), enabled: !!userId });

  if (
    perfil?.papel === "instrutor" ||
    perfil?.papel === "nutricionista" ||
    perfil?.papel === "admin"
  ) {
    return <ProfileProfissional />;
  }

  return <ProfileAluno />;
}

function ProfileAluno() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const userId = user?.id ?? "";
  const qc = useQueryClient();

  // Cached & shared with Dashboard — instant on second visit.
  const { data: profile = null } = useQuery({ ...profileQuery(userId), enabled: !!userId });
  const { data: badgeList = [] } = useQuery({ ...badgesQuery(userId), enabled: !!userId });
  const { data: weights = [] } = useQuery({ ...weightsQuery(userId), enabled: !!userId });

  const unlocked = new Set(badgeList);
  const totalRegistros = weights.length;
  const isUnlocked = (type: string) => {
    if (unlocked.has(type)) return true;
    if (type === "first_log") return totalRegistros >= 1;
    if (type === "streak_7") return totalRegistros >= 7;
    if (type === "goal_reached" && profile?.goal_weight && profile?.current_weight)
      return profile.current_weight <= profile.goal_weight;
    return false;
  };

  const historico = [...weights].reverse(); // newest first

  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState<{
    display_name: string;
    goal_weight: string;
    activity_level: ActivityLevel;
  }>({ display_name: "", goal_weight: "", activity_level: "moderate" });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const load = () => {
    qc.invalidateQueries({ queryKey: ["profile", userId] });
    qc.invalidateQueries({ queryKey: ["badges", userId] });
  };

  const openEdit = () => {
    if (!profile) return;
    setErrors({});
    setForm({
      display_name: profile.display_name ?? "",
      goal_weight: profile.goal_weight?.toString() ?? "",
      activity_level: (profile.activity_level as ActivityLevel) ?? "moderate",
    });
    setEditOpen(true);
  };

  const saveEdit = async () => {
    if (!user || !profile) return;
    const parsed = editSchema.safeParse({
      display_name: form.display_name,
      goal_weight: form.goal_weight ? parseFloat(form.goal_weight.replace(",", ".")) : NaN,
      activity_level: form.activity_level,
    });
    if (!parsed.success) {
      const fe: FormErrors = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as keyof typeof fe;
        if (k && !fe[k]) fe[k] = issue.message;
      }
      setErrors(fe);
      toast.error("Verifique os campos");
      return;
    }
    setErrors({});
    setSaving(true);
    try {
      const { display_name, goal_weight, activity_level } = parsed.data;
      // Always recompute calorie goal when we have enough data
      let daily_calorie_goal = profile.daily_calorie_goal;
      if (profile.current_weight && profile.height && profile.age && profile.gender) {
        daily_calorie_goal = calculateDailyCalories({
          weight: profile.current_weight,
          height: profile.height,
          age: profile.age,
          gender: profile.gender,
          activity: activity_level,
          goal:
            goal_weight < profile.current_weight
              ? "lose"
              : goal_weight > profile.current_weight
                ? "gain"
                : "maintain",
        });
      }
      const { error } = await supabase
        .from("profiles")
        .update({
          display_name,
          goal_weight,
          activity_level,
          daily_calorie_goal,
        })
        .eq("id", user.id);
      if (error) throw error;
      toast.success(
        daily_calorie_goal && daily_calorie_goal !== profile.daily_calorie_goal
          ? `Perfil atualizado · nova meta: ${daily_calorie_goal} kcal`
          : "Perfil atualizado",
      );
      setEditOpen(false);
      load();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  // Live preview of the new daily calorie goal as the form changes
  const previewCalories = (() => {
    if (!profile?.current_weight || !profile.height || !profile.age || !profile.gender) return null;
    const gw = parseFloat(form.goal_weight.replace(",", "."));
    if (!Number.isFinite(gw) || gw < 30 || gw > 300) return null;
    return calculateDailyCalories({
      weight: profile.current_weight,
      height: profile.height,
      age: profile.age,
      gender: profile.gender,
      activity: form.activity_level,
      goal:
        gw < profile.current_weight ? "lose" : gw > profile.current_weight ? "gain" : "maintain",
    });
  })();

  return (
    <main className="mx-auto max-w-md px-5 pt-10 pb-8">
      <header className="text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-ember shadow-ember">
          <Flame className="h-9 w-9 text-primary-foreground" strokeWidth={1.4} />
        </div>
        <h1 className="mt-4 text-3xl">{profile?.display_name ?? "Fênix"}</h1>
        <p className="text-sm text-muted-foreground">{user?.email}</p>
        <Button
          onClick={openEdit}
          variant="outline"
          size="sm"
          className="mt-4 h-10"
          disabled={!profile}
        >
          <Pencil className="h-3.5 w-3.5 mr-1.5" /> Editar perfil
        </Button>
      </header>

      <section className="mt-8 grid grid-cols-3 gap-2">
        <MetricChip
          label="Atual"
          value={profile?.current_weight ? `${profile.current_weight}kg` : "—"}
        />
        <MetricChip label="Meta" value={profile?.goal_weight ? `${profile.goal_weight}kg` : "—"} />
        <MetricChip label="Kcal/dia" value={profile?.daily_calorie_goal ?? "—"} />
      </section>

      {/* Histórico de Peso */}
      <section className="mt-8">
        <div className="flex items-center gap-2 mb-3">
          <Scale className="h-4 w-4 text-primary" />
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground">
            Histórico de peso
          </h2>
          {historico.length > 0 && (
            <span className="ml-auto text-[10px] text-muted-foreground">
              {historico.length} {historico.length === 1 ? "registro" : "registros"}
            </span>
          )}
        </div>
        <div className="glass rounded-2xl divide-y divide-border/40 overflow-hidden">
          {historico.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground text-center">
              Nenhum registro ainda.
            </div>
          ) : (
            historico.slice(0, 10).map((w, idx) => {
              const d = new Date(w.logged_date + "T00:00:00");
              const label = d.toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "short",
                year: "2-digit",
              });
              return (
                <div
                  key={`${w.logged_date}-${idx}`}
                  className="flex items-center justify-between px-4 py-3"
                >
                  <span className="text-sm text-muted-foreground">{label}</span>
                  <span className="text-sm font-semibold text-foreground">{w.weight} kg</span>
                </div>
              );
            })
          )}
          {historico.length > 10 && (
            <div className="px-4 py-2 text-[11px] text-muted-foreground text-center bg-background/20">
              Mostrando os 10 mais recentes de {historico.length}
            </div>
          )}
        </div>
      </section>

      {/* Painel de Conquistas */}
      <section className="mt-8">
        <div className="flex items-center gap-2 mb-3">
          <Award className="h-4 w-4 text-accent" />
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground">Conquistas</h2>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {ALL_BADGES.map((b) => {
            const has = isUnlocked(b.type);
            return (
              <div
                key={b.type}
                className={`glass rounded-2xl p-3 flex flex-col items-center text-center gap-2 transition ${
                  has ? "" : "grayscale opacity-60"
                }`}
              >
                <div
                  className={`h-12 w-12 rounded-full flex items-center justify-center ${
                    has ? "bg-gradient-ember shadow-ember" : "bg-secondary"
                  }`}
                >
                  {has ? (
                    <Award className="h-5 w-5 text-primary-foreground" />
                  ) : (
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <div className="text-[11px] font-semibold leading-tight">{b.title}</div>
                  <div className="text-[10px] text-muted-foreground mt-1 leading-snug">
                    {b.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <Button onClick={handleSignOut} variant="outline" className="mt-10 w-full h-12">
        <LogOut className="h-4 w-4 mr-2" /> Sair
      </Button>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar perfil</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Nome</Label>
              <Input
                value={form.display_name}
                onChange={(e) => setForm({ ...form, display_name: e.target.value })}
                maxLength={60}
                aria-invalid={!!errors.display_name}
              />
              {errors.display_name && (
                <p className="text-xs text-destructive">{errors.display_name}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Peso desejado (kg)</Label>
              <Input
                type="number"
                step="0.1"
                min={30}
                max={300}
                value={form.goal_weight}
                onChange={(e) => setForm({ ...form, goal_weight: e.target.value })}
                aria-invalid={!!errors.goal_weight}
              />
              {errors.goal_weight && (
                <p className="text-xs text-destructive">{errors.goal_weight}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Nível de atividade</Label>
              <Select
                value={form.activity_level}
                onValueChange={(v) => setForm({ ...form, activity_level: v as ActivityLevel })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ACTIVITY_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="rounded-xl border border-primary/20 bg-primary/5 px-3 py-2.5 text-xs">
              {previewCalories != null ? (
                <>
                  <span className="text-muted-foreground">Nova meta calórica: </span>
                  <span className="font-semibold text-primary">{previewCalories} kcal/dia</span>
                  {profile?.daily_calorie_goal &&
                    previewCalories !== profile.daily_calorie_goal && (
                      <span className="text-muted-foreground">
                        {" "}
                        (era {profile.daily_calorie_goal})
                      </span>
                    )}
                </>
              ) : (
                <span className="text-muted-foreground">
                  Informe um peso válido para ver a nova meta.
                </span>
              )}
            </div>
            <Button
              onClick={saveEdit}
              disabled={saving}
              className="w-full h-12 bg-gradient-ember text-primary-foreground shadow-ember"
            >
              {saving ? "Salvando…" : "Salvar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
