#!/bin/bash

# Créer le fichier .env avec la variable VITE_API_URL
echo "VITE_API_URL=${VITE_API_URL}" > .env

# Build et start
npm run build && npm start

