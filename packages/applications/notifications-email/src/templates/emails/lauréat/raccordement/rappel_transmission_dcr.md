---
subject: Potentiel - {{ nom_projet }} - Transmission de la demande complète de raccordement en attente
---

Madame, Monsieur,

La demande complète de raccordement du projet **{{ nom_projet }} ({{ appel_offre }} période {{ période }})** situé dans le département **{{ departement_projet }}**, est en attente de transmission.

{{#if délai_transmission_dcr_potentiel}}
**Pour rappel**, vous disposez à compter de la désignation ou de l’accord de recours, d’un délai de :

- **{{délai_transmission_dcr_grd}} mois pour transmettre une demande complète de raccordement** au gestionnaire de réseau (sous peine de risque de prélèvement des garanties financières ou à défaut une sanction pécuniaire au titre de l'article L311-15 du code de l'énergie).
- **{{délai_transmission_dcr_potentiel}} mois pour saisir ces informations sur Potentiel** afin de permettre la contractualisation avec EDF OA.

Merci de régulariser la situation dès que possible.
{{else}}
Pour rappel, la saisie de ces informations permettra de faciliter le processus de **contractualisation**.
{{/if}}

Pour le consulter, connectez-vous à Potentiel.

{{ cta url 'Renseigner la DCR du projet' }}
