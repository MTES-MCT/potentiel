# Démarche Numérique

L'application [Démarche Numérique](https://demarche.numerique.gouv.fr/) est utilisée par la CRE pour recevoir les candidatures des Porteurs de Projet à la période de l'appel d'offre `PPE2 - Petit PV Bâtiment` (S2 2025, d'autres AO devraient suivre).

## Description du parcours

Chaque Période d'appel d'offre donne lieu à une Démarche. Chaque Dossier de cette démarche représente une candidature.

| Acteur   | App       | Étape                                                                                                                               |
| -------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| CRE      | DS        | Duplication du modèle de la démarche pour la nouvelle période                                                                       |
| CRE      |           | Ouverture des candidatures pour la période                                                                                          |
| DGEC     | Potentiel | Création de la période                                                                                                              |
| Porteurs | DS        | Dépôt des candidatures                                                                                                              |
| CRE      |           | Clotûre des candidatures pour la période                                                                                            |
| CRE      | tableur   | Instruction des candidatures (la CRE exporte les candidatures depuis DS)                                                            |
| CRE      | DS        | Ouverture des droits d'accès en lecture à la démarche pour Potentiel (voir [Authentification et accès](#authentification-et-accès)) |
| CRE      | Email     | Transmission du fichier CSV d'instruction (sans données de candidature) à la DGEC                                                   |
| DGEC     | Potentiel | Import des candidatures (CSV + DS)                                                                                                  |
| DGEC     | Potentiel | Désignation des lauréat et éliminés                                                                                                 |

## Fichier du résultat de l'instruction

Le fichier du résultat de l'instruction transmis par la CRE contient les informations suivantes :

| Champ            | Type                  | Description                                                           |
| ---------------- | --------------------- | --------------------------------------------------------------------- |
| numeroDossierDS  | nombre                | Le numéro de dossier DS servira d'identifiant (`numéroCRE`) du projet |
| statut           | `retenu` ou `éliminé` |                                                                       |
| note             | nombre                |                                                                       |
| motifElimination | texte                 | requis pour un projet éliminé                                         |

## Accès par API à Démarches Simplifiées

### Graphql

Démarche Numérique propose une API Graphql, qui permet entre autre de récupérer un dossier par son identifiant.

- Documentation : https://doc.demarches-simplifiees.fr/api-graphql
- Playground : https://demarche.numerique.gouv.fr/graphql

Le package [ds-api-client](/packages/infrastructure/ds-api-client/) permet de traiter le résultat de cette API afin de récupérer les informations du dépôt de la candidature.

Le code se basant sur le nom des champs dans le formulaire, il est essentiel que la CRE transmette à Potentiel tout changement dans le nom ou le type de ces champs. L'import ne fonctionnera pas si un champs requis n'est pas trouvé, ou si son type a changé.

### Authentification et accès à la démarche

Pour accéder à une démarche, un [jeton d'accès](https://doc.demarches-simplifiees.fr/api-graphql/jeton-dauthentification) est requis.
Ce jeton doit avoir accès à la démarche concernée.

À ce jour (Août 2025), un compte Instructeur ne peut pas accéder aux Dossiers d'une démarche; un compte Administrateur est requis.
Afin de garantir l'indépendence de la CRE, Potentiel n'a pas d'accès Administrateur à la démarche.
À la place, la CRE gère un unique jeton, transmis à Potentiel, auquel elle donne accès en lecture seule à chaque nouvelle démarche. Voir [ici](https://doc.demarches-simplifiees.fr/api-graphql/jeton-dauthentification#acceder-en-lecture-et-ou-ecriture-uniquement-a-une-liste-fermee-des-demarches-de-ladministrateur-aya).

## Tester l'intégration

Pour tester l'intégration à Démarche Numérique :

- accéder à la version la plus récente du formulaire sur https://demarche.numerique.gouv.fr/ (vDGEC indique une version créée par la CRE pour les besoins de test de Potentiel)
- ETQ usager DS, créer un premier dossier s'il n'en existe pas encore
- ETQ usager DS, dupliquer le dossier autant de fois que nécessaire
- (optionnel) Utiliser la ligne de commande potentiel pour générer un fichier d'instruction (statuts aléatoires) :

```bash
export DS_API_URL=https://demarche.numerique.gouv.fr/api/v2/graphql
export DS_API_TOKEN=JETON API
potentiel-cli candidature lister-dossiers NUMERO_DE_LA_DEMARCHE --instruction
```

- Sur http://localhost:3000/candidatures/importer/ds, sélectionner l'appel d'offre et la période, puis le fichier préalablement généré (ou un fichier manuellement créé)
