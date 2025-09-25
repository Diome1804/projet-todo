# Architecture du Projet React

## Vue d'ensemble

Cette architecture suit les meilleures pratiques de React avec une séparation claire des responsabilités et une structure modulaire.

## Structure des dossiers

```
src/
├── components/          # Composants UI réutilisables
│   ├── forms/           # Formulaires (ex: TaskForm, LoginForm)
│   ├── tasks/           # Composants liés aux tâches
│   │   ├── TaskList.jsx
│   │   ├── TaskCard.jsx
│   │   ├── TaskDetail.jsx
│   │   └── TaskForm.jsx
│   ├── auth/            # Composants liés à l'authentification
│   │   ├── LoginForm.jsx
│   │   └── RegisterForm.jsx
│   ├── history/         # Composants pour l'historique
│   │   └── HistoryList.jsx
│   └── ui/              # Petits composants génériques (Button, Input, Modal, Loader)
│
├── pages/               # Pages principales (correspondent aux routes)
│   ├── Dashboard.jsx
│   ├── TaskPage.jsx
│   ├── HistoryPage.jsx
│   ├── LoginPage.jsx
│   └── RegisterPage.jsx
│
├── services/            # Appels API centralisés
│   ├── apiClient.js     # axios configuré avec baseURL et interceptors
│   ├── authService.js
│   └── taskService.js
│
├── hooks/               # Custom hooks
│   ├── useAuth.js
│   └── useTasks.js
│
├── context/             # Contexts globaux (state global)
│   ├── AuthContext.jsx  # pour gérer le user + token
│   └── TaskContext.jsx  # si besoin de globaliser les tâches
│
├── routes/              # Gestion des routes
│   └── AppRouter.jsx
│
├── utils/               # Fonctions utilitaires (validators, formatters, constants)
│   └── validators.js
│
├── styles/              # Styles globaux
│   └── tailwind.css     # si tu utilises Tailwind
│
├── App.jsx              # Composant racine
└── main.jsx             # Point d'entrée
```

## Principes de l'architecture

### 1. **Composants modulaires**
- Chaque composant a une responsabilité unique
- Les composants sont réutilisables
- Séparation claire entre UI et logique métier

### 2. **Gestion d'état centralisée**
- Context API pour l'état global
- Custom hooks pour la logique réutilisable
- Réduction de la prop drilling

### 3. **Services pour les API**
- Centralisation des appels API
- Configuration axios avec interceptors
- Gestion automatique des tokens d'authentification

### 4. **Routing organisé**
- Routes centralisées dans AppRouter
- Protection des routes privées
- Navigation cohérente

### 5. **Utilitaires partagés**
- Validateurs réutilisables
- Constantes centralisées
- Fonctions utilitaires

## Avantages de cette architecture

- **Maintenabilité**: Code organisé et facile à maintenir
- **Réutilisabilité**: Composants et hooks réutilisables
- **Testabilité**: Séparation claire des responsabilités
- **Évolutivité**: Structure qui grandit bien avec le projet
- **Performance**: Optimisations possibles avec React.memo, useMemo, etc.

## Utilisation recommandée

1. **Pour les nouveaux composants**: Créer dans le dossier approprié selon leur fonction
2. **Pour les appels API**: Toujours passer par les services
3. **Pour l'état global**: Utiliser les contexts fournis
4. **Pour la logique réutilisable**: Créer des custom hooks
5. **Pour les styles**: Utiliser les classes Tailwind dans tailwind.css

## Installation des dépendances

```bash
npm install react-router-dom
```

## Démarrage du projet

```bash
npm run dev
