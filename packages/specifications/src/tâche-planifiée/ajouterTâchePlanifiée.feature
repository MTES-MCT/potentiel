# language: fr
Fonctionnalité: Planifier une tâche

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et le porteur pour le projet lauréat "Du boulodrome de Marseille"
            | email | porteur@test.test   |
            | nom   | Porteur Projet Test |
            | role  | porteur-projet      |

    Scénario: Une tâche est planifiée quand des garanties financières avec date d'échéance sont créées
        Etant donné des garanties financières à traiter pour le projet "Du boulodrome de Marseille" avec :
            | type            | avec-date-échéance |
            | date d'échéance | 2024-12-01         |
        Quand l'utilisateur dreal valide les garanties financières à traiter pour le projet "Du boulodrome de Marseille" avec :
            | date de validation | 2024-11-02 |
        Alors une tâche "échoir les garanties financières" est planifiée à la date du "2024-12-02" pour le projet "Du boulodrome de Marseille"

    Scénario: Une tâche est replanifiée quand la date d'échéance des garanties financières est modifiée
        Etant donné des garanties financières validées pour le projet "Du boulodrome de Marseille" avec :
            | type               | avec-date-échéance |
            | date d'échéance    | 2024-12-01         |
            | date de validation | 2024-11-24         |
        Quand un admin modifie les garanties financières validées pour le projet "Du boulodrome de Marseille" avec :
            | type            | avec-date-échéance |
            | date d'échéance | 2024-12-02         |
        Alors une tâche "échoir les garanties financières" est planifiée à la date du "2024-12-03" pour le projet "Du boulodrome de Marseille"
