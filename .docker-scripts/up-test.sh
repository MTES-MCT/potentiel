#!/usr/bin/env bash

docker compose --profile test up -d

echo "ℹ️  Waiting for database to be ready..."
RETRIES=10
COUNT=0

until docker exec potentiel_db_tests_integration pg_isready -U postgres_admin -d potentiel 2>/dev/null || [ $COUNT -eq $RETRIES ]; do
    echo "⚠️ Try $COUNT : PostgreSQL isn't ready ..."
    sleep 1
    ((COUNT++))
done

if [ $COUNT -eq $RETRIES ]; then
    echo "❌ Error : Timeout - PostgreSQL isn't ready after $RETRIES retries."
    exit 1
fi

echo "✅ PostgreSQL is ready !"
exit 0