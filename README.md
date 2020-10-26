# Suivi des Projets d'Energies Renouvelables

# Setup

1.  Installer `sqlite3` à partir des sources qu'il faudra compiler (car à l'heure actuelle, la version disponible via npm n'inclue pas la fonctionnalité de _search_)

    ** n.b: vérifiez que vous avez bien installé un compilateur C comme **GCC**. Pour l'installer sur Ubuntu : **

    ```shell
    sudo apt install build-essential
    ```

    Puis faites pointer _python_ vers _python3_ en créant un lien symbolique

    ```shell
    sudo ln -s /usr/bin/python3 /usr/bin/python
    ```

    Enfin installez _sqlite3_ à partir des sources, en ajoutant le flag `DSQLITE_ENABLE_FTS3_PARENTHESIS`

    ```shell
    export CFLAGS="-DSQLITE_ENABLE_FTS3_PARENTHESIS"
    npm install sqlite3 --build-from-source
    ```

2.  Dupliquer et renommer `.test-users.ts.template` en `.test-users.ts`
3.  Dupliquer le fichier `.env.template` et le renommer en `.env`
4.  A la racine du projet potentiel, créer un dossier `.db`
5.  Lancer la migration de données avec la ligne de commande suivante

    ```shell
    npx sequelize-cli db:migrate && npx sequelize-cli db:seed:all
    ```

6.  Se connecter avec une persona dont les credentials sont situés dans `src/infra/sequelize/seeds/`
