import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-lg font-bold text-[hsl(240,90%,60%)] tracking-tight">
          ECOME
        </Link>
        <div className="flex gap-6 text-sm font-medium text-gray-600">
          <Link href="/posts" className="hover:text-[hsl(240,90%,60%)] transition-colors">
            Publicações
          </Link>
          <Link href="/categories" className="hover:text-[hsl(240,90%,60%)] transition-colors">
            Categorias
          </Link>
        </div>
      </div>
    </nav>
  );
}
