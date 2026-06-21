import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white text-center">
      <div className="inline-block bg-brand/10 border border-brand/30 text-brand text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-8">
        Plateforme SaaS Agents IA
      </div>
      <h1 className="text-4xl md:text-6xl font-bold max-w-3xl leading-tight mb-6">
        Déployez des agents IA de support client en quelques minutes
      </h1>
      <p className="text-gray-400 text-lg max-w-xl mb-10">
        Créez, configurez et déployez des agents IA pour vos clients e-commerce.
        Multi-organisation, multi-agent, prêt pour la production.
      </p>
      <div className="flex gap-4 flex-wrap justify-center">
        <Link
          href="/signup"
          className="bg-gradient-to-r from-brand to-brand-light text-white font-semibold px-8 py-3.5 rounded-xl hover:opacity-90 transition"
        >
          Créer un compte gratuit
        </Link>
        <Link
          href="/login"
          className="border border-white/20 text-white font-semibold px-8 py-3.5 rounded-xl hover:border-white/40 transition"
        >
          Se connecter
        </Link>
      </div>
    </main>
  );
}
