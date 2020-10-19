# Suivi des Projets d'Energies Renouvelables

# Setup

- Dupliquer et renommer `.test-users.ts.template` en `.test-users.ts`
- Dupliquer le fichier `.env.template` et le renommer en `.env`
- A la racine du projet potentiel, créer un dossier `.db`
- Se connecter avec une persona dont les credentials sont situés dans `src/infra/sequelize/seeds/`
- Lancer la migration de données avec la ligne de commande suivante

```
npx sequelize-cli db:migrate && npx sequelize-cli db:seed:all
```
