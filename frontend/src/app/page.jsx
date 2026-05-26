import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center gap-6">
      <h1 className="text-4xl font-bold text-[hsl(240,90%,60%)]">ECOME</h1>
      <p className="text-[hsl(240,5%,40%)] text-lg max-w-md">
        Repositório acadêmico de artigos, trabalhos de conclusão, dissertações e materiais de estudo.
      </p>
      <div className="flex gap-4">
        <Link href="/posts" className="px-6 py-3 bg-[hsl(240,90%,60%)] text-[hsl(0,0%,100%)] rounded-lg font-medium hover:bg-[hsl(240,90%,30%)] transition-colors">
          Ver Publicações
        </Link>
        <Link href="/categories" className="px-6 py-3 border border-[hsl(240,5%,50%)] text-[hsl(240,5%,30%)] rounded-lg font-medium hover:bg-[hsl(240,5%,70%)] transition-colors">
          Ver Categorias
        </Link>
      </div>
    </div>
  );
}
