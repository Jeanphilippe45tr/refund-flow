# RefundPay - Complete Refund Management Platform 🚀

## English / Français

### 🎯 **Overview**
**RefundPay** is a full-stack web application for refund processing and management. Built with modern technologies, it offers **client and admin dashboards** for seamless refund workflows.

**Key Features:**
- ✅ **Dual Dashboard**: Client (refunds, wallet, withdraw, documents) & Admin (users, refunds, withdrawals, analytics)
- ✅ **Supabase Integration**: Auth, PostgreSQL, Storage (documents/profiles)
- ✅ **Modern UI**: shadcn/ui + TailwindCSS + Framer Motion
- ✅ **Responsive**: Mobile-first design
- ✅ **Real-time**: React Query for data fetching

---

### 🛠 **Tech Stack**
```
Frontend: React 18 + TypeScript + Vite + shadcn/ui + TailwindCSS
Backend: Supabase (Auth, DB, Edge Functions, Storage)
Database: PostgreSQL (profiles, refunds, transactions, etc.)
Deployment: Vercel/Netlify (front) + Supabase (back)
Testing: Vitest + Playwright
```

---

### 🚀 **Quick Start**

1. **Clone & Install**
```bash
git clone <repo>
cd refund-flow
npm install
```

2. **Supabase Setup**
```bash
npm install -g supabase
supabase init
supabase start
```
- Copy `.env` vars from `supabase/.env` to `.env.local`
- Run migrations: `supabase db reset`

3. **Run Development**
```bash
npm run dev
```
Open http://localhost:5173

4. **Build & Deploy**
```bash
npm run build
npm run preview
```

---

### 👥 **User Roles & Features**

#### **Client Dashboard** (`/dashboard`)
| Feature | Description |
|---------|-------------|
| Dashboard | Overview stats |
| Wallet | Balance, transactions |
| Withdraw | Request withdrawals |
| Documents | Upload/verify receipts |
| Profile | Settings (photo, phone, password, email) |
| Notifications | Alerts |
| Support | Tickets |

#### **Admin Dashboard** (`/admin`)
| Feature | Description |
|---------|-------------|
| Dashboard | Analytics |
| Users | Manage users/roles |
| Withdrawals | Approve/reject |
| Refunds | Process refunds |
| Documents | Review uploads |
| Support | Manage tickets |
| Logs | Activity log |

---

### 🔐 **Authentication**
- Email/Password login
- Role-based access (client/admin)
- Profile photo upload (10MB max)

---

### 📱 **Screenshots**
*(Add screenshots: login, client dashboard, admin, profile settings)*

---

### ⚙️ **Supabase Dashboard**
1. Storage: 'documents' bucket (policies pre-set)
2. Auth: Enable Email
3. Database: Tables auto-migrated
4. Edge Functions: Optional (admin creation)

---

### 💰 **Customization**
- Colors: Tailwind config
- Features: Add Stripe/PayPal for payments
- White-label: Change branding

---

### 🐛 **Issues & Support**
Contact: [your-email]
License: Commercial Ready

---

# RefundPay - Plateforme Complète de Gestion de Remboursements 🚀

## Français

### 🎯 **Présentation**
**RefundPay** est une application web full-stack pour le traitement et la gestion de remboursements. Conçue avec les technologies modernes, elle propose des **tableaux de bord client et admin** pour des workflows fluides.

**Fonctionnalités Principales:**
- ✅ **Double Tableau de Bord**: Client (remboursements, wallet, retraits, documents) & Admin (utilisateurs, remboursements, retraits, analytics)
- ✅ **Intégration Supabase**: Auth, PostgreSQL, Stockage (documents/profils)
- ✅ **UI Moderne**: shadcn/ui + TailwindCSS + Framer Motion
- ✅ **Responsive**: Design mobile-first
- ✅ **Temps Réel**: React Query pour récupération de données

### 🛠 **Stack Technique**
```
Frontend: React 18 + TypeScript + Vite + shadcn/ui + TailwindCSS
Backend: Supabase (Auth, DB, Edge Functions, Storage)
Base de Données: PostgreSQL (profiles, refunds, transactions...)
Déploiement: Vercel/Netlify (front) + Supabase (back)
Tests: Vitest + Playwright
```

### 🚀 **Démarrage Rapide**

1. **Cloner & Installer**
```bash
git clone <repo>
cd refund-flow
npm install
```

2. **Supabase**
```bash
npm install -g supabase
supabase init
supabase start
```
- Copier `.env` de `supabase/.env` vers `.env.local`
- Migrations: `supabase db reset`

3. **Développement**
```bash
npm run dev
```
Ouvrir http://localhost:5173

4. **Build & Déployer**
```bash
npm run build
npm run preview
```

### 👥 **Rôles & Fonctionnalités**

#### **Tableau de Bord Client** (`/dashboard`)
| Fonctionnalité | Description |
|----------------|-------------|
| Dashboard | Stats d'aperçu |
| Wallet | Solde, transactions |
| Retrait | Demander retraits |
| Documents | Upload/vérifier reçus |
| Profil | Paramètres (photo, téléphone, mot de passe, email) |
| Notifications | Alertes |
| Support | Tickets |

#### **Tableau de Bord Admin** (`/admin`)
| Fonctionnalité | Description |
|----------------|-------------|
| Dashboard | Analytics |
| Utilisateurs | Gérer rôles |
| Retraits | Approuver/rejeter |
| Remboursements | Traiter |
| Documents | Vérifier uploads |
| Support | Gérer tickets |
| Logs | Historique |

### 🔐 **Authentification**
- Connexion email/mot de passe
- Accès par rôle (client/admin)
- Upload photo profil (10MB max)

### 📱 **Captures d'écran**
*(Ajouter screenshots: login, dashboard client, admin, paramètres profil)*

### ⚙️ **Supabase**
1. Storage: bucket 'documents' (politiques pré-set)
2. Auth: Activer Email
3. Database: Tables auto-migrées
4. Edge Functions: Optionnel

### 💰 **Personnalisation**
- Couleurs: config Tailwind
- Fonctionnalités: Ajouter Stripe/PayPal
- White-label: Changer branding

### 🐛 **Support**
Contact: [votre-email]
Licence: Prêt Commercial

**Ready to Deploy & Sell! 💎**
