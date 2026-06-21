# 🚀 Guide de déploiement — Plateforme SaaS Agents IA

Ce guide suppose zéro connaissance technique préalable. Suis les étapes dans l'ordre exact.

---

## ✅ Ce que contient ce projet

- **Auth multi-tenant** : chaque inscription crée automatiquement une organisation
- **Dashboard** : vue d'ensemble, gestion des agents IA, paramètres
- **Agents illimités** : chaque agent a son propre prompt, sa couleur, son lien public
- **Widget public** : chaque agent a une URL `/widget/[token]` testable et partageable
- **Sécurité** : Row Level Security PostgreSQL — chaque organisation ne voit que ses propres données

---

## 🗂️ ÉTAPE 1 — Créer le projet Supabase (base de données + auth)

1. Va sur **https://supabase.com** → Sign up (gratuit, pas de carte requise)
2. Clique **"New Project"**
3. Donne un nom (ex: `agence-ia-saas`), choisis un mot de passe pour la base de données (note-le quelque part)
4. Région : choisis **Europe** (Frankfurt) — meilleure latence pour Afrique + Europe
5. Attends 2 minutes que le projet se crée

### Exécuter la migration SQL

6. Dans le menu de gauche → **"SQL Editor"** → **"New query"**
7. Ouvre le fichier `supabase/migrations/001_initial_schema.sql` de ce projet
8. Copie TOUT le contenu, colle-le dans l'éditeur SQL Supabase
9. Clique **"Run"** (en bas à droite)
10. Tu dois voir "Success. No rows returned" — c'est normal, ça veut dire que les tables sont créées

### Récupérer les clés API

11. Menu de gauche → **"Project Settings"** → **"API"**
12. Note ces 3 valeurs (tu en auras besoin à l'étape 3) :
    - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
    - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    - **service_role** key (clique "Reveal") → `SUPABASE_SERVICE_ROLE_KEY`

⚠️ La clé `service_role` est ultra-sensible — ne la partage JAMAIS publiquement.

---

## 🔑 ÉTAPE 2 — Récupérer ta clé API Anthropic

1. Va sur **https://console.anthropic.com**
2. Crée un compte
3. Menu → **"API Keys"** → **"Create Key"**
4. Copie la clé (commence par `sk-ant-...`)

---

## 💻 ÉTAPE 3 — Tester en local (optionnel mais recommandé)

Si tu as Node.js installé sur ton ordinateur :

```bash
# Dans le dossier du projet
npm install

# Crée le fichier .env.local
cp .env.example .env.local
```

Ouvre `.env.local` et remplis avec tes vraies clés des étapes 1 et 2 :

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxxxx...
ANTHROPIC_API_KEY=sk-ant-xxxxx
```

Puis lance :

```bash
npm run dev
```

Ouvre **http://localhost:3000** dans ton navigateur.

---

## 🌍 ÉTAPE 4 — Mettre le code sur GitHub

1. Va sur **https://github.com/new**
2. Nom du repo : `agence-ia-saas` → "Create repository"
3. Sur ton ordinateur, dans le dossier du projet :

```bash
git init
git add .
git commit -m "Premier commit - plateforme SaaS agents IA"
git branch -M main
git remote add origin https://github.com/TON-USERNAME/agence-ia-saas.git
git push -u origin main
```

(Remplace `TON-USERNAME` par ton vrai nom d'utilisateur GitHub)

---

## ▲ ÉTAPE 5 — Déployer sur Vercel (gratuit)

1. Va sur **https://vercel.com** → connecte-toi avec GitHub
2. Clique **"Add New"** → **"Project"**
3. Sélectionne ton repo `agence-ia-saas` → **"Import"**
4. Dans **"Environment Variables"**, ajoute les 4 mêmes variables que ton `.env.local` :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ANTHROPIC_API_KEY`
5. Clique **"Deploy"**
6. Attends 2-3 minutes → tu obtiens une URL du type `agence-ia-saas.vercel.app`

---

## ✅ ÉTAPE 6 — Test final

1. Ouvre ton URL Vercel
2. Clique "Créer un compte gratuit" → inscris-toi avec un nom d'organisation
3. Une fois dans le dashboard → "Mes agents" → "Nouvel agent"
4. Remplis le formulaire (nom de l'agent, nom de boutique)
5. Clique "Tester" sur la carte de l'agent créé → le widget de chat s'ouvre
6. Envoie un message → si tu reçois une réponse, tout fonctionne

---

## 📤 Comment livrer un agent à un client

1. Dans "Mes agents", clique **"Copier le lien"** sur l'agent du client
2. Envoie-lui cette URL (`tonsite.vercel.app/widget/xxxxx`) — il peut l'utiliser directement, ou tu peux l'intégrer en iframe sur son site

```html
<iframe src="https://tonsite.vercel.app/widget/XXXXX" width="420" height="650" style="border:none;"></iframe>
```

---

## 🛠️ Limites actuelles de cette V1 (à connaître)

- Pas de facturation automatique — tu factures tes clients manuellement (comme demandé)
- Pas d'invitation d'autres membres dans une organisation (tout le monde doit créer son propre compte pour l'instant)
- Le système prompt est modifiable uniquement à la création de l'agent (pas d'édition après — à ajouter si besoin)

Ces points sont des évolutions futures simples à ajouter une fois le socle validé en production.
