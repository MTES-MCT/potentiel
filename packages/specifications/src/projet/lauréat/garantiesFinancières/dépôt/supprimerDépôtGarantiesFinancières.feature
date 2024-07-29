# language: fr
Fonctionnalité: Supprimer un dépôt de garanties financières

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"

    Plan du Scénario: Un porteur supprime un dépôt de garanties financières avec une date limite de soumission
        Etant donné des garanties financières en attente pour le projet "Du boulodrome de Marseille" avec :
            | date limite de soumission | 2023-11-01 |
            | date de notification      | 2023-09-01 |
            | motif                     | <motif>    |
        Et un dépôt de garanties financières pour le projet "Du boulodrome de Marseille" avec :
            | type                 | <type>                 |
            | date d'échéance      | <date d'échéance>      |
            | format               | <format du fichier>    |
            | contenu fichier      | <contenu du fichier>   |
            | date de constitution | <date de constitution> |
            | date de soumission   | 2023-10-01             |
            | soumis par           | porteur@test.test      |
        Quand le porteur supprime un dépôt de garanties financières pour le projet "Du boulodrome de Marseille"
        Alors il ne devrait pas y avoir de dépôt de garanties financières pour le projet "Du boulodrome de Marseille"
        Et des garanties financières devraient être attendues pour le projet "Du boulodrome de Marseille" avec :
            | date limite de soumission | 2023-11-01 |
            | motif                     | <motif>    |

        Exemples:
            | type                      | date d'échéance | format du fichier | contenu du fichier    | date de constitution | motif                                    |
            | avec-date-échéance        | 2027-12-01      | application/pdf   | le contenu du fichier | 2023-06-01           | motif-inconnu                            |
            | consignation              |                 | application/pdf   | le contenu du fichier | 2023-06-01           | recours-accordé                          |
            | six-mois-après-achèvement |                 | application/pdf   | le contenu du fichier | 2023-06-01           | changement-producteur                    |
            | consignation              |                 | application/pdf   | le contenu du fichier | 2023-06-01           | échéance-garanties-financières-actuelles |

    Plan du Scénario: Un porteur supprime des garanties financières sans une date limite de soumission après les avoir soumises
        Etant donné un dépôt de garanties financières pour le projet "Du boulodrome de Marseille" avec :
            | type                 | <type>                 |
            | date d'échéance      | <date d'échéance>      |
            | format               | <format du fichier>    |
            | contenu fichier      | <contenu du fichier>   |
            | date de constitution | <date de constitution> |
            | date de soumission   | 2023-10-01             |
            | soumis par           | porteur@test.test      |
        Quand le porteur supprime un dépôt de garanties financières pour le projet "Du boulodrome de Marseille"
        Alors il ne devrait pas y avoir de dépôt de garanties financières pour le projet "Du boulodrome de Marseille"

        Exemples:
            | type                      | date d'échéance | format du fichier | contenu du fichier    | date de constitution |
            | avec-date-échéance        | 2027-12-01      | application/pdf   | le contenu du fichier | 2023-06-01           |
            | consignation              |                 | application/pdf   | le contenu du fichier | 2023-06-01           |
            | six-mois-après-achèvement |                 | application/pdf   | le contenu du fichier | 2023-06-01           |

    Scénario: Impossible de supprimer des garanties financières en attente de validation s'il n'y a pas de dépôt de garanties financières
        Etant donné des garanties financières en attente pour le projet "Du boulodrome de Marseille" avec :
            | date limite de soumission | 2023-11-01    |
            | date de notification      | 2023-09-01    |
            | motif                     | motif-inconnu |
        Quand le porteur supprime un dépôt de garanties financières pour le projet "Du boulodrome de Marseille"
        Alors l'utilisateur devrait être informé que "Il n'y a aucun dépôt de garanties financières en cours pour ce projet"
