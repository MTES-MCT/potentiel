#!/usr/bin/env bash
echo "Running custom initialization scripts in $0"
echo "__"
docker_process_sql() {
	local query_runner=( psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --no-password --no-psqlrc )
	if [ -n "$POSTGRES_DB" ]; then
		query_runner+=( --dbname "$POSTGRES_DB" )
	fi

	PGHOST= PGHOSTADDR= "${query_runner[@]}" "$@"
}
find /docker-entrypoint-initdb.d -mindepth 2 -type f -print0 | sort -z | while read -d $'\0' f; do
  case "$f" in
    *.sh)
      if [ -x "$f" ]; then
        echo "$0: running $f"
        "$f"
      else
        echo "$0: sourcing $f"
        . "$f"
      fi
      ;;
    *.sql)    echo "$0: running $f"; docker_process_sql -f "$f"; echo ;;
    *.sql.gz) echo "$0: running $f"; gunzip -c "$f" | docker_process_sql; echo ;;
    *)        echo "$0: ignoring $f" ;;
  esac
  echo
done

