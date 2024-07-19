# language: fr
Fonctionnalité: Planifier une tâche

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et le porteur pour le projet lauréat "Du boulodrome de Marseille"
            | email | porteur@test.test   |
            | nom   | Porteur Projet Test |
            | role  | porteur-projet      |

    @NotImplemented
    Scénario: Une tâche est annulée quand une attestation de confirmité est transimise
        Etant donné des garanties financières validées pour le projet "Du boulodrome de Marseille" avec :
            | type               | avec-date-échéance |
            | date d'échéance    | 2024-12-01         |
            | date de validation | 2024-11-24         |
        Quand un porteur transmet une attestation de conformité pour le projet "Du boulodrome de Marseille"
            | date transmission au co-contractant | 2040-01-01 |
        Alors une tâche "échoir les garanties financières" n'est plus est planifiée pour le projet "Du boulodrome de Marseille"
