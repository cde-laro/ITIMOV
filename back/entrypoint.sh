#!/bin/sh
set -e

echo "Vérification de la présence de nc :"
which nc

# Attendre que MongoDB soit prêt
until nc -z mongodb 27017; do
  echo "En attente de MongoDB..."
  sleep 2
done

echo "MongoDB est prêt, import des films..."
ts-node scripts/import-tmdb-movies.ts # Execute the TypeScript file directly

echo "Démarrage de l'application NestJS..."
node dist/main.js