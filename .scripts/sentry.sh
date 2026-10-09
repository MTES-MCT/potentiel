send_sentry_error() {
  local message="$1"
  local slug="$2"

  if [ -z $NEXT_PUBLIC_SENTRY_DSN ]
  then
    return
  fi

  local key=$(echo "$NEXT_PUBLIC_SENTRY_DSN" | sed -E 's|https://([^@]+)@.*|\1|')
  local host=$(echo "$NEXT_PUBLIC_SENTRY_DSN" | sed -E 's|https://[^@]+@([^/]+)/.*|\1|')
  local project_id=$(echo "$NEXT_PUBLIC_SENTRY_DSN" | sed -E 's|.*/([0-9]+)$|\1|')
  local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
  local hostname=$(hostname)

  curl -s -X POST "https://${host}/api/${project_id}/store/" \
    -H "Content-Type: application/json" \
    -H "X-Sentry-Auth: Sentry sentry_version=7, sentry_key=${key}, sentry_client=${slug}/1.0" \
    -d "{\"message\":\"${message}\",\"level\":\"error\",\"environment\":\"${APPLICATION_STAGE}\",\"timestamp\":\"${timestamp}\",\"server_name\":\"${hostname}\",\"tags\":{\"monitor.slug\":\"${slug}\"}}"
}
