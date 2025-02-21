#!/bin/bash

docker exec -it potentiel_db pg_dump -U metabase -Fc -b -v -f metabase-dev.dump metabase && docker cp potentiel_db:/metabase-dev.dump ./.database/metabase-dev.dump
