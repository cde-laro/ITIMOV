#!/bin/bash
# filepath: /Users/cdelarocque/ITINOV/entrypoint.sh

# Lancer le back NestJS en arrière-plan
cd /app/back && npm run start &

# Lancer le front Next.js (en mode production)
cd /app/front && npm run start