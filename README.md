# Suivi des Projets d'Energies Renouvelables

# Setup

1.  Dupliquer et renommer `.test-users.ts.template` en `.test-users.ts`
2.  Dupliquer le fichier `.env.template` et le renommer en `.env` en remplaçant les valeurs par celles voulues
3.  Lancer la base de données qui est dans un conteneur Docker

    ```
    docker-compose up -d
    ```

4.  Lancer la migration de données avec la ligne de commande suivante

    ```shell
    npx sequelize-cli db:migrate && npx sequelize-cli db:seed:all
    ```

5.  Se connecter avec une persona dont les credentials sont situés dans `src/infra/sequelize/seeds/`
6.  Installer `commitizen` en global pour formatter les messages de commit

    ```
    npm i -g commitizen
    ```

    Puis utiliser la commande `git cz` à la place de `git commit`

# Developpement

### Obtenir une base de données vierge

```
docker-compose down --remove-orphans && docker-compose up -d
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

### Se connecter à la db via psql

Nécessite d'installer `psql` sur sa machine.

En utilisant les credentials présents dans le fichier `.env`:

```
dotenv -- bash -c 'psql -h $POSTGRESQL_ADDON_HOST -p $POSTGRESQL_ADDON_PORT -U $POSTGRESQL_ADDON_USER -d $POSTGRESQL_ADDON_DB'
```

Il est possible de spécifier un autre fichier pour l'environnement par exemple:

```
dotenv -e .env.local -- bash -c 'psql -h $POSTGRESQL_ADDON_HOST -p $POSTGRESQL_ADDON_PORT -U $POSTGRESQL_ADDON_USER -d $POSTGRESQL_ADDON_DB'
```

### Restaurer un dump de base de données

Nécessite d'installer `psql` sur sa machine.

En utilisant les credentials présents dans le fichier `.env`:

```
export BACKUP_FILE=path/to/backup.dump
dotenv -- bash -c 'pg_restore --clean --no-owner --no-privileges -h $POSTGRESQL_ADDON_HOST -p $POSTGRESQL_ADDON_PORT -U $POSTGRESQL_ADDON_USER -d $POSTGRESQL_ADDON_DB --format=c $BACKUP_FILE'
```

Il est possible de spécifier un autre fichier pour l'environnement par exemple:

```
dotenv -e .env.local -- bash -c 'psql -h $POSTGRESQL_ADDON_HOST -p $POSTGRESQL_ADDON_PORT -U $POSTGRESQL_ADDON_USER -d $POSTGRESQL_ADDON_DB'
```

test
