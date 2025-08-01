# language: fr
Fonctionnalité: Exécuter une tâche planifiée

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | type GF         | avec-date-échéance |
            | date d'échéance | 2024-01-01         |

    Scénario: Une tâche planifiée est exécutée
        Etant donné une tâche "planifiée" pour le projet lauréat avec :
            | type             | échoir les garanties financières |
            | date d'exécution | 2024-07-02                       |
        Quand on exécute les tâches planifiées à la date du "2024-07-02"
        Alors une tâche "échoir les garanties financières" n'est plus planifiée pour le projet lauréat

    Scénario: Impossible d'executer une tâche planifiée déjà exécutée
        Etant donné une tâche "exécutée" pour le projet lauréat avec :
            | type             | échoir les garanties financières |
            | date d'exécution | 2024-12-03                       |
        Quand on exécute la tâche planifiée "échoir les garanties financières" pour le projet lauréat
        Alors on devrait être informé que "La tâche planifiée est déjà exécutée"

    Scénario: Impossible d'executer une tâche planifiée déjà exécutée
        Etant donné une tâche "annulée" pour le projet lauréat avec :
            | type             | échoir les garanties financières |
            | date d'exécution | 2024-12-03                       |
        Quand on exécute la tâche planifiée "échoir les garanties financières" pour le projet lauréat
        Alors on devrait être informé que "La tâche planifiée est annulée"
