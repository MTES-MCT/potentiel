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
