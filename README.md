# Task Management Application

Une application full-stack de gestion de tâches avec authentification utilisateur, permissions, historique des actions et support des fichiers multimédias.

## 🚀 Fonctionnalités

- **Authentification utilisateur** : Inscription et connexion avec JWT
- **Gestion des tâches** : Créer, lire, modifier, supprimer des tâches
- **Permissions** : Partage de tâches avec d'autres utilisateurs (lecture/édition/suppression)
- **Historique** : Suivi des actions effectuées sur les tâches
- **Uploads de fichiers** : Support des photos et enregistrements audio
- **Interface moderne** : React avec Tailwind CSS
- **API REST** : Backend TypeScript avec Express.js

## 🛠️ Technologies utilisées

### Backend
- **Node.js** avec **Express.js**
- **TypeScript**
- **Prisma ORM** avec **MySQL**
- **JWT** pour l'authentification
- **Multer** pour les uploads de fichiers
- **bcryptjs** pour le hashage des mots de passe
- **Zod** pour la validation

### Frontend
- **React 19** avec **Vite**
- **React Router** pour la navigation
- **Tailwind CSS** pour le styling
- **Axios** pour les appels API
- **Lucide React** pour les icônes

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé :
- **Node.js** (version 18 ou supérieure)
- **npm** ou **yarn**
- **MySQL** (ou un serveur MySQL compatible)

## ⚙️ Installation et Configuration

### 1. Cloner le projet
```bash
git clone <url-du-repo>
cd <nom-du-projet>
```

### 2. Configuration de la base de données

Créez une base de données MySQL et notez les informations de connexion.

### 3. Configuration des variables d'environnement

Créez un fichier `.env` dans le dossier `src/` :
```env
# Configuration du serveur
PORT=3000
NODE_ENV=development

# URL du frontend (pour la production)
FRONTEND_URL=http://localhost:5173

# Clé secrète pour les tokens JWT (changez-la !)
SECRET=votre-cle-secrete-unique-ici

# URL de la base de données MySQL
DATABASE_URL="mysql://username:password@localhost:3306/database_name"
```

### 4. Installation des dépendances

#### Backend :
```bash
npm install
```

#### Frontend :
```bash
cd Front-task
npm install
cd ..
```

### 5. Configuration de la base de données

```bash
# Générer le client Prisma
npx prisma generate

# Appliquer les migrations
npx prisma migrate dev

# (Optionnel) Peupler la base avec des données de test
npm run db:seed
```

## 🚀 Démarrage de l'application

### Démarrer le backend :
```bash
# Compiler TypeScript
npm run build

# Démarrer le serveur
npm start

# Ou en mode développement (avec rechargement automatique)
npm run dev
```

Le backend sera accessible sur `http://localhost:3000`

### Démarrer le frontend :
```bash
cd Front-task
npm run dev
```

Le frontend sera accessible sur `http://localhost:5173`

## 🧪 Test de l'application

### Comptes de test (si vous avez utilisé le seed)
- **Email** : `alice@example.com` ou `bob@example.com`
- **Mot de passe** : `password123`

### Fonctionnalités à tester :

1. **Inscription/Connexion**
   - Créez un nouveau compte ou utilisez un compte existant
   - Vérifiez que la navigation fonctionne après connexion

2. **Gestion des tâches**
   - Créez une nouvelle tâche avec nom et description
   - Modifiez une tâche existante
   - Marquez une tâche comme terminée
   - Supprimez une tâche

3. **Uploads de fichiers**
   - Ajoutez une photo à une tâche
   - Enregistrez un audio pour une tâche
   - Vérifiez que les fichiers sont accessibles via `/uploads/`

4. **Permissions**
   - Partagez une tâche avec un autre utilisateur
   - Testez les permissions de lecture/édition/suppression
   - Vérifiez que les restrictions fonctionnent

5. **Historique**
   - Consultez l'historique des actions sur les tâches
   - Vérifiez que toutes les modifications sont tracées

## 📁 Structure du projet

```
/
├── src/                    # Backend (Node.js/TypeScript)
│   ├── controllers/        # Contrôleurs API
│   ├── routes/            # Routes Express
│   ├── services/          # Logique métier
│   ├── middlewares/       # Middlewares personnalisés
│   ├── repositories/      # Accès aux données
│   ├── types/             # Types TypeScript
│   ├── utils/             # Utilitaires
│   └── index.ts           # Point d'entrée
├── Front-task/            # Frontend (React)
│   ├── src/
│   │   ├── components/    # Composants React
│   │   ├── pages/         # Pages de l'application
│   │   ├── context/       # Context React
│   │   ├── hooks/         # Hooks personnalisés
│   │   └── services/      # Services API
│   └── public/            # Assets statiques
├── prisma/                # Configuration base de données
│   ├── schema.prisma      # Schéma Prisma
│   ├── seed.js           # Données de test
│   └── migrations/        # Migrations DB
├── uploads/               # Fichiers uploadés
└── package.json           # Dépendances backend
```

## 🔧 Scripts disponibles

### Backend
- `npm run build` : Compiler TypeScript
- `npm start` : Démarrer le serveur en production
- `npm run dev` : Démarrer en mode développement
- `npm run db:seed` : Peupler la base de données

### Frontend
- `npm run dev` : Démarrer le serveur de développement
- `npm run build` : Build pour la production
- `npm run preview` : Prévisualiser le build

## 
Dépannage

### Problèmes courants :

1. **Erreur de connexion à la base de données**
   - Vérifiez que MySQL est démarré
   - Vérifiez les credentials dans `DATABASE_URL`

2. **Erreur CORS**
   - Assurez-vous que le frontend tourne sur un port autorisé (5173 par défaut)
   - Vérifiez la configuration CORS dans `src/index.ts`

3. **Uploads qui ne fonctionnent pas**
   - Vérifiez que le dossier `uploads/` existe et est accessible en écriture
   - Vérifiez la taille limite des fichiers dans la configuration

4. **Token JWT expiré**
   - Reconnectez-vous à l'application

## 📞 Support

Si vous rencontrez des problèmes lors du test, vérifiez :
1. Les logs du terminal pour les erreurs
2. La console du navigateur (F12) pour les erreurs frontend
3. Les variables d'environnement
4. La configuration de la base de données

## 🎯 Fonctionnalités avancées

- **Pagination** : Support de la pagination pour les listes longues
- **Recherche et filtrage** : Interface pour filtrer les tâches
- **Responsive design** : Fonctionne sur mobile et desktop
- **Sécurité** : Protection CSRF, validation des données, sanitisation

---

Bonne découverte de l'application ! 🚀
