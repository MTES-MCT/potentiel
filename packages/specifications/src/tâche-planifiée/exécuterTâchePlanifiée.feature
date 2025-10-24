# language: fr
@tâche-planifiée
Fonctionnalité: Exécuter une tâche planifiée

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | type GF         | avec-date-échéance |
            | date d'échéance | 2050-01-01         |

    Scénario: Une tâche planifiée est exécutée
        Etant donné une tâche planifiée pour le projet lauréat avec :
            | type             | échoir les garanties financières |
            | date d'exécution | 2050-07-02                       |
        Quand on exécute les tâches planifiées à la date du "2050-07-02"
        Alors il n'y a pas de tâche "échoir les garanties financières" planifiée pour le projet lauréat

    Scénario: Impossible d'executer une tâche planifiée déjà exécutée
        Etant donné une tâche planifiée exécutée pour le projet lauréat avec :
            | type             | échoir les garanties financières |
            | date d'exécution | 2050-12-03                       |
            | exécutée le      | 2050-12-03                       |
        Quand on exécute la tâche planifiée "échoir les garanties financières" pour le projet lauréat à la date du "2050-12-03"
        Alors on devrait être informé que "La tâche planifiée est déjà exécutée"

    Scénario: Impossible d'executer une tâche planifiée annulée
        Etant donné une tâche planifiée annulée pour le projet lauréat avec :
            | type             | échoir les garanties financières |
            | date d'exécution | 2050-12-03                       |
        Quand on exécute la tâche planifiée "échoir les garanties financières" pour le projet lauréat à la date du "2050-12-03"
        Alors on devrait être informé que "La tâche planifiée est annulée"
