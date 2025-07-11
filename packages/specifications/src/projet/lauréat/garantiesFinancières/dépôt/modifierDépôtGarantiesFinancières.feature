# language: fr
@garanties-financières
Fonctionnalité: Modifier un dépôt de garanties financières

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"

    Plan du Scénario: Un porteur modifie un dépôt de garanties financières
        Etant donné un dépôt de garanties financières pour le projet "Du boulodrome de Marseille" avec :
            | type GF              | <type GF>              |
            | date d'échéance      | <date d'échéance>      |
            | format               | <format du fichier>    |
            | contenu fichier      | <contenu du fichier>   |
            | date de constitution | <date de constitution> |
            | date de soumission   | <date de soumission>   |
            | soumis par           | porteur@test.test      |
        Quand le porteur modifie un dépôt de garanties financières pour le projet "Du boulodrome de Marseille" avec :
            | type GF              | consignation           |
            | date d'échéance      |                        |
            | format               | application/pdf        |
            | contenu fichier      | nouveau fichier        |
            | date de constitution | 2023-06-12             |
            | date de modification | <date de modification> |
            | modifié par          | porteur@test.test      |
        Alors le dépôt de garanties financières devrait être consultable pour le projet "Du boulodrome de Marseille" avec :
            | type GF                      | consignation           |
            | date d'échéance              |                        |
            | format                       | application/pdf        |
            | contenu fichier              | nouveau fichier        |
            | date de constitution         | 2023-06-12             |
            | date de soumission           | <date de soumission>   |
            | soumis par                   | porteur@test.test      |
            | date de dernière mise à jour | <date de modification> |

        Exemples:
            | type GF                   | date d'échéance | format du fichier | contenu du fichier    | date de constitution | date de soumission | date de modification |
            | avec-date-échéance        | 2027-12-01      | application/pdf   | le contenu du fichier | 2023-06-01           | 2023-07-01         | 2023-11-01           |
            | consignation              |                 | application/pdf   | le contenu du fichier | 2023-06-01           | 2023-07-01         | 2023-11-01           |
            | six-mois-après-achèvement |                 | application/pdf   | le contenu du fichier | 2023-06-01           | 2023-07-01         | 2023-11-01           |

    Plan du Scénario: Impossible de modifier un dépôt de garanties financières si le type renseigné n'est pas compatible avec une date d'échéance
        Etant donné un dépôt de garanties financières pour le projet "Du boulodrome de Marseille" avec :
            | type GF | consignation |
        Quand le porteur modifie un dépôt de garanties financières pour le projet "Du boulodrome de Marseille" avec :
            | type GF         | <type GF>         |
            | date d'échéance | <date d'échéance> |
        Alors l'utilisateur devrait être informé que "Vous ne pouvez pas renseigner de date d'échéance pour ce type de garanties financières"

        Exemples:
            | type GF                   | date d'échéance |
            | consignation              | 2027-12-01      |
            | six-mois-après-achèvement | 2027-12-01      |

    Scénario: Impossible de modifier un dépôt de garanties financières si la date d'échéance est manquante
        Etant donné un dépôt de garanties financières pour le projet "Du boulodrome de Marseille" avec :
            | type GF | consignation |
        Quand le porteur modifie un dépôt de garanties financières pour le projet "Du boulodrome de Marseille" avec :
            | type GF         | avec-date-échéance |
            | date d'échéance |                    |
        Alors l'utilisateur devrait être informé que "Vous devez renseigner la date d'échéance pour ce type de garanties financières"

    Scénario: Impossible de modifier un dépôt de garanties financières si la date de constitution est dans le futur
        Etant donné un dépôt de garanties financières pour le projet "Du boulodrome de Marseille" avec :
            | type GF | consignation |
        Quand le porteur modifie un dépôt de garanties financières pour le projet "Du boulodrome de Marseille" avec :
            | date de constitution | 2050-12-01 |
        Alors l'utilisateur devrait être informé que "La date de constitution des garanties financières ne peut pas être une date future"

    Scénario: Impossible de modifier un dépôt de garanties financières si aucun dépôt de garanties financières n'est trouvé
        Quand le porteur modifie un dépôt de garanties financières pour le projet "Du boulodrome de Marseille" avec :
            | type GF | consignation |
        Alors l'utilisateur devrait être informé que "Il n'y a aucun dépôt de garanties financières en cours pour ce projet"
