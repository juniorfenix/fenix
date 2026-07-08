import { Link } from "@tanstack/react-router";
import { ClipboardList, Dumbbell, Mail, TrendingUp, Trash2, Utensils } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import type { InstrutorAlunoRow } from "@/lib/queries";

interface StudentActionSheetProps {
  aluno: InstrutorAlunoRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRemove: (vinculoId: string) => void;
  removing?: boolean;
}

export function StudentActionSheet({
  aluno,
  open,
  onOpenChange,
  onRemove,
  removing,
}: StudentActionSheetProps) {
  const isMobile = useIsMobile();

  if (!aluno) return null;

  const fechar = () => onOpenChange(false);

  const identidade = (
    <div>
      <div className="text-base font-semibold">{aluno.aluno_nome ?? "Aluno sem nome"}</div>
      {aluno.aluno_email && (
        <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Mail className="h-3 w-3 shrink-0" />
          <span className="truncate">{aluno.aluno_email}</span>
        </div>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        <Badge variant={aluno.tem_plano_treino ? "default" : "outline"}>
          {aluno.tem_plano_treino ? "Treino ativo" : "Sem treino"}
        </Badge>
        <Badge variant={aluno.tem_plano_alimentar ? "default" : "outline"}>
          {aluno.tem_plano_alimentar ? "Dieta ativa" : "Sem dieta"}
        </Badge>
      </div>
    </div>
  );

  const acoes = (
    <div className="space-y-2">
      <Button asChild className="w-full justify-start" variant="default">
        <Link to="/app/instrutor/$alunoId" params={{ alunoId: aluno.aluno_id }} onClick={fechar}>
          <ClipboardList className="h-4 w-4" /> Gerenciar aluno
        </Link>
      </Button>
      <Button asChild className="w-full justify-start" variant="outline">
        <Link
          to="/app/instrutor/$alunoId"
          params={{ alunoId: aluno.aluno_id }}
          search={{ tab: "treino" }}
          onClick={fechar}
        >
          <Dumbbell className="h-4 w-4" /> Prescrever treino
        </Link>
      </Button>
      <Button asChild className="w-full justify-start" variant="outline">
        <Link
          to="/app/instrutor/$alunoId"
          params={{ alunoId: aluno.aluno_id }}
          search={{ tab: "alimentar" }}
          onClick={fechar}
        >
          <Utensils className="h-4 w-4" /> Prescrever dieta
        </Link>
      </Button>
      <Button asChild className="w-full justify-start" variant="outline">
        <Link
          to="/app/instrutor/$alunoId"
          params={{ alunoId: aluno.aluno_id }}
          search={{ tab: "progresso" }}
          onClick={fechar}
        >
          <TrendingUp className="h-4 w-4" /> Ver atividade
        </Link>
      </Button>
    </div>
  );

  const removerVinculo = (
    <button
      type="button"
      onClick={() => onRemove(aluno.id)}
      disabled={removing}
      className="flex w-full items-center justify-center gap-1.5 py-2 text-xs text-destructive transition hover:underline disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Trash2 className="h-3.5 w-3.5" /> Remover vínculo
    </button>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>Ações do aluno</DrawerTitle>
            <DrawerDescription className="sr-only">
              Ações rápidas para {aluno.aluno_nome ?? "este aluno"}
            </DrawerDescription>
            {identidade}
          </DrawerHeader>
          <div className="px-4 pb-2">{acoes}</div>
          <div className="border-t border-border/40 px-4 py-2">{removerVinculo}</div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-sm">
        <SheetHeader>
          <SheetTitle>Ações do aluno</SheetTitle>
          <SheetDescription className="sr-only">
            Ações rápidas para {aluno.aluno_nome ?? "este aluno"}
          </SheetDescription>
        </SheetHeader>
        {identidade}
        <div className="flex-1 py-4">{acoes}</div>
        <div className="border-t border-border/40 pt-3">{removerVinculo}</div>
      </SheetContent>
    </Sheet>
  );
}
