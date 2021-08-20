# Suivi des Projets d'Energies Renouvelables

# Setup

1.  Dupliquer le fichier `.env.template` et le renommer en `.env` en remplaçant les valeurs par celles voulues
2.  Lancer la base de données qui est dans un conteneur Docker

    ```
    npm run dev-db
    ```

3.  Installer les scripts npm

    ```
    npm install
    ```

4.  Lancer la migration de données avec la ligne de commande suivante

    ```shell
    npm run migrate && npm run seed
    ```

5.  Lancer le serveur en mode "watch" (redémarrage à chaque changement de fichier)

    ```shell
    npm run watch
    ```

6.  Se connecter avec une persona dont les credentials sont situés dans `src/infra/sequelize/seeds/`
7.  Installer `commitizen` en global pour formatter les messages de commit

    ```
    npm i -g commitizen
    ```

    Puis utiliser la commande `git cz` à la place de `git commit`

# Developpement

### Déployer sur une instance dev ou staging

Nécessite l'installation de clever-tools

```
npm install -g clever-tools
clever login
```

Puis une fois l'identification faite:

```
# link app (dev1/dev2, demo ou staging, jamais prod)
clever link app_123456

# deploy
clever deploy
```

### Obtenir une base de données vierge

```
npm run dev-db
npm run migrate
npm run seed
```

### Lancer les tests

```

# Tests Unitaires

# tous les tests unitaires
npm run test

# en mode 'watch'
npm run test -- --watch

# un fichier de test seulement (glisser déposer l'adresse du fichier pour aller plus vite)
npm run test -- --watch /path/to/file.spec.ts

# Tests d'integration

# Au préalable, lancer la base de données pour les tests
npm run test-db

# lancer tous les tests
npm run test-int

# idem que pour les tests unitaires
npm run test -- --watch /path/to/file.integration.ts

# Tests end-to-end

# Au préalable, lancer la base
npm run test-db

# lancer les tests
npm run test-e2e

# lancer les tests 'legacy' (ils doivent toujours passer, même s'ils seront remplacés graduellement)
npm run test-e2e-legacy

# debugger avec le studio cypress (en lançant au préalable un serveur en env test)
NODE_ENV=test npm run watch
npm run cy:open
npm run cy:open:legacy
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

### Créer un dump de base de données

```
dotenv -- bash -c 'pg_dump -h $POSTGRESQL_ADDON_HOST -p $POSTGRESQL_ADDON_PORT -U $POSTGRESQL_ADDON_USER -d $POSTGRESQL_ADDON_DB --format=c -f database.dump'
```

### Restaurer un dump de base de données

En utilisant les credentials présents dans le fichier `.env`:

Si la destination est identique à la source:

```
export BACKUP_FILE=path/to/backup.dump
dotenv -- bash -c 'pg_restore -h $POSTGRESQL_ADDON_HOST -p $POSTGRESQL_ADDON_PORT -U $POSTGRESQL_ADDON_USER -d $POSTGRESQL_ADDON_DB --format=c $BACKUP_FILE'
```

Si la destination est différente de la source, il faut rajouter les options `--clean --no-owner --no-privileges`:

```
export BACKUP_FILE=path/to/backup.dump
dotenv -- bash -c 'pg_restore --clean --no-owner --no-privileges -h $POSTGRESQL_ADDON_HOST -p $POSTGRESQL_ADDON_PORT -U $POSTGRESQL_ADDON_USER -d $POSTGRESQL_ADDON_DB --format=c $BACKUP_FILE'
```
