# language: fr
Fonctionnalité: Exécuter une tâche planifiée

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et le porteur "Marcel Patoulatchi" ayant accés au projet lauréat "Du boulodrome de Marseille"

    Scénario: Une tâche planifiée est executée
        Etant donné une tâche "planifiée" pour le projet "Du boulodrome de Marseille" avec :
            | type             | échoir les garanties financières |
            | date d'exécution | 2024-07-02                       |
        Quand on execute les tâches planifiées à la date du "2024-07-02"
        Alors une tâche "échoir les garanties financières" n'est plus planifiée pour le projet "Du boulodrome de Marseille"

    Scénario: Impossible d'executer une tâche planifiée déjà executée
        Etant donné une tâche "executée" pour le projet "Du boulodrome de Marseille" avec :
            | type             | échoir les garanties financières |
            | date d'exécution | 2024-12-03                       |
        Quand on execute la tâche planifiée "échoir les garanties financières" pour le projet "Du boulodrome de Marseille"
        Alors on devrait être informé que "La tâche planifiée est déjà executée"

    Scénario: Impossible d'executer une tâche planifiée déjà executée
        Etant donné une tâche "annulée" pour le projet "Du boulodrome de Marseille" avec :
            | type             | échoir les garanties financières |
            | date d'exécution | 2024-12-03                       |
        Quand on execute la tâche planifiée "échoir les garanties financières" pour le projet "Du boulodrome de Marseille"
        Alors on devrait être informé que "La tâche planifiée est annulée"
