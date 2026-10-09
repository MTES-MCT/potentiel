#! /bin/bash -l

if [ "$APPLICATION_STAGE" != "production" ]
then
  echo "⛔️ La commande '$*' ne peut être éxécutée qu'en production. (env actuel : $APPLICATION_STAGE)"
  exit 0
fi

exec "$@"
