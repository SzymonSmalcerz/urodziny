#!/usr/bin/env bash
# Deploy najnowszych zmian z GitHuba na produkcję.
# Użycie (na dropletcie): bash /var/www/kasia/deploy.sh
set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/urodziny}"
APP_NAME="${APP_NAME:-kasia}"
BRANCH="${BRANCH:-main}"

cd "$APP_DIR"

echo "→ git fetch & reset do origin/$BRANCH"
git fetch --all --prune
git reset --hard "origin/$BRANCH"

if git diff --name-only HEAD@{1} HEAD | grep -qE '^(package\.json|package-lock\.json)$'; then
  echo "→ zmiany w package.json — npm install"
  npm install --omit=dev
else
  echo "→ brak zmian w package.json — pomijam npm install"
fi

echo "→ pm2 restart $APP_NAME"
pm2 restart "$APP_NAME" --update-env

echo "✓ deploy zakończony"
pm2 status "$APP_NAME"
