#!/bin/bash

docker exec -it potentiel_db pg_dump -U potentiel -Fc -b -v -f \"potentiel-dev.dump\" potentiel && docker cp potentiel_db:/potentiel-dev.dump ./potentiel-dev.dump