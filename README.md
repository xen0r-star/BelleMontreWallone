<div align="center">

# Belle Montre Wallone

Plateforme e-commerce de montres avec frontend React, API PHP native, MySQL et deploiement Docker.

<img src="apps/frontend/public/icons/bmw_icon_big.png" alt="Logo Belle Montre Wallone" width="220" />

[![CI/CD - Build & Deploy](https://github.com/xen0r-star/BelleMontreWallone/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/xen0r-star/BelleMontreWallone/actions/workflows/deploy.yml)
[![Deploiement](https://img.shields.io/badge/Deploy-OVH-success?style=flat-square)](https://github.com/xen0r-star/BelleMontreWallone/actions/workflows/deploy.yml)
[![Licence MIT](https://img.shields.io/badge/Licence-MIT-green.svg)](LICENSE)

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-JS-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![PHP](https://img.shields.io/badge/PHP-Native-777BB4?style=for-the-badge&logo=php&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-9.5-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

</div>

## Table des matieres

- [Presentation](#presentation)
- [Architecture](#architecture)
- [CI/CD](#cicd)
- [Lancer le projet en local](#lancer-le-projet-en-local)
- [Endpoints API](#endpoints-api)
- [Contributeurs](#contributeurs)
- [Licence](#licence)

## Presentation

Belle Montre Wallone est un monorepo npm structure en workspaces:

- frontend SPA React + Vite dans apps/frontend
- backend API REST PHP native dans apps/backend
- base MySQL initialisee automatiquement via scripts SQL
- orchestration Docker Compose, avec routage de production via Traefik

Le site est publie en production sur: https://www.bellemontrewallone.store

## Architecture

```mermaid
flowchart LR
    U[Utilisateur] --> FE[Frontend React Vite\napps/frontend]
    FE -->|HTTP /api| BE[Backend PHP\napps/backend/public/index.php]
    BE --> RT[Router custom\napps/backend/src/Routes/routes.php]
    RT --> AUTH[Auth routes]
    RT --> W[Watches routes]
    RT --> RES[Reservation routes]
    RT --> ADM[Admin routes]
    RT --> C[Contact routes]
    AUTH --> DB[(MySQL 9.5)]
    W --> DB
    RES --> DB
    ADM --> DB
    C --> DB

    subgraph Docker Compose
      FE
      BE
      DB
    end

    TR[Traefik production] --> FE
    TR -->|PathPrefix /api| BE
```

## CI/CD

Le workflow GitHub Actions est defini dans .github/workflows/deploy.yml.

Il couvre:

- detection des changements frontend/backend
- verification frontend (installation et build)
- verification backend (lint PHP, validation, test Docker Compose)
- deploiement backend sur OVH
- deploiement frontend sur OVH
- resume final des jobs

Declenchement:

- push sur main
- pull_request vers main

## Lancer le projet en local

### 1. Cloner le repository

```bash
git clone https://github.com/xen0r-star/BelleMontreWallone.git
cd BelleMontreWallone
```

### 2. Installer les dependances frontend

```bash
npm install
```

### 3. Lancer backend + base de donnees (compose local)

```bash
cd apps/backend
docker compose up -d
cd ../..
```

### 4. Lancer le frontend en developpement

```bash
npm run frontend:dev
```

Frontend local: http://localhost:5173

Backend local: http://localhost:8080/api

PhpMyAdmin local: http://localhost:8081

## Endpoints API

Base API de production: https://www.bellemontrewallone.store/api

| Methode | Endpoint            | Protection                     | Description                  |
| ------- | ------------------- | ------------------------------ | ---------------------------- |
| GET     | /health             | Aucune                         | Etat de sante API            |
| GET     | /watches            | Aucune                         | Liste paginee des montres    |
| GET     | /watches/filter     | Aucune                         | Valeurs de filtres catalogue |
| GET     | /watches/:id        | Aucune                         | Detail montre                |
| POST    | /auth/register      | Aucune                         | Inscription utilisateur      |
| POST    | /auth/login         | Aucune                         | Connexion utilisateur        |
| POST    | /auth/logout        | Session (cookie refresh_token) | Deconnexion utilisateur      |
| POST    | /auth/refresh       | Refresh token (body JSON)      | Renouvellement de session    |
| GET     | /auth/me            | Auth (cookie access_token)     | Utilisateur courant          |
| POST    | /reservations       | Auth (cookie access_token)     | Creation reservation         |
| POST    | /contact            | Aucune                         | Envoi formulaire de contact  |
| POST    | /admin/watches      | Admin                          | Creation montre              |
| PUT     | /admin/watches/:id  | Admin                          | Mise a jour montre           |
| DELETE  | /admin/watches/:id  | Admin                          | Desactivation montre         |
| GET     | /admin/reservations | Admin                          | Liste reservations           |

## Contributeurs

Usernames GitHub detectes dans les commits du repo:

- xen0r-star
- TomusLeVrai
- Coco-Lapin
- Bapum755

## Licence

Projet sous licence MIT. Voir LICENSE.