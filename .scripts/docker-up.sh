#!/usr/bin/env bash

docker compose --profile app up -d

echo "ℹ️  Waiting for database to be ready (dev dump restore included)..."
RETRIES=60
COUNT=0

# On attend qu'une table du dump restauré soit interrogeable : pg_isready répond "ready"
# dès la phase d'init (serveur temporaire socket-only), soit avant la fin du pg_restore.
until docker exec potentiel_db psql -U postgres_admin -d potentiel -tAc "select 1 from domain_public_statistic.carto_projet_statistic limit 1" >/dev/null 2>&1 || [ $COUNT -eq $RETRIES ]; do
    echo "⚠️ Try $COUNT : PostgreSQL isn't ready ..."
    sleep 2
    ((COUNT++))
done

if [ $COUNT -eq $RETRIES ]; then
    echo "❌ Error : Timeout - PostgreSQL isn't ready after $RETRIES retries."
    exit 1
fi

# Petite marge : la restauration peut se terminer sur le serveur temporaire (socket only)
# juste avant que l'entrypoint ne relance Postgres en écoute TCP.
sleep 2

echo "✅ PostgreSQL is ready !"
exit 0