# Potentiel

Potentiel est le service du Ministère de la Transition Énergétique qui connecte
les acteurs du parcours administratif des projets d'EnR électriques soumis à appel d'offres en France.

Le site est accessible sur [potentiel.beta.gouv.fr](https://potentiel.beta.gouv.fr).

Le projet est réalisé par une équipe du programme [beta.gouv.fr](https://beta.gouv.fr/) dont la description complète est disponible en se rendant sur [la fiche beta.gouv de la startup](https://beta.gouv.fr/startups/potentiel.html).

## Contribuer

Si vous souhaitez proposer une amélioration à Potentiel merci de suivre le [guide de contribution](CONTRIBUTING.md).

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

## Code de conduite

[CoC](CODE_OF_CONDUCT.md)

## Licence

[GNU AFFERO GENERAL PUBLIC LICENSE](LICENSE)
