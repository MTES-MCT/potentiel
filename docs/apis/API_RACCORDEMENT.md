# Intégration Potentiel - Gestionnaires de Réseau de Distribution

Potentiel propose une API afin de permettre aux Gestionnaires de Réseau de Distrubtion (GRD) d'automatiser la transmission de la date de mise en service.

## Fonctionnement

- le GRD récupère la liste des projets en attente de mise en service via le endpoint `/reseaux/raccordements`
- (optionnel) le GRD modifie la référence de dossier via le endpoint `PATCH /laureats/{identifiantProjet}/raccordements/{reference}`
- le GRD transmet la date de mise en service via le endpoint `POST /laureats/{identifiantProjet}/raccordements/{reference}/mise-en-service`

## Documentation

La documentation de l'API est disponible [ici](https://potentiel.beta.gouv.fr/api/doc#operations-tag-Raccordement)
