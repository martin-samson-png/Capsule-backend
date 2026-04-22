
# 💰 Expense Tracker API - Backend

Système de gestion financière robuste utilisant une architecture modulaire et une logique métier déportée en base de données.

## 🏗️ Architecture du Projet

Le backend suit une structure **Routes > Controller > Service** pour garantir une séparation claire des responsabilités :

* **Routes (`/routes`)** : Définit les points d'entrée de l'API. Applique le middleware d'authentification et déclenche les validations Joi avant d'appeler le contrôleur.
* **Controllers (`/controllers`)** : Orchestrent la logique de la requête. Ils extraient les données validées via `req.validateBody`, `req.validateParams` ou `req.validateQuery`.
* **Services (`/services`)** : Portent la logique métier (conversion de devises, formatage de dates) et communiquent avec Supabase via des appels RPC.

## 🚀 Stack Technique

* **Runtime** : Node.js & Express.
* **Langage** : TypeScript.
* **Authentification** : Gestion native via **Supabase Auth**. Utilisation de l'accessToken pour lier chaque action à l'utilisateur via `auth.uid()` côté SQL.
* **Validation** : [Joi](https://joi.dev/) - Schémas stricts pour le corps (`body`), les paramètres (`params`) et les filtres (`query`).
* **Base de données** : PostgreSQL (Supabase) avec fonctions stockées PL/pgSQL.

## 🗄️ Logique SQL & Intégrité

L'intelligence financière est centralisée dans la base de données via un système transactionnel complet :
* **Calcul des Deltas** : Fonctions PL/pgSQL dédiées gérant la répercussion de chaque modification sur les soldes des comptes (`balance_cents`).
* **Atomicité** : Chaque mouvement (dépense, transfert, contribution) est traité comme une transaction unique pour garantir la cohérence des soldes.
* **Sécurité Native** : Utilisation de `auth.uid()` pour restreindre l'exécution aux données de l'utilisateur authentifié.

## 🔧 Installation

1.  Installer les dépendances : `npm install`
2.  Configurer le `.env` avec les credentials Supabase.
3.  Lancer le serveur : `npm run dev`
