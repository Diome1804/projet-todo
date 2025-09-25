# API de Gestion des Tâches - Documentation Complète

## Vue d'ensemble

Cette API REST permet la gestion complète des tâches avec authentification, système de permissions et suivi d'historique. Elle est développée avec Node.js, Express, TypeScript et utilise Prisma ORM avec MySQL.

### Fonctionnalités principales
- ✅ CRUD complet des tâches
- ✅ Upload de photos pour les tâches
- ✅ Système d'authentification JWT
- ✅ Permissions déléguées sur les tâches
- ✅ Historique complet des actions
- ✅ Validation des données avec Zod
- ✅ Gestion d'erreurs structurée

### Port et Base URL
- **Port**: 3000
- **Base URL**: `http://localhost:3000`

## Installation et Configuration

### Prérequis
- Node.js (v16+)
- MySQL
- npm ou yarn

### Installation

1. **Cloner le projet**
```bash
git clone <repository-url>
cd <project-directory>
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration de la base de données**
   - Créer une base de données MySQL
   - Configurer la variable d'environnement `DATABASE_URL`
   - Exécuter les migrations Prisma :
```bash
npx prisma migrate dev
npx prisma generate
```

4. **Variables d'environnement**
Créer un fichier `.env` avec :
```env
DATABASE_URL="mysql://username:password@localhost:3306/database_name"
SECRET="your-jwt-secret"
```

5. **Démarrer le serveur**
```bash
npm run dev
```

## Modèle de données

### User (Utilisateur)
```typescript
{
  id: number;        // Identifiant unique
  email: string;     // Email unique
  password: string;  // Mot de passe hashé
}
```

### Task (Tâche)
```typescript
{
  id: number;              // Identifiant unique
  lex_name: string;        // Nom de la tâche
  lex_description: string; // Description
  completed: boolean;      // Statut de completion
  photoUrl?: string;       // URL de la photo (optionnel)
  userId: number;          // ID du propriétaire
  user: User;              // Relation avec l'utilisateur
  permissions: TaskPermission[]; // Permissions accordées
  logs: ActionLog[];       // Historique des actions
}
```

### TaskPermission (Permission)
```typescript
{
  id: number;        // Identifiant unique
  taskId: number;    // ID de la tâche
  granteeId: number; // ID de l'utilisateur autorisé
  canEdit: boolean;  // Permission de modification
  canDelete: boolean; // Permission de suppression
  task: Task;        // Relation avec la tâche
  grantee: User;     // Relation avec l'utilisateur autorisé
}
```

### ActionLog (Historique)
```typescript
{
  id: number;        // Identifiant unique
  taskId: number;    // ID de la tâche concernée
  actorId: number;   // ID de l'utilisateur qui a agi
  action: ActionType; // Type d'action (READ, UPDATE, DELETE, CREATE)
  createdAt: Date;   // Date de l'action
  details?: string;  // Détails optionnels
  task: Task;        // Relation avec la tâche
  actor: User;       // Relation avec l'utilisateur
}
```

### ActionType (Enum)
- `READ` - Consultation
- `UPDATE` - Modification
- `DELETE` - Suppression
- `CREATE` - Création

## Authentification

L'API utilise l'authentification JWT (JSON Web Token). Le token doit être inclus dans l'en-tête `Authorization` de chaque requête protégée.

### Format du token
```
Authorization: Bearer <your-jwt-token>
```

### Middleware d'authentification
Le middleware `authMiddleware` vérifie automatiquement la présence et la validité du token pour toutes les routes protégées.

## Endpoints

### 1. Routes d'Authentification (`/auth`)

#### POST /auth/login
Authentification d'un utilisateur.

**Requête:**
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Réponse (200):**
```json
{
  "token": "jwt-token-here",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

**Erreurs:**
- `400` - Email et mot de passe requis
- `401` - Identifiants invalides

#### POST /auth/register
Inscription d'un nouvel utilisateur.

**Requête:**
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Réponse (201):**
```json
{
  "message": "Utilisateur créé avec succès",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

### 2. Routes des Tâches (`/task`)

#### GET /task
Récupérer toutes les tâches (authentification non requise).

**Réponse (200):**
```json
[
  {
    "id": 1,
    "lex_name": "Ma tâche",
    "lex_description": "Description de la tâche",
    "completed": false,
    "photoUrl": "/uploads/photo.jpg",
    "userId": 1,
    "user": {
      "id": 1,
      "email": "user@example.com"
    }
  }
]
```

#### GET /task/:id
Récupérer une tâche spécifique.

**Paramètres:**
- `id` (number) - Identifiant de la tâche

**Réponse (200):**
```json
{
  "id": 1,
  "lex_name": "Ma tâche",
  "lex_description": "Description de la tâche",
  "completed": false,
  "photoUrl": "/uploads/photo.jpg",
  "userId": 1,
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

**Erreurs:**
- `404` - Tâche non trouvée

#### POST /task
Créer une nouvelle tâche (authentification requise).

**Requête (multipart/form-data):**
```http
POST /task
Authorization: Bearer <token>
Content-Type: multipart/form-data

lex_name: "Ma nouvelle tâche"
lex_description: "Description de la tâche"
photo: [fichier image] (optionnel)
```

**Réponse (201):**
```json
{
  "id": 2,
  "lex_name": "Ma nouvelle tâche",
  "lex_description": "Description de la tâche",
  "completed": false,
  "photoUrl": "/uploads/1757441263914-760887873.jpg",
  "userId": 1
}
```

**Erreurs:**
- `400` - Données invalides
- `401` - Token manquant ou invalide

#### PUT /task/:id
Modifier une tâche (authentification requise).

**Requête:**
```http
PUT /task/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "lex_name": "Tâche modifiée",
  "lex_description": "Nouvelle description",
  "completed": true
}
```

**Réponse (200):**
```json
{
  "id": 1,
  "lex_name": "Tâche modifiée",
  "lex_description": "Nouvelle description",
  "completed": true,
  "photoUrl": "/uploads/photo.jpg",
  "userId": 1
}
```

**Erreurs:**
- `403` - Non autorisé (pas propriétaire de la tâche)
- `404` - Tâche non trouvée

#### DELETE /task/:id
Supprimer une tâche (authentification requise).

**Requête:**
```http
DELETE /task/1
Authorization: Bearer <token>
```

**Réponse (200):**
```json
{
  "message": "Tâche supprimée"
}
```

**Erreurs:**
- `403` - Non autorisé
- `404` - Tâche non trouvée

#### PATCH /task/:id/completed
Marquer une tâche comme terminée (authentification requise).

**Requête:**
```http
PATCH /task/1/completed
Authorization: Bearer <token>
```

**Réponse (200):**
```json
{
  "id": 1,
  "lex_name": "Ma tâche",
  "lex_description": "Description",
  "completed": true,
  "photoUrl": "/uploads/photo.jpg",
  "userId": 1
}
```

#### POST /task/:id/permissions
Accorder des permissions sur une tâche (authentification requise).

**Requête (multipart/form-data):**
```http
POST /task/1/permissions
Authorization: Bearer <token>
Content-Type: multipart/form-data

granteeId: 2
canEdit: true
canDelete: false
```

**Réponse (200):**
```json
{
  "message": "Permission accordée"
}
```

**Erreurs:**
- `400` - Données invalides
- `403` - Non autorisé

#### DELETE /task/:id/permissions/:userId
Révoquer des permissions sur une tâche (authentification requise).

**Requête:**
```http
DELETE /task/1/permissions/2
Authorization: Bearer <token>
```

**Réponse (200):**
```json
{
  "message": "Permission révoquée"
}
```

### 3. Routes d'Historique (`/history`)

#### GET /history
Récupérer l'historique des actions (authentification requise).

**Paramètres de requête (optionnels):**
- `taskId` (number) - Filtrer par tâche
- `actorId` (number) - Filtrer par utilisateur
- `action` (ActionType) - Filtrer par type d'action
- `from` (Date) - Date de début
- `to` (Date) - Date de fin
- `page` (number) - Numéro de page (défaut: 1)
- `pageSize` (number) - Taille de page (défaut: 20, max: 100)

**Exemple de requête:**
```http
GET /history?taskId=1&action=UPDATE&page=1&pageSize=10
Authorization: Bearer <token>
```

**Réponse (200):**
```json
{
  "items": [
    {
      "id": 1,
      "taskId": 1,
      "actorId": 1,
      "action": "UPDATE",
      "details": null,
      "createdAt": "2024-01-01T10:00:00.000Z",
      "actor": {
        "id": 1,
        "email": "user@example.com"
      },
      "task": {
        "id": 1,
        "lex_name": "Ma tâche"
      }
    }
  ],
  "page": 1,
  "pageSize": 10,
  "total": 25,
  "totalPages": 3
}
```

## Gestion des erreurs

### Codes de statut HTTP
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

### Format des erreurs
```json
{
  "message": "Description de l'erreur",
  "issues": [
    {
      "code": "invalid_type",
      "expected": "string",
      "received": "undefined",
      "path": ["lex_name"],
      "message": "Le nom de l'utilisateur est obligatoire"
    }
  ]
}
```

### Messages d'erreur courants
- `TokenManquant` - Token manquant
- `TokenInvalide` - Token invalide
- `TacheNonTrouvee` - Tâche non trouvée
- `ValidationError` - Erreur de validation
- `ErreurServeur` - Erreur serveur
- `BAD_REQUEST` - La requête est invalide

## Exemples d'utilisation

### 1. Authentification et création d'une tâche

```bash
# 1. S'authentifier
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'

# 2. Créer une tâche avec photo
curl -X POST http://localhost:3000/task \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "lex_name=Ma nouvelle tâche" \
  -F "lex_description=Description de la tâche" \
  -F "photo=@/path/to/photo.jpg"
```

### 2. Récupérer l'historique

```bash
curl -X GET "http://localhost:3000/history?page=1&pageSize=20" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 3. Accorder des permissions

```bash
curl -X POST http://localhost:3000/task/1/permissions \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "granteeId=2" \
  -F "canEdit=true" \
  -F "canDelete=false"
```

## Structure du projet

```
src/
├── controllers/        # Contrôleurs
│   ├── TaskController.ts
│   ├── AuthController.ts
│   └── HistoryController.ts
├── services/          # Services métier
│   ├── TaskService.ts
│   ├── AuthService.ts
│   ├── HistoryService.ts
│   └── TokenService.ts
├── repositories/      # Couche d'accès aux données
│   ├── TaskRepository.ts
│   ├── UserRepository.ts
│   └── IRepository.ts
├── routes/           # Définition des routes
│   ├── TaskRoute.ts
│   ├── AuthRoute.ts
│   └── HistoryRoute.ts
├── middlewares/      # Middlewares Express
│   └── authMiddleware.ts
├── enums/           # Énumérations
│   ├── ErrorMessages.ts
│   └── HttpStatus.ts
├── validation/      # Schémas de validation
│   └── schemas/
│       ├── TaskSchemas.ts
│       └── AuthSchemas.ts
└── types/          # Définitions TypeScript
```

## Technologies utilisées

- **Runtime**: Node.js
- **Framework**: Express.js
- **Langage**: TypeScript
- **Base de données**: MySQL
- **ORM**: Prisma
- **Validation**: Zod
- **Authentification**: JSON Web Token
- **Upload de fichiers**: Multer

## Support et maintenance

Pour toute question ou problème, veuillez consulter la documentation ou contacter l'équipe de développement.

---
*Documentation générée automatiquement - Dernière mise à jour : Janvier 2024*
