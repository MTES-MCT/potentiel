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

Le projet potentiel suit la stratégie de branche de release : [Release Flow](http://releaseflow.org/)
Les différentes étapes du workflow déclenchent des déploiements automatiquement depuis les workflows github configurés.

Pour plus de détail vous pouvez consulter les diagrammes [release flow](./docs/ci/release-flow.drawio.svg) et [workflows](./docs/ci/workflows.drawio.svg).

## Code de conduite

[CoC](CODE_OF_CONDUCT.md)

## Licence

[GNU AFFERO GENERAL PUBLIC LICENSE](LICENSE)
