# Suivi des Projets d'Energies Renouvelables

# Setup

1.  Dupliquer et renommer `.test-users.ts.template` en `.test-users.ts`
2.  Dupliquer le fichier `.env.template` et le renommer en `.env`
3.  Lancer la migration de données avec la ligne de commande suivante

    ```shell
    npx sequelize-cli db:migrate && npx sequelize-cli db:seed:all
    ```

4.  Se connecter avec une persona dont les credentials sont situés dans `src/infra/sequelize/seeds/`
