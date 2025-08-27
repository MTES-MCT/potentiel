# Intégration Potentiel - EDF OA

## Première itération

Lors de la première itération, EDF OA recueille l'attestation de conformité et transmet la date d'achèvement (qui équivaut à la date de transmission de l'attestation de conformité) à Potentiel si elle est valide. Le projet est alors considéré achevé.

### Fonctionnement

- EDF OA appelle le endpoint `GET /achevements/en-attente` afin de récupérer les projets en attente

- _OU BIEN_ EDF OA appelle le endpoint `GET /laureats/par-reference-raccordement/{referenceRaccordement}` afin de récupérer chacun des projets pour lesquels une attestation de conformité est disponible, par référence de dossier de raccordement.

- EDF OA recoupe les données récupérées sur Potentiel pour vérifier la cohérence de la donnée.

- EDF OA transmet l'attestation de conformité via le endpoint `POST /laureats/{identifiantProjet}/achevement/date-achevement:transmettre`.

### Documentation

La documentation de l'API est disponible [ici](https://potentiel.beta.gouv.fr/api/doc#operations-tag-AchevementV1)

## Seconde itération

A terme, l'attestation de conformité est transmise par le Porteur sur Potentiel, et EDF OA vient récupérer les nouvelles attestations depuis Potentiel, puis confirme leur validité. Le projet est alors considéré achevé, à la date de transmission de l'attestation sur Potentiel.

### Fonctionnement

- Le Porteur dépose son attestation de conformité sur Potentiel, la date de dépôt déterminant la date d'achèvement.

- EDF OA appelle le endpoint `GET /achevements/en-attente-confirmation` afin de récupérer les projets ayant une attestation de conformité, non confirmée par EDF OA.

- EDF OA recoupe les données récupérées sur Potentiel pour vérifier la cohérence de la donnée.

- EDF OA confirme la validité de l'attestation via le endpoint `POST /laureats/{identifiantProjet}/achevement/confirmer`

### Documentation

La documentation de l'API est disponible [ici](https://potentiel.beta.gouv.fr/api/doc#operations-tag-AchevementV2)
