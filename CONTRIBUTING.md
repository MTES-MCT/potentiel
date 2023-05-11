# Contribuer à Potentiel

- [Code de conduite](#code-de-conduite)
- [Pull Requests](#pull-requests)
- [Developer's Certificate of Origin 1.1](#developers-certificate-of-origin)

## [Code de conduite](./CODE_OF_CONDUCT.md)

Le projet Potentiel a un
[Code de conduite](https://github.com/nodejs/admin/blob/HEAD/CODE_OF_CONDUCT.md)
que tous les contributeurs doivent accepter.

## [Pull requests]

### Dépendances

- <a href="https://github.com/nvm-sh/nvm#installing-and-updating" target="_blank">NVM</a>
- <a href="https://docs.docker.com/get-docker/" target="_blank">Docker</a>


### Configurer un environnement local

1.  Installer Node.js via la commande **nvm** à la racine du projet (**nvm** utilisera la configuration contenue dans le fichier **[.nvmrc](/.nvmrc)**) :

    ```
    nvm install
    ```

2.  Installer les dépendances :

    ```
    npm install
    ```

3.  Pour contribuer, installer le package **[gitmoji-cli](https://github.com/carloscuesta/gitmoji-cli)** :

    ```
    npm i -g gitmoji-cli
    ```

4.  Installer le commit hook de Gitmoji :

    ```
    gitmoji -i
    ```

5.  Configurer Gitmoji pour l'utilisation des Emojis (♻️) plutôt que des Emoji codes (_:recycle:_) :
    ```
    gitmoji -g
    ```

### Apporter des changements

Méthodologie TDD

1. Écrire un test
2. Faire passer le test
3. Refactor
4. Convention de message de commit


### Faire la revue de code de la pull request

### Notes




### Lancer les tests automatisés

1. Préparer une base de données de test (lance un conteneur docker)

   ```shell
   npm run test-db
   ```

   _NB: Ceci est uniquement nécessaire pour les tests d'intégration et les tests end-to-end._

2. Lancer les tests unitaires

   ```shell
   # Tous, une fois
   npm run test

   # Tous, en relançant à chaque changement
   npm run test -- --watch

   # Un seul test, en relançant à chaque changement
   npm run test -- --watch src/modules/AppelOffre.spec.ts
   ```

3. Lancer les tests d'intégration

   ```shell
   # Tous, une fois
   npm run test-int

   # Tous, en relançant à chaque changement
   npm run test-int -- --watch

   # Un seul test, en relançant à chaque changement
   npm run test-int -- --watch src/modules/AppelOffre.spec.ts
   ```

   _NB: Si le schéma de base de données a changé, il faut relancer `npm run test-db`._

### Lancement de l'application locale

1. Lancer une base de données locale (lance un conteneur docker)

   ```shell
   npm run dev-db
   ```

2. Lancer la migration de données (création des tables et insertion des utilisateurs de test)

   ```shell
   # Créer les tables (à relancer à chaque nouvelle migration de schéma)
   npm run migrate

   # Insérer les utilisateurs test
   npm run seed
   ```

3. Lancer le serveur en mode "watch" (redémarrage à chaque changement de fichier)

   ```shell
   npm run watch
   ```

4. Se rendre sur [localhost:3000](http://localhost:3000)
5. Se connecter à l'un des comptes suivants (pas de mot de passe nécessaire):

- admin@test.test
- dreal@test.test
- porteur@test.test
- ademe@test.test
- ao@test.test

### Importer des données pour avoir des projets et utiliser l'app

## Système d'authentification avec Keycloak

Keycloak est un service open source d'identité et de gestion d'accès.

Il existe deux environnements pour keycloak :

- Une version "legacy" est situé dans ce repo; cet environnement est utilisé à des fins de tests en local uniquement
- Une version de production utilisé pour les environnements **staging** et **production** est disponible sur ce [repo](https://github.com/MTES-MCT/potentiel-keycloak)

Pour en savoir plus sur l'utilisation en local, veuillez vous rendre sur la page [`docs/KEYCLOAK.md`](/docs/KEYCLOAK.md)
Pour en savoir plus sur l'utilisation en production, veuillez vous rendre sur le repo [potentiel-keycloak](https://github.com/MTES-MCT/potentiel-keycloak)

# Environnements et Déploiement

## Les environnements

### Local

Cet environnement est réservé à chaque développeur travaillant sur le projet.
Il permet de faire les développements sur un environnement sans risque d'altérer la donnée.
La base de donnée de cet environnement est falsifié, afin d'éviter l'accès à des vrais données projets en cas de perte / vol de l'ordinateur.
Il dispose d'un système de connexion simplifié qui ne nécessite pas de renseigner de mot de passe mais uniquement une adresse email d'un compte utilisateur pour se connecter avec son compte. cf
Pour installer et utiliser cet environnement, il faut suivre cette [documentation](#développement-en-local).

### [Demo](https://demo.potentiel.incubateur.net/)

Cet environnement est dédié à la démonstration de l'outil, que ce soit à des fins commerciales ou démonstratives.
La base de donnée de cet environnement est falsifié, afin d'éviter de présenter des vrais données projets.
Il dispose d'un système de connexion simplifié qui ne nécessite pas de renseigner de mot de passe mais uniquement une adresse email d'un compte utilisateur pour se connecter avec son compte. Les comptes tests permettent un accès rapide en tant qu'un certain type d'utilisateur.

- Déploiement de l'application : [Voici la démarche à suivre pour faire un déploiement manuel](docs/DEPLOY.md)
- Pour réinitialiser la base de données il suffit d'utiliser le dump disponible dans ce dépôt (`./demo/demo.dump`)
- Pour créer un nouveau dump de démo, il faut :
  - Partir d'une base de donnée vierge (`npm run dev-db`)
  - Executer les migrations (`npm run migrate`)
  - Créer les faux utilisateurs (`npm run seed`)
  - [Produire un dump de la base de données locale](#produire-un-dump-de-la-base-de-données-locale) et le remplacer ici : `./demo/demo.dump`

### [Staging](https://staging.potentiel.incubateur.net/)

Cet environnement est une copie de la production. Il sert essentiellement à faire des tests. La base de donnée de cet environnement est une copie de celle de production.
Afin de pouvoir se connecter sur cet environnement, il est nécessaire que vous ayez un compte. Pour obtenir celà, il faudra passer par la console de Keycloak (cf [documentation](#keycloak)).

### [Production](https://potentiel.beta.gouv.fr/)

Cet environnement est celui utilisé par nos utilisateurs.
Afin de pouvoir se connecter sur cet environnement, il est nécessaire que vous ayez un compte. Pour obtenir celà, il faudra passer par la console de Keycloak (cf [documentation](#keycloak)).

## Déploiement

Les différents environnements sont chez [Scalingo](https://scalingo.com/fr).

## Developer's Certificate of Origin 1.1

<pre>
En faisant une contribution à ce projet,j’atteste que :

 (a) Ma contribution a été créée en tout ou partie par moi, et que j’ai le droit de la soumettre sous la licence applicable au projet; ou que

 (b) Ma contribution s’appuie sur des travaux antérieurs qui, à ma connaissance, sont couverts par une licence libre et que j’ai le droit sous cette licence de soumettre cette contribution avec mes modifications, créées en tout ou partie par moi, sous la licence applicable au projet; ou que

 (c) La contribution m’a été offerte par un tiers qui a certifié que les points (a), (b) ou © ont été respectés et que je n’ai pas modifié cette contribution.

 (d) Je comprends et accepte que ce projet et ma contribution sont publics, et qu’un enregistrement de cette contribution (comprenant également l’ensemble des informations à caractère personnel me concernant et notamment ma signature) soit attaché indéfiniment à ce projet et qu’il peut librement être rediffusé à des tiers conformément à la licence applicable au projet ou aux autres licences impliquées.
</pre>
