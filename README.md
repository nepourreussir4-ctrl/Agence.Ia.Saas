# AgenceIA SaaS — Plateforme d'agents IA pour e-commerce

Plateforme SaaS multi-tenant permettant de créer, configurer et déployer des agents IA de support client pour des boutiques e-commerce.

## Stack technique

- **Frontend** : Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend** : Next.js API Routes
- **Base de données** : Supabase (PostgreSQL) avec Row Level Security
- **Authentification** : Supabase Auth
- **IA** : API Anthropic (Claude Sonnet 4.6)
- **Hébergement** : Vercel

## Démarrage rapide

Voir **GUIDE-DEPLOIEMENT.md** pour les instructions complètes, étape par étape.

```bash
npm install
cp .env.example .env.local   # puis remplis avec tes clés
npm run dev
```

## Architecture

```
app/
  api/chat/          → Endpoint unique servant tous les agents (identifié par widget_token)
  dashboard/         → Interface privée (auth requise)
    agents/          → CRUD des agents IA
    settings/        → Paramètres organisation
  widget/[token]/    → Page publique du chat, sans authentification
  login/ signup/     → Authentification

components/
  dashboard/         → Sidebar, ChatWidget (réutilisé dashboard + widget public)

lib/
  supabase-browser.ts  → Client Supabase pour composants client
  supabase-server.ts   → Client Supabase serveur + client admin (service_role)

supabase/migrations/  → Schéma SQL complet avec RLS

types/database.ts      → Types TypeScript reflétant le schéma DB
```

## Modèle de données

- `organizations` — un client de l'agence
- `profiles` — utilisateurs, rattachés à une organisation
- `agents` — agents IA configurés (1 organisation → N agents)
- `conversations` — sessions de chat
- `messages` — messages individuels

Chaque organisation est isolée des autres via PostgreSQL Row Level Security : un utilisateur ne peut jamais voir les données d'une autre organisation, même en cas de bug applicatif.
