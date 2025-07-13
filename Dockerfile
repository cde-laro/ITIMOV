FROM node:20

WORKDIR /app

# Copie et build le back
COPY back/package*.json ./back/
RUN cd back && npm install

# Copie et build le front
COPY front/package*.json ./front/
RUN cd front && npm install

# Copie tout le code
COPY back ./back
COPY front ./front

# Build le front (Next.js)
RUN cd front && npm run build

# Build le back (NestJS)
RUN cd back && npm run build

# Expose le port du back (NestJS)
EXPOSE 3000

# Script d'entrée pour lancer les deux serveurs
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

CMD ["/entrypoint.sh"]