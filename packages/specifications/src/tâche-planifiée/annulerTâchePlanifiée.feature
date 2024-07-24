# language: fr
Fonctionnalité: Annuler une tâche planifiée

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et le porteur pour le projet lauréat "Du boulodrome de Marseille"
            | email | porteur@test.test   |
            | nom   | Porteur Projet Test |
            | role  | porteur-projet      |

    Scénario: Une tâche du type "échoir les garanties financières" est annulée quand une attestation de conformité est transmise
        Etant donné des garanties financières validées pour le projet "Du boulodrome de Marseille" avec :
            | type               | avec-date-échéance |
            | date d'échéance    | 2024-12-01         |
            | date de validation | 2024-11-24         |
        Quand un porteur transmet une attestation de conformité pour le projet "Du boulodrome de Marseille" avec :
            | date transmission au co-contractant | 2024-01-01 |
        Alors une tâche "échoir les garanties financières" n'est plus planifiée pour le projet "Du boulodrome de Marseille"

    Scénario: Une tâche du type "rappel échéance garanties financières à un mois" est annulée quand une attestation de conformité est transmise
        Etant donné des garanties financières validées pour le projet "Du boulodrome de Marseille" avec :
            | type               | avec-date-échéance |
            | date d'échéance    | 2024-12-01         |
            | date de validation | 2024-11-24         |
        Quand un porteur transmet une attestation de conformité pour le projet "Du boulodrome de Marseille" avec :
            | date transmission au co-contractant | 2024-01-01 |
        Alors une tâche "rappel échéance garanties financières à un mois" n'est plus planifiée pour le projet "Du boulodrome de Marseille"

    Scénario: Une tâche du type "rappel échéance garanties financières à deux mois" est annulée quand une attestation de conformité est transmise
        Etant donné des garanties financières validées pour le projet "Du boulodrome de Marseille" avec :
            | type               | avec-date-échéance |
            | date d'échéance    | 2024-12-01         |
            | date de validation | 2024-11-24         |
        Quand un porteur transmet une attestation de conformité pour le projet "Du boulodrome de Marseille" avec :
            | date transmission au co-contractant | 2024-01-01 |
        Alors une tâche "rappel échéance garanties financières à deux mois" n'est plus planifiée pour le projet "Du boulodrome de Marseille"

    Scénario: Une tâche du type "échoir les garanties financières" est annulée quand une dépôt de garanties financiéres est soumis
        Etant donné des garanties financières validées pour le projet "Du boulodrome de Marseille" avec :
            | type            | avec-date-échéance |
            | date d'échéance | 2024-12-01         |
        Quand un porteur soumet des garanties financières pour le projet "Du boulodrome de Marseille" avec :
            | type            | avec-date-échéance |
            | date d'échéance | 2024-12-01         |
        Alors une tâche "échoir les garanties financières" n'est plus planifiée pour le projet "Du boulodrome de Marseille"

    @select
    Scénario: Une tâche du type "rappel échéance garanties financières à un mois" est annulée quand une attestation de conformité est transmise
        Etant donné des garanties financières validées pour le projet "Du boulodrome de Marseille" avec :
            | type            | avec-date-échéance |
            | date d'échéance | 2024-12-01         |
        Quand un porteur soumet des garanties financières pour le projet "Du boulodrome de Marseille" avec :
            | type            | avec-date-échéance |
            | date d'échéance | 2024-12-01         |
        Alors une tâche "rappel échéance garanties financières à un mois" n'est plus planifiée pour le projet "Du boulodrome de Marseille"

    @select
    Scénario: Une tâche du type "rappel échéance garanties financières à deux mois" est annulée quand une attestation de conformité est transmise
        Etant donné des garanties financières validées pour le projet "Du boulodrome de Marseille" avec :
            | type            | avec-date-échéance |
            | date d'échéance | 2024-12-01         |
        Quand un porteur soumet des garanties financières pour le projet "Du boulodrome de Marseille" avec :
            | type            | avec-date-échéance |
            | date d'échéance | 2024-12-01         |
        Alors une tâche "rappel échéance garanties financières à deux mois" n'est plus planifiée pour le projet "Du boulodrome de Marseille"
