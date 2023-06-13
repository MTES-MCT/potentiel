# Potentiel

Potentiel est le service du Ministère de la Transition Énergétique qui connecte
les acteurs du parcours administratif des projets d'EnR électriques soumis à appel d'offres en France.

Le site est accessible sur [potentiel.beta.gouv.fr](https://potentiel.beta.gouv.fr).

Le projet est réalisé par une équipe du programme [beta.gouv.fr](https://beta.gouv.fr/) dont la description complète est disponible en se rendant sur [la fiche beta.gouv de la startup](https://beta.gouv.fr/startups/potentiel.html).

## Contribuer

Si vous souhaitez proposer une amélioration à Potentiel merci de suivre le [guide de contribution](CONTRIBUTING.md).

## Système d'authentification avec Keycloak

Keycloak est un service open source d'identité et de gestion d'accès. Pour comprendre comment ce service est mise en oeuvre, vous pouvez trouver la documentation sur le [repo dédié au thème](https://github.com/MTES-MCT/potentiel-keycloak#mise-en-oeuvre)

### Utilisation en local

En local, lorsque la commande `npm run dev-db` (ou `docker compose up -d`) est lancée, un container `auth` va se monter avec l'[image officielle de keycloak](https://quay.io/repository/keycloak/keycloak). 

Lors du montage de l'image, on va importer le fichier [realm-dev.json](./keycloak/import/realm-dev.json) qui va configurer le royaume keycloak pour l'environnement de dev, et y ajouter des utilisateurs tests.

Keycloak fonctionnant avec un système de thème, nous en avons crée un personnalisé qui se base sur les recommandations du DSFR. Le code source est disponible sur ce [repo](https://github.com/MTES-MCT/potentiel-keycloak). Afin que le thème puisse fonctionner avec notre image docker, nous avons besoin de binder (dans le fichier [docker-compose](./docker-compose.yml)) le thème à utiliser. Pour se faire, nous avons mis en place un système de submodule git dans le dossier `keycloak/potentiel-keycloak` qui va venir pointer sur le repo dédié.

[Lien de ressource vers les sous-modules git](https://git-scm.com/book/en/v2/Git-Tools-Submodules)

### Utilisation en production

Pour la production et staging, keycloak est hébergé sur une application scalingo, qui utilise également le repo du thème custom.
Il existe deux environnements pour keycloak :

## Environnements

### Démo

- https://demo.potentiel.incubateur.net
- Déployé automatiquement à chaque mise en production

### Staging

- https://staging.potentiel.incubateur.net
- Déployé automatiquement à chaque création d'une branche release

### Production

- https://potentiel.beta.gouv.fr
- Déployé manuellement depuis le workflow `Release workflow` depuis les actions Github du projet

## Déploiement

Le projet potentiel suit la stratégie de branche de release : [Release Flow](http://releaseflow.org/).
Les différentes étapes du workflow déclenchent des déploiements automatiquement depuis les workflows github configurés.

Pour plus de détail vous pouvez consulter les diagrammes [release flow](./docs/ci/release-flow.drawio.svg) et [workflows](./docs/ci/workflows.drawio.svg).

## Code de conduite

[CoC](CODE_OF_CONDUCT.md)

## Licence

[GNU AFFERO GENERAL PUBLIC LICENSE](LICENSE)
