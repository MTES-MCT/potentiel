#!/bin/bash
set -e

pg_restore -U "$POSTGRES_USER" -d "$POSTGRES_DB" < /dump/potentiel-dev.dump
echo "✨ Database has been restored with potentiel-dev dump file✨"