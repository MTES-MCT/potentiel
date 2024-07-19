# language: fr
Fonctionnalité: Executer une tâche planifiée

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et le porteur pour le projet lauréat "Du boulodrome de Marseille"
            | email | porteur@test.test   |
            | nom   | Porteur Projet Test |
            | role  | porteur-projet      |

    @NotImplemented
    Scénario: Une tâche planifiée est executée
        Etant donné des garanties financières validées pour le projet "Du boulodrome de Marseille" avec :
            | type               | avec-date-échéance |
            | date d'échéance    | 2024-12-01         |
            | date de validation | 2024-11-24         |
        Quand on execute les tâches planifées à la date du "2024-12-02"
        Alors une tâche "échoir les garanties financières" n'est plus est planifée pour le projet "Du boulodrome de Marseille"
        Et les garanties financières du projet "Du boulodrome de Marseilles" sont échues

    @NotImplemented
    Scénario: Une tâche planifiée est executée même si la date d'execution est dépassée
        Etant donné des garanties financières validées pour le projet "Du boulodrome de Marseille" avec :
            | type               | avec-date-échéance |
            | date d'échéance    | 2024-12-01         |
            | date de validation | 2024-11-24         |
        Quand on execute les tâches planifées à la date du "2024-12-03"
        Alors une tâche "échoir les garanties financières" n'est plus est planifée pour le projet "Du boulodrome de Marseille"
        Et les garanties financières du projet "Du boulodrome de Marseilles" sont échues
