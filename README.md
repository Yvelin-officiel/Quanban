## 📑 Rapport technique

### Choix techniques et justifications

- **Node.js + Express** : Choix pour la rapidité de développement, l'écosystème riche et la compatibilité avec Azure.
- **Azure SQL Database** : Base de données managée, haute disponibilité, sauvegardes automatiques et intégration native avec Azure.
- **React + TypeScript** : Pour un frontend moderne, typé et maintenable, avec une expérience utilisateur fluide.
- **Tailwind CSS** : Permet un design rapide, responsive et cohérent.
- **Vite** : Outil de build rapide pour le développement React moderne.

## 📋 Structure de la base de données

L'application utilise 3 tables principales :

### Users (Utilisateurs)
- `id` INT (PK)
- `username` VARCHAR(255) NOT NULL
- `email` VARCHAR(255) UNIQUE NOT NULL
- `name` VARCHAR(100)
- `created_at` DATETIME
- `updated_at` DATETIME

### Boards (Tableaux)
- `id` INT (PK)
- `title` VARCHAR(255) NOT NULL
- `description` TEXT
- `created_at` DATETIME
- `updated_at` DATETIME

### Columns (Colonnes)
- `id` INT (PK)
- `board_id` INT (FK vers Boards)
- `title` VARCHAR(255) NOT NULL
- `position` INT
- `created_at` DATETIME
- `updated_at` DATETIME

### Tasks (Tâches)
- `id` INT (PK)
- `column_id` INT (FK vers Columns)
- `title` VARCHAR(255) NOT NULL
- `description` TEXT
- `position` INT
- `priority` VARCHAR(10) CHECK (priority IN ('low', 'medium', 'high'))
- `due_date` DATETIME
- `created_at` DATETIME
- `updated_at` DATETIME

### Architecture déployée sur Azure

- **Backend** : Déployé sur Azure App Service (Web App for Containers ou Node.js App Service).
- **Base de données** : Azure SQL Database (mode serveur unique).
- **Frontend** : Déployé sur Azure Static Web Apps ou Azure App Service.
- **Connexion sécurisée** : Communication chiffrée entre backend et base de données via TLS.
- **Gestion des secrets** : Utilisation d’Azure Key Vault recommandée pour stocker les identifiants de connexion.

_Schéma simplifié :_

```
[Utilisateur] 
   │
   ▼
[Frontend React (Azure Static Web Apps)]
   │
   ▼
[Backend Node.js (Azure App Service)]
   │
   ▼
[Azure SQL Database]
```

### Difficultés rencontrées et solutions apportées

- **Connexion à Azure SQL depuis Node.js** : Problèmes de firewall et de configuration TLS. Solution : autoriser l’adresse IP du backend dans le firewall Azure SQL et activer `encrypt: true` dans la chaîne de connexion.
- **Synchronisation des tables** : Risque d’initialisation multiple. Solution : vérification de l’existence des tables avant création.
- **Gestion des relations et suppressions en cascade** : Utilisation des contraintes SQL `ON DELETE CASCADE` pour garantir la cohérence des données.
- **Déploiement continu** : Mise en place de GitHub Actions pour automatiser le déploiement sur Azure.

### Estimation des coûts Azure

| Ressource                   | Offre gratuite                                      | Coût estimé (mensuel) |
|-----------------------------|-----------------------------------------------------|-----------------------|
| **Azure SQL Database**      | 250 Go gratuits (12 mois) ou env. 5 €/mois pour S0  | 5–15 €                |
| **Azure App Service**       | Gratuit (F1) ou env. 10 €/mois (B1)                 | 0–10 €                |
| **Azure Static Web Apps**   | Gratuit pour usage basique                          | 0 €                   |
| **Stockage (logs, backups)**| Inclus dans les offres de base                      | 0–2 €                 |

> **Total estimé** : 5 à 25 €/mois selon la charge et les options choisies (hors offre gratuite).
