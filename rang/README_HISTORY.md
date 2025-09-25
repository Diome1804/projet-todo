# Endpoint d’historique des actions

## Migration Prisma

1. Configurez DATABASE_URL dans .env (MySQL).
2. Exécutez les commandes:

```
npx prisma migrate dev --name add_action_log
npx prisma generate
```

## Démarrage

```
npm run build
npm start
```

Le serveur écoute sur http://localhost:3000.

## Endpoint

GET /history

Query params (tous optionnels):
- taskId: number
- actorId: number
- action: READ | UPDATE | DELETE | CREATE
- from: date ISO (ex: 2025-09-01)
- to: date ISO
- page: number >= 1 (défaut 1)
- pageSize: 1..100 (défaut 20)

Réponse:
{
  items: [
    {
      id, taskId, actorId, action, details, createdAt,
      actor: { id, email },
      task: { id, lex_name }
    }
  ],
  page, pageSize, total, totalPages
}

Note: l’accès est protégé par authMiddleware.

## Exemples curl

- Historique d’une tâche
```
curl -sS "http://localhost:3000/history?taskId=12" -H "Authorization: Bearer <TOKEN>"
```

- Filtres avancés
```
curl -sS "http://localhost:3000/history?actorId=3&action=UPDATE&from=2025-09-01&to=2025-09-12&page=1&pageSize=20" -H "Authorization: Bearer <TOKEN>"
```

- Pagination simple
```
curl -sS "http://localhost:3000/history?page=2&pageSize=50" -H "Authorization: Bearer <TOKEN>"
```
