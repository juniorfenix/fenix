import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { guiasMentaisQuery } from "@/lib/queries";

export const Route = createFileRoute("/app/guias/$chave")({
  component: GuiaDetail,
});

function GuiaDetail() {
  const { chave } = Route.useParams();
  const { data: guias, isPending } = useQuery(guiasMentaisQuery);
  const guia = guias?.find((g) => g.chave === chave);

  return (
    <main className="mx-auto max-w-2xl px-6 pt-8 pb-12">
      <Link
        to="/app"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>

      {isPending ? (
        <div className="mt-8 space-y-4">
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-40 w-full" />
        </div>
      ) : !guia ? (
        <div className="mt-16 text-center">
          <p className="text-muted-foreground">Guia não encontrado.</p>
        </div>
      ) : (
        <article className="mt-8">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-gradient-ember grid place-items-center shadow-ember">
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              Guia mental
            </div>
          </div>

          <h1 className="mt-6 font-display text-4xl leading-tight">{guia.titulo}</h1>
          {guia.descricao && (
            <p className="mt-3 text-base text-muted-foreground">{guia.descricao}</p>
          )}

          <div className="mt-8 h-px bg-border" />

          <div
            className="mt-8 max-w-prose text-[17px] leading-[1.75] text-foreground/90 whitespace-pre-wrap"
            style={{ fontFeatureSettings: '"liga", "kern"' }}
          >
            {guia.conteudo}
          </div>
        </article>
      )}
    </main>
  );
}
