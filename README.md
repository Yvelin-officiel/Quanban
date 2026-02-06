## 📑 Rapport technique

### Choix techniques et justifications

- **Node.js + Express** : Pour un backend simple rapide à mettre en place
- **React** : Pour un frontend rapide à mettre en place.
- **Azure SQL Database** : Base de données managée, haute disponibilité, sauvegardes automatiques et intégration native avec Azure.
- **Github actions** : Pour les pipelines CI/CD

### Architecture déployée sur Azure

- **Backend** : Déployé sur Azure App Service (Web App for Containers ou Node.js App Service).
- **Base de données** : Azure SQL Database (mode serveur unique).
- **Frontend** : Déployé sur Azure Static Web Apps ou Azure App Service.
- **Gestion des secrets** : Utilisation d’Azure Key Vault pour stocker les données sensible.
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

- **Variables d'environnement avec Azure** : Utilisations de key vault plutôt que app config car ça nous semblait plus simple

### Estimation des coûts Azure

| Ressource                   | Offre gratuite                                      | Coût estimé (mensuel) |
|-----------------------------|-----------------------------------------------------|-----------------------|
| **Azure SQL Database**      | 250 Go gratuits (12 mois) ou env. 5 €/mois pour S0  | 5–15 €                |
| **Azure App Service**       | Gratuit (F1) ou env. 10 €/mois (B1)                 | 0–10 €                |
| **Azure Static Web Apps**   | Gratuit pour usage basique                          | 0 €                   |
| **Stockage (logs, backups)**| Inclus dans les offres de base                      | 0–2 €                 |

> **Total estimé** : 5 à 25 €/mois selon la charge et les options choisies (hors offre gratuite).

## 📋 Structure de la base de données

L'application utilise 3 tables principales :

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
