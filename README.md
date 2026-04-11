<div align="center">

# ⌚ Belle Montre Wallone — Boutique de Montres en Ligne

**SPA e-commerce avec système de réservation, API PHP native & stack conteneurisée**

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-JS-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![PHP](https://img.shields.io/badge/PHP-Native-777BB4?style=for-the-badge&logo=php&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-9.5-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

</div>

---

## 📋 Table des Matières

- [Aperçu](#-aperçu)
- [Fonctionnalités](#-fonctionnalités)
- [Stack Technologique](#️-stack-technologique)
- [Architecture du Projet](#-architecture-du-projet)
- [Prérequis](#-prérequis)
- [Getting Started](#-getting-started)
- [Variables d'Environnement](#️-variables-denvironnement)
- [Endpoints API](#-endpoints-api)

---

## 🔍 Aperçu

Belle Montre Wallone est un monorepo découplé frontend/backend pour une boutique de montres en ligne. Le frontend est une SPA React servie par Vite. Le backend est une API REST construite en PHP natif avec un système de routing custom, une architecture MVC allégée et une authentification JWT. L'ensemble tourne dans des conteneurs Docker orchestrés via `docker-compose`.

---

## ✨ Fonctionnalités

### 🌐 Interface Publique & Utilisateurs

- 🏠 **Home** — Landing page de la boutique
- 🗂️ **Collection** — Catalogue complet des montres disponibles
- 🔎 **Détail Montre** — Fiche produit complète par référence
- 📝 **Inscription / Connexion** — Authentification utilisateur avec session JWT
- 📅 **Réservation** — Les utilisateurs authentifiés peuvent réserver une montre
- 💬 **Aide & Contact** — Page de support client

### 🔐 Interface Administration (JWT + API Key)

- 🛠️ **Gestion du Catalogue** — CRUD complet sur les montres (ajout, édition, suppression)
- 📋 **Gestion des Réservations** — Suivi et administration des réservations clients

---

## 🛠️ Stack Technologique

| Couche | Technologie | Rôle |
|---|---|---|
| **Frontend** | React 18 + JSX | Composants UI, state management |
| **Bundler** | Vite JS | Dev server HMR, build optimisé |
| **Routing client** | React Router DOM v6 | Navigation SPA |
| **Styles** | CSS natif (`styles.css`) | Styling global |
| **Backend** | PHP natif | API REST, front controller pattern |
| **Base de données** | MySQL 9.5 | Persistance des données |
| **Auth** | JWT | Sécurisation des routes protégées |
| **DevOps** | Docker & Docker Compose | Conteneurisation et orchestration |
| **Admin DB** | PhpMyAdmin | Interface visuelle MySQL |

---

## 📁 Architecture du Projet

```
projet-ti/
│
├── frontend/                   # SPA React
│   ├── src/
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── CollectionPage.jsx
│   │   │   ├── WatchDetailPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── HelpPage.jsx
│   │   │   ├── AdminWatchPage.jsx
│   │   │   └── AdminReservationsPage.jsx
│   │   ├── App.jsx
│   │   └── styles.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── backend/                    # API REST PHP natif
│   ├── index.php               # Front Controller
│   ├── Routes/                 # Définition des routes
│   │   ├── watch.routes.php
│   │   ├── reservation.routes.php
│   │   ├── auth.routes.php
│   │   └── contact.routes.php
│   ├── Core/                   # Noyau applicatif (Router, DB, Auth)
│   └── Utils/                  # Helpers (JWT, response formatter...)
│
└── docker-compose.yml          # Orchestration : backend + db + phpmyadmin
```

---

## ✅ Prérequis

- [Docker](https://www.docker.com/get-started) ≥ 24.x
- [Docker Compose](https://docs.docker.com/compose/) v2+
- [Node.js](https://nodejs.org/) ≥ 18.x + npm (pour le frontend en dev local)

---

## 🚀 Getting Started

### 1. Cloner le repo

```bash
git clone https://github.com/ton-user/projet-ti.git
cd projet-ti
```

### 2. Configurer les variables d'environnement

Copier et ajuster le fichier d'environnement avant de lancer quoi que ce soit :

```bash
cp .env.example .env
# Éditer .env avec tes valeurs (JWT_SECRET, ADMIN_API_KEY, etc.)
```

### 3. Lancer le backend (Docker)

```bash
docker-compose up -d
```

| Service | URL |
|---|---|
| API Backend | `http://localhost:8080` |
| PhpMyAdmin | `http://localhost:8081` |
| MySQL | `localhost:3306` |

> Les conteneurs `backend`, `db` et `phpmyadmin` démarrent en mode détaché. Les variables d'environnement sont injectées directement depuis `docker-compose.yml`.

### 4. Lancer le frontend (Dev)

```bash
cd frontend
npm install
npm run dev
```

Le dev server Vite démarre sur **`http://localhost:5173`** avec HMR activé.

---

## ⚙️ Variables d'Environnement

Ces variables sont injectées dans les conteneurs via `docker-compose.yml`.

```env
# Application
APP_ENV=development

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:5173

# Base de données
MYSQL_DATABASE=projet_ti
MYSQL_USER=db_user
MYSQL_PASSWORD=db_password
MYSQL_ROOT_PASSWORD=root_password

# Sécurité & Auth
JWT_SECRET=your_jwt_secret_key
ADMIN_USER=admin
ADMIN_PASSWORD=admin_password
ADMIN_API_KEY=your_api_key_here
```

> ⚠️ Ne jamais committer `.env` avec des valeurs réelles. Ajouter `.env` au `.gitignore`.

---

## 📡 Endpoints API

> Base URL : `http://localhost:8080`

| Méthode | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/register` | — | Inscription utilisateur |
| `POST` | `/auth/login` | — | Connexion, retourne JWT |
| `GET` | `/watches` | — | Liste du catalogue |
| `GET` | `/watches/:id` | — | Détails d'une montre |
| `POST` | `/watches` | JWT + API Key | Ajouter une montre (admin) |
| `PUT` | `/watches/:id` | JWT + API Key | Modifier une montre (admin) |
| `DELETE` | `/watches/:id` | JWT + API Key | Supprimer une montre (admin) |
| `POST` | `/reservations` | JWT | Créer une réservation |
| `GET` | `/reservations` | JWT + API Key | Lister toutes les réservations (admin) |
| `POST` | `/contact` | — | Envoyer un message de contact |

---

<div align="center">

*Belle Montre Wallone — Architecture modulaire, stack moderne, zéro dépendance superflue.*

</div>