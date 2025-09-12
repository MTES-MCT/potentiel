# language: fr
@garanties-financières
@dépôt-garanties-financières
Fonctionnalité: Modifier un dépôt de garanties financières

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"

    Plan du Scénario: Un porteur modifie un dépôt de garanties financières
        Etant donné un dépôt de garanties financières avec :
            | type GF         | <type GF actuel>           |
            | date d'échéance | <date d'échéance actuelle> |
        Quand le porteur modifie le dépôt de garanties financières avec :
            | type GF         | <nouveau type GF>          |
            | date d'échéance | <nouvelle date d'échéance> |
        Alors le dépôt de garanties financières devrait être consultable pour le projet lauréat

        Exemples:
            | type GF actuel            | date d'échéance actuelle | nouveau type GF           | nouvelle date d'échéance |
            | avec-date-échéance        | 2027-12-01               | consignation              |                          |
            | avec-date-échéance        | 2027-12-01               | six-mois-après-achèvement |                          |
            | consignation              |                          | avec-date-échéance        | 2027-12-01               |
            | consignation              |                          | six-mois-après-achèvement |                          |
            | six-mois-après-achèvement |                          | consignation              |                          |
            | six-mois-après-achèvement |                          | avec-date-échéance        | 2027-12-01               |

    Scénario: Un porteur modifie un dépôt de garanties financières avec un type exemption
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offre | PPE2 - Petit PV Bâtiment |
        Et un dépôt de garanties financières avec :
            | type GF | consignation |
        Quand le porteur modifie le dépôt de garanties financières avec :
            | type GF              | exemption  |
            | date de délibération | 2020-01-01 |
        Alors le dépôt de garanties financières devrait être consultable pour le projet lauréat
        Et les garanties financières en attente du projet ne devraient plus être consultables

    Plan du Scénario: Impossible de modifier un dépôt de garanties financières si le type renseigné n'est pas compatible avec une date d'échéance
        Etant donné un dépôt de garanties financières avec :
            | type GF | consignation |
        Quand le porteur modifie le dépôt de garanties financières avec :
            | type GF         | <type GF>         |
            | date d'échéance | <date d'échéance> |
        Alors l'utilisateur devrait être informé que "La date d'échéance ne peut être renseignée pour ce type de garanties financières"

        Exemples:
            | type GF                   | date d'échéance |
            | consignation              | 2027-12-01      |
            | six-mois-après-achèvement | 2027-12-01      |

    Scénario: Impossible de modifier un dépôt de garanties financières si la date d'échéance est manquante
        Etant donné un dépôt de garanties financières avec :
            | type GF | consignation |
        Quand le porteur modifie le dépôt de garanties financières avec :
            | type GF         | avec-date-échéance |
            | date d'échéance |                    |
        Alors l'utilisateur devrait être informé que "La date d'échéance des garanties financières est requise"

    Scénario: Impossible de modifier un dépôt de garanties financières si la date de constitution est dans le futur
        Etant donné un dépôt de garanties financières avec :
            | type GF | consignation |
        Quand le porteur modifie le dépôt de garanties financières avec :
            | date de constitution | 2050-12-01 |
        Alors l'utilisateur devrait être informé que "La date de constitution des garanties financières ne peut pas être une date future"

    Scénario: Impossible de modifier un dépôt de garanties financières si aucun dépôt de garanties financières n'est trouvé
        Quand le porteur modifie le dépôt de garanties financières avec :
            | type GF | consignation |
        Alors l'utilisateur devrait être informé que "Il n'y a aucun dépôt de garanties financières en cours pour ce projet"

    Scénario: Impossible de modifier un dépôt de garanties financières avec un type non disponible pour l'appel d'offre
        Etant donné un dépôt de garanties financières avec :
            | appel d'offre | PPE2 - Sol   |
            | type GF       | consignation |
        Quand le porteur modifie le dépôt de garanties financières avec :
            | type GF              | exemption  |
            | date de délibération | 2025-01-01 |
        Alors l'utilisateur devrait être informé que "Ce type de garanties financières n'est pas disponible pour cet appel d'offre"
