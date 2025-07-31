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

    Scénario: Le document sensible est automatiquement supprimé 3 mois après la déclaration de changement de représentant légal
        Etant donné le projet lauréat "Du boulodrome de Lyon" avec :
            | appel d'offre | PPE2 - Petit PV Bâtiment |
            | période       | 1                        |
        Et un cahier des charges permettant la modification du projet
        Et un changement de représentant légal enregistré pour le projet lauréat
        Quand on exécute la tâche planifiée "supprimer automatiquement le document à trois mois" pour le projet lauréat
        Alors une tâche "supprimer automatiquement le document à trois mois" n'est plus planifiée pour le projet lauréat
        Et le document sensible fourni lors du changement de représentant légal devrait être remplacé

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
