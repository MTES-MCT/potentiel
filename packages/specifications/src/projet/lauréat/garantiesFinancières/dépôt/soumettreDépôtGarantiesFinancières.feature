# language: fr
@garanties-financières
@dépôt-garanties-financières
Fonctionnalité: Soumettre de nouvelles garanties financières

    Contexte:
        Etant donné le projet lauréat sans garanties financières importées "Du boulodrome de Marseille"
        Et un cahier des charges permettant la modification du projet
        Et la dreal "Dreal du sud" associée à la région du projet

    Plan du Scénario: Un porteur soumet un dépôt de garanties financières
        Etant donné des garanties financières en attente pour le projet lauréat
        Quand un porteur soumet un dépôt de garanties financières pour le projet lauréat avec :
            | type GF         | <type GF>         |
            | date d'échéance | <date d'échéance> |
        Alors le dépôt de garanties financières devrait être consultable pour le projet lauréat
        Et les garanties financières en attente du projet ne devraient plus être consultables

        Exemples:
            | type GF                   | date d'échéance |
            | avec-date-échéance        | 2027-12-01      |
            | consignation              |                 |
            | six-mois-après-achèvement |                 |

    Scénario: Un porteur soumet un dépôt de garanties financières avec un type exemption
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offres | PPE2 - Petit PV Bâtiment |
        Quand un porteur soumet un dépôt de garanties financières pour le projet lauréat avec :
            | type GF              | exemption  |
            | date de délibération | 2020-01-01 |
        Alors le dépôt de garanties financières devrait être consultable pour le projet lauréat
        Et les garanties financières en attente du projet ne devraient plus être consultables

    Scénario: Une tâche du type "échoir les garanties financières" est annulée quand une dépôt de garanties financiéres est soumis
        Etant donné des garanties financières actuelles pour le projet lauréat avec :
            | type GF         | avec-date-échéance |
            | date d'échéance | 2024-12-01         |
        Quand un porteur soumet un dépôt de garanties financières pour le projet lauréat avec :
            | type GF         | avec-date-échéance |
            | date d'échéance | 2024-12-01         |
        Alors une tâche "échoir les garanties financières" n'est plus planifiée pour le projet lauréat

    Scénario: Une tâche du type "rappel échéance garanties financières à un mois" est annulée quand une attestation de conformité est transmise
        Etant donné des garanties financières actuelles pour le projet lauréat avec :
            | type GF         | avec-date-échéance |
            | date d'échéance | 2024-12-01         |
        Quand un porteur soumet un dépôt de garanties financières pour le projet lauréat avec :
            | type GF         | avec-date-échéance |
            | date d'échéance | 2024-12-01         |
        Alors une tâche "rappel échéance garanties financières à un mois" n'est plus planifiée pour le projet lauréat

    Scénario: Une tâche du type "rappel échéance garanties financières à deux mois" est annulée quand une attestation de conformité est transmise
        Etant donné des garanties financières actuelles pour le projet lauréat avec :
            | type GF         | avec-date-échéance |
            | date d'échéance | 2024-12-01         |
        Quand un porteur soumet un dépôt de garanties financières pour le projet lauréat avec :
            | type GF         | avec-date-échéance |
            | date d'échéance | 2024-12-01         |
        Alors une tâche "rappel échéance garanties financières à deux mois" n'est plus planifiée pour le projet lauréat

    Scénario: Impossible de soumettre un dépôt de garanties financières si la date de constitution est dans le futur
        Quand un porteur soumet un dépôt de garanties financières pour le projet lauréat avec :
            | date de constitution | 2055-01-01 |
        Alors l'utilisateur devrait être informé que "La date de constitution des garanties financières ne peut pas être une date future"

    Scénario: Impossible de soumettre un dépôt de garanties financières si date d'échéance manquante
        Quand un porteur soumet un dépôt de garanties financières pour le projet lauréat avec :
            | type GF         | avec-date-échéance |
            | date d'échéance |                    |
        Alors l'utilisateur devrait être informé que "La date d'échéance des garanties financières est requise"

    Plan du Scénario: Impossible de soumettre un dépôt de garanties financières si la date d'échéance est non compatible avec le type
        Quand un porteur soumet un dépôt de garanties financières pour le projet lauréat avec :
            | type GF         | <type GF>  |
            | date d'échéance | 2028-01-01 |
        Alors l'utilisateur devrait être informé que "La date d'échéance ne peut être renseignée pour ce type de garanties financières"

        Exemples:
            | type GF                   |
            | consignation              |
            | six-mois-après-achèvement |

    Scénario: Impossible de soumettre un dépôt de garanties financières si un dépôt a déjà été soumis
        Etant donné un dépôt de garanties financières avec :
            | type GF         | avec-date-échéance |
            | date d'échéance | 2027-12-01         |
        Quand un porteur soumet un dépôt de garanties financières pour le projet lauréat avec :
            | type GF | consignation |
        Alors l'utilisateur devrait être informé que "Il y a déjà des garanties financières en attente de validation pour ce projet"

    Scénario: Impossible de soumettre un type de garantie financière non disponible pour l'appel d'offre
        Etant donné le projet lauréat "Du Boulodrome de Toulouse" avec :
            | appel d'offres | PPE2 - Sol   |
            | type GF        | consignation |
        Quand un porteur soumet un dépôt de garanties financières pour le projet lauréat avec :
            | type GF              | exemption  |
            | date de délibération | 2025-01-01 |
        Alors l'utilisateur devrait être informé que "Ce type de garanties financières n'est pas disponible pour cet appel d'offres"

    Scénario: Impossible de soumettre un dépôt de garanties financières si une demande de mainlevée a été demandée
        Etant donné une attestation de conformité transmise pour le projet lauréat
        Et des garanties financières actuelles pour le projet lauréat
        Et une demande de mainlevée de garanties financières
        Quand un porteur soumet un dépôt de garanties financières pour le projet lauréat avec :
            | type GF | consignation |
        Alors l'utilisateur devrait être informé que "Vous ne pouvez pas déposer de nouvelles garanties financières car vous avez une demande de mainlevée de garanties financières en cours"

    Scénario: Impossible de soumettre un dépôt de garanties financières si une demande de mainlevée est en instruction
        Etant donné une attestation de conformité transmise pour le projet lauréat
        Et des garanties financières actuelles pour le projet lauréat
        Et une demande de mainlevée de garanties financières en instruction
        Quand un porteur soumet un dépôt de garanties financières pour le projet lauréat avec :
            | type GF | consignation |
        Alors l'utilisateur devrait être informé que "Vous ne pouvez pas déposer de nouvelles garanties financières car vous avez une mainlevée de garanties financières en cours d'instruction"

    Scénario: Impossible de soumettre un dépôt de garanties financières si les garanties financières du projet sont levées
        Etant donné une attestation de conformité transmise pour le projet lauréat
        Et des garanties financières actuelles pour le projet lauréat
        Et une demande de mainlevée de garanties financières accordée
        Quand un porteur soumet un dépôt de garanties financières pour le projet lauréat avec :
            | type GF | consignation |
        Alors l'utilisateur devrait être informé que "Vous ne pouvez pas déposer ou modifier des garanties financières car elles ont déjà été levées pour ce projet"

    Scénario: Soumettre un dépôt de garanties financière annule la relance de demande de Garanties Financières
        Etant donné des garanties financières en attente pour le projet lauréat
        Quand un porteur soumet un dépôt de garanties financières pour le projet lauréat
        Alors une tâche "rappel des garanties financières à transmettre" n'est plus planifiée pour le projet lauréat

    Scénario: Impossible de soumettre un dépôt de garanties financières si le projet est exempt de garanties financières
        Etant donné le projet lauréat "Du Boulodrome de Tourcoing" avec :
            | appel d'offres       | PPE2 - Petit PV Bâtiment |
            | type GF              | exemption                |
            | date de délibération | 2025-01-01               |
        Quand un porteur soumet un dépôt de garanties financières pour le projet lauréat avec :
            | type GF | consignation |
        Alors l'utilisateur devrait être informé que "Le projet est exempt de garanties financières"
