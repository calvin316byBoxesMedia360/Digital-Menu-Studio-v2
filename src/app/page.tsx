import Link from "next/link";
import { MousePointer2 } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-white p-6">
      <div className="space-y-8 text-center max-w-2xl">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-600 shadow-xl shadow-purple-900/40">
          <MousePointer2 size={32} />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl text-zinc-100">
            Digital Menu Studio <span className="text-purple-500">v2.0</span>
          </h1>
          <p className="text-lg text-zinc-500 font-medium italic">
            "Fusión entre la accesibilidad de Canva y la libertad de Illustrator."
          </p>
        </div>

        <div className="flex flex-col gap-4 items-center">
          <Link
            href="/editor"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-white px-8 py-4 font-bold text-black transition-all hover:pr-12 active:scale-95"
          >
            ENTRAR AL EDITOR
            <span className="absolute right-4 translate-x-4 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100">
              →
            </span>
          </Link>
          <p className="text-[10px] text-zinc-600 uppercase tracking-[0.2em]">Next.js 15 Stable + Tailwind v4</p>
        </div>
      </div>
    </div>
  );
}
