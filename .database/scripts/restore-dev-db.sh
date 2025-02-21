
set -e
set -u

function create_user_and_database() {
	local database=$1
	echo "  Creating user and database '$database'"
  echo $POSTGRES_USER
	psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
	    CREATE USER $database with password 'password';
	    CREATE DATABASE $database;
	    GRANT ALL PRIVILEGES ON DATABASE $database TO $database;
EOSQL
}

if [ -n "$POSTGRES_MULTIPLE_DATABASES" ]; then
	echo "Multiple database creation requested: $POSTGRES_MULTIPLE_DATABASES"
	for db in $(echo $POSTGRES_MULTIPLE_DATABASES | tr ',' ' '); do
		create_user_and_database $db
	done
	echo "Multiple databases created"
fi

pg_restore -U "$POSTGRES_USER" -d "potentiel" < /dump/potentiel-dev.dump
echo "✨ Potentiel Database has been restored with potentiel-dev dump file✨"

pg_restore -U "$POSTGRES_USER" -d "metabase" < /dump/metabase-dev.dump
echo "✨ Metabase Database has been restored with metabase-dev dump file✨"