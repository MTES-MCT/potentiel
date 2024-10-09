# language: fr
Fonctionnalité: Soumettre de nouvelles garanties financières

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"

    Plan du Scénario: Un porteur soumet un dépôt de garanties financières
        Etant donné des garanties financières en attente pour le projet "Du boulodrome de Marseille" avec :
            | date limite de soumission | 2023-11-01    |
            | date de notification      | 2023-09-01    |
            | motif                     | motif-inconnu |
        Quand un porteur soumet un dépôt de garanties financières pour le projet "Du boulodrome de Marseille" avec :
            | type                 | <type>                 |
            | date d'échéance      | <date d'échéance>      |
            | format               | <format du fichier>    |
            | contenu fichier      | <contenu du fichier>   |
            | date de constitution | <date de constitution> |
            | date de soumission   | <date de soumission>   |
            | soumis par           | porteur@test.test      |
        Alors les garanties financières en attente ne devraient plus être consultables et le dépôt de garanties financières devrait être consultable pour le projet "Du boulodrome de Marseille" avec :
            | type                         | <type>                 |
            | date d'échéance              | <date d'échéance>      |
            | format                       | <format du fichier>    |
            | contenu fichier              | <contenu du fichier>   |
            | date de constitution         | <date de constitution> |
            | date de soumission           | <date de soumission>   |
            | soumis par                   | porteur@test.test      |
            | date de dernière mise à jour | <date de soumission>   |

        Exemples:
            | type                      | date d'échéance | format du fichier | contenu du fichier    | date de constitution | date de soumission |
            | avec-date-échéance        | 2027-12-01      | application/pdf   | le contenu du fichier | 2023-06-01           | 2023-10-01         |
            | consignation              |                 | application/pdf   | le contenu du fichier | 2023-06-01           | 2023-10-01         |
            | six-mois-après-achèvement |                 | application/pdf   | le contenu du fichier | 2023-06-01           | 2023-10-01         |

    Scénario: Une tâche du type "échoir les garanties financières" est annulée quand une dépôt de garanties financiéres est soumis
        Etant donné des garanties financières actuelles pour le projet "Du boulodrome de Marseille" avec :
            | type            | avec-date-échéance |
            | date d'échéance | 2024-12-01         |
        Quand un porteur soumet un dépôt de garanties financières pour le projet "Du boulodrome de Marseille" avec :
            | type            | avec-date-échéance |
            | date d'échéance | 2024-12-01         |
        Alors une tâche "échoir les garanties financières" n'est plus planifiée pour le projet "Du boulodrome de Marseille"

    Scénario: Une tâche du type "rappel échéance garanties financières à un mois" est annulée quand une attestation de conformité est transmise
        Etant donné des garanties financières actuelles pour le projet "Du boulodrome de Marseille" avec :
            | type            | avec-date-échéance |
            | date d'échéance | 2024-12-01         |
        Quand un porteur soumet un dépôt de garanties financières pour le projet "Du boulodrome de Marseille" avec :
            | type            | avec-date-échéance |
            | date d'échéance | 2024-12-01         |
        Alors une tâche "rappel échéance garanties financières à un mois" n'est plus planifiée pour le projet "Du boulodrome de Marseille"

    Scénario: Une tâche du type "rappel échéance garanties financières à deux mois" est annulée quand une attestation de conformité est transmise
        Etant donné des garanties financières actuelles pour le projet "Du boulodrome de Marseille" avec :
            | type            | avec-date-échéance |
            | date d'échéance | 2024-12-01         |
        Quand un porteur soumet un dépôt de garanties financières pour le projet "Du boulodrome de Marseille" avec :
            | type            | avec-date-échéance |
            | date d'échéance | 2024-12-01         |
        Alors une tâche "rappel échéance garanties financières à deux mois" n'est plus planifiée pour le projet "Du boulodrome de Marseille"

    Scénario: Impossible de soumettre un dépôt de garanties financières si la date de constitution est dans le futur
        Quand un porteur soumet un dépôt de garanties financières pour le projet "Du boulodrome de Marseille" avec :
            | date de constitution | 2055-01-01 |
        Alors l'utilisateur devrait être informé que "La date de constitution des garanties financières ne peut pas être une date future"

    Scénario: Impossible de soumettre un dépôt de garanties financières si date d'échéance manquante
        Quand un porteur soumet un dépôt de garanties financières pour le projet "Du boulodrome de Marseille" avec :
            | type         | avec-date-échéance |
            | dateÉchéance |                    |
        Alors l'utilisateur devrait être informé que "Vous devez renseigner la date d'échéance pour ce type de garanties financières"

    Plan du Scénario: Impossible de soumettre un dépôt de garanties financières si la date d'échéance est non compatible avec le type
        Quand un porteur soumet un dépôt de garanties financières pour le projet "Du boulodrome de Marseille" avec :
            | type            | <type>     |
            | date d'échéance | 2028-01-01 |
        Alors l'utilisateur devrait être informé que "Vous ne pouvez pas renseigner de date d'échéance pour ce type de garanties financières"

        Exemples:
            | type                      |
            | consignation              |
            | six-mois-après-achèvement |

    Scénario: Impossible de soumettre un dépôt de garanties financières si un dépôt a déjà été soumis
        Etant donné un dépôt de garanties financières pour le projet "Du boulodrome de Marseille" avec :
            | type            | avec-date-échéance |
            | date d'échéance | 2027-12-01         |
        Quand un porteur soumet un dépôt de garanties financières pour le projet "Du boulodrome de Marseille" avec :
            | type | consignation |
        Alors l'utilisateur devrait être informé que "Il y a déjà des garanties financières en attente de validation pour ce projet"

    Scénario: Impossible de soumettre un dépôt de garanties financières si une demande de mainlevée a été demandée
        Etant donné une attestation de conformité transmise pour le projet "Du boulodrome de Marseille"
        Et des garanties financières actuelles pour le projet "Du boulodrome de Marseille"
        Et une demande de mainlevée de garanties financières pour le projet "Du boulodrome de Marseille" avec :
            | motif | projet-achevé |
        Quand un porteur soumet un dépôt de garanties financières pour le projet "Du boulodrome de Marseille" avec :
            | type | consignation |
        Alors l'utilisateur devrait être informé que "Vous ne pouvez pas déposer de nouvelles garanties financières car vous avez une demande de mainlevée de garanties financières en cours"

    Scénario: Impossible de soumettre un dépôt de garanties financières si une demande de mainlevée est en instruction
        Etant donné une attestation de conformité transmise pour le projet "Du boulodrome de Marseille"
        Et des garanties financières actuelles pour le projet "Du boulodrome de Marseille"
        Et une demande de mainlevée de garanties financières en instruction pour le projet "Du boulodrome de Marseille"
        Quand un porteur soumet un dépôt de garanties financières pour le projet "Du boulodrome de Marseille" avec :
            | type | consignation |
        Alors l'utilisateur devrait être informé que "Vous ne pouvez pas déposer de nouvelles garanties financières car vous avez une mainlevée de garanties financières en cours d'instruction"

    Scénario: Impossible de soumettre un dépôt de garanties financières si les garanties financières du projet sont levées
        Etant donné une attestation de conformité transmise pour le projet "Du boulodrome de Marseille"
        Et des garanties financières actuelles pour le projet "Du boulodrome de Marseille"
        Et une demande de mainlevée de garanties financières accordée pour le projet "Du boulodrome de Marseille" achevé
        Quand un porteur soumet un dépôt de garanties financières pour le projet "Du boulodrome de Marseille" avec :
            | type | consignation |
        Alors l'utilisateur devrait être informé que "Vous ne pouvez pas déposer ou modifier des garanties financières car elles ont déjà été levées pour ce projet"
