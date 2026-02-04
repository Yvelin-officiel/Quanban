# Quanban - Application Kanban avec Azure SQL

Application Kanban complète pour apprendre Azure SQL et le développement cloud.

## 🏗️ Architecture

- **Backend**: Node.js + Express + Azure SQL Database
- **Frontend**: React + TypeScript + Tailwind CSS + Vite
- **Base de données**: Azure SQL Database

## 📋 Structure de la base de données

L'application utilise 3 tables principales :

### Boards (Tableaux)
- `id` : Identifiant unique
- `title` : Titre du tableau
- `description` : Description (optionnel)
- `created_at` / `updated_at` : Timestamps

### Columns (Colonnes)
- `id` : Identifiant unique
- `board_id` : Référence au tableau
- `title` : Titre de la colonne
- `position` : Position dans le tableau
- `created_at` / `updated_at` : Timestamps

### Tasks (Tâches)
- `id` : Identifiant unique
- `column_id` : Référence à la colonne
- `title` : Titre de la tâche
- `description` : Description détaillée
- `position` : Position dans la colonne
- `priority` : Priorité (low, medium, high)
- `due_date` : Date d'échéance (optionnel)
- `created_at` / `updated_at` : Timestamps

## 🚀 Configuration

### 1. Créer une base de données Azure SQL

1. Allez sur le portail Azure (https://portal.azure.com)
2. Créez une nouvelle base de données SQL
3. Notez les informations de connexion :
   - Nom du serveur (ex: your-server.database.windows.net)
   - Nom de la base de données
   - Nom d'utilisateur
   - Mot de passe

### 2. Configuration du Backend

```bash
cd back
cp .env.example .env
```

Éditez le fichier `.env` avec vos informations Azure SQL :

```env
DB_USER=votre_utilisateur
DB_PASSWORD=votre_mot_de_passe
DB_SERVER=votre-serveur.database.windows.net
DB_NAME=votre_base_de_donnees
PORT=3000
```

Installez les dépendances et démarrez :

```bash
npm install
npm run dev
```

Le serveur démarre sur http://localhost:3000 et crée automatiquement les tables au démarrage.

### 3. Configuration du Frontend

```bash
cd front
cp .env.example .env
```

Éditez le fichier `.env` :

```env
VITE_API_URL=http://localhost:3000/api
```

Installez les dépendances et démarrez :

```bash
npm install
npm run dev
```

L'application frontend démarre sur http://localhost:5173

## 📡 API Endpoints

### Boards
- `GET /api/boards` - Liste tous les tableaux
- `GET /api/boards/:id` - Détails d'un tableau
- `GET /api/boards/:id/details` - Tableau avec colonnes et tâches
- `POST /api/boards` - Créer un tableau
- `PUT /api/boards/:id` - Modifier un tableau
- `DELETE /api/boards/:id` - Supprimer un tableau

### Columns
- `GET /api/columns/board/:boardId` - Colonnes d'un tableau
- `GET /api/columns/:id` - Détails d'une colonne
- `POST /api/columns` - Créer une colonne
- `PUT /api/columns/:id` - Modifier une colonne
- `DELETE /api/columns/:id` - Supprimer une colonne

### Tasks
- `GET /api/tasks/column/:columnId` - Tâches d'une colonne
- `GET /api/tasks/board/:boardId` - Tâches d'un tableau
- `GET /api/tasks/:id` - Détails d'une tâche
- `POST /api/tasks` - Créer une tâche
- `PUT /api/tasks/:id` - Modifier une tâche
- `DELETE /api/tasks/:id` - Supprimer une tâche

## 🎯 Fonctionnalités

- ✅ Créer, modifier et supprimer des tableaux Kanban
- ✅ Gérer les colonnes (ex: À faire, En cours, Terminé)
- ✅ Créer et gérer des tâches avec priorités
- ✅ Interface intuitive et responsive
- ✅ Connexion sécurisée à Azure SQL
- ✅ Initialisation automatique de la base de données

## 📚 Concepts Azure SQL utilisés

- **Connexion chiffrée** : `encrypt: true` pour sécuriser les communications
- **Connection pooling** : Gestion optimale des connexions
- **Paramètres SQL** : Protection contre les injections SQL
- **Transactions** : Intégrité des données avec CASCADE DELETE
- **Timestamps automatiques** : `GETDATE()` pour l'audit

## 🔧 Scripts disponibles

### Backend
- `npm start` - Démarrer en production
- `npm run dev` - Démarrer en mode développement

### Frontend
- `npm run dev` - Démarrer le serveur de développement
- `npm run build` - Build pour la production
- `npm run preview` - Prévisualiser le build

## 📝 Notes

- Les tables sont créées automatiquement au démarrage du serveur
- Les relations CASCADE DELETE assurent la cohérence des données
- L'API utilise des requêtes paramétrées pour la sécurité

## 🎓 Apprentissage

Ce projet permet d'apprendre :
- Configuration et connexion à Azure SQL
- Création de tables et relations SQL
- API REST avec Express
- Frontend React avec TypeScript
- Gestion d'état dans une application
- Communication frontend/backend