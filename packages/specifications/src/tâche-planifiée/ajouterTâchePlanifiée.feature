# language: fr
Fonctionnalité: Planifier une tâche

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et le porteur pour le projet lauréat "Du boulodrome de Marseille"
            | email | porteur@test.test   |
            | nom   | Porteur Projet Test |
            | role  | porteur-projet      |

    Scénario: Une tâche du type "échoir les garanties financières" est planifiée quand des garanties financières avec date d'échéance sont créées
        Etant donné des garanties financières à traiter pour le projet "Du boulodrome de Marseille" avec :
            | type            | avec-date-échéance |
            | date d'échéance | 2024-12-01         |
        Quand l'utilisateur dreal valide les garanties financières à traiter pour le projet "Du boulodrome de Marseille" avec :
            | date de validation | 2024-11-02 |
        Alors une tâche "échoir les garanties financières" est planifiée à la date du "2024-12-02" pour le projet "Du boulodrome de Marseille"

    Scénario: Une tâche du type "échoir les garanties financières" est replanifiée quand la date d'échéance des garanties financières est modifiée
        Etant donné des garanties financières validées pour le projet "Du boulodrome de Marseille" avec :
            | type               | avec-date-échéance |
            | date d'échéance    | 2024-12-01         |
            | date de validation | 2024-11-24         |
        Quand un admin modifie les garanties financières validées pour le projet "Du boulodrome de Marseille" avec :
            | type            | avec-date-échéance |
            | date d'échéance | 2024-12-02         |
        Alors une tâche "échoir les garanties financières" est planifiée à la date du "2024-12-03" pour le projet "Du boulodrome de Marseille"

    Scénario: Une tâche du type "échoir les garanties financières" est planifiée quand des garanties financières sont enregisrées par l'administration
        Quand un admin enregistre les garanties financières validées pour le projet "Du boulodrome de Marseille" avec :
            | type             | avec-date-échéance |
            | date d'échéance  | 2024-12-02         |
            | date mise à jour | 2024-11-02         |
        Alors une tâche "échoir les garanties financières" est planifiée à la date du "2024-12-03" pour le projet "Du boulodrome de Marseille"

    Scénario: Une tâche du type "échoir les garanties financières" est planifiée quand l'administration importe le type d'une garanties financières pour un projet
        Quand un admin importe le type des garanties financières pour le projet "Du boulodrome de Marseille" avec :
            | type            | avec-date-échéance |
            | date d'échéance | 2024-12-02         |
        Alors une tâche "échoir les garanties financières" est planifiée à la date du "2024-12-03" pour le projet "Du boulodrome de Marseille"

    Scénario: Des tâches de la catégorie "rappel échéance garanties financières" sont planifiées à M-1 et M-2 de la date d'échéance en cas de dépôt validé
        Etant donné des garanties financières à traiter pour le projet "Du boulodrome de Marseille" avec :
            | type            | avec-date-échéance |
            | date d'échéance | 2024-10-01         |
        Quand l'utilisateur dreal valide les garanties financières à traiter pour le projet "Du boulodrome de Marseille" avec :
            | date de validation | 2023-10-10 |
        Alors une tâche "rappel échéance garanties financières à un mois" est planifiée à la date du "2024-09-01" pour le projet "Du boulodrome de Marseille"
        Et une tâche "rappel échéance garanties financières à deux mois" est planifiée à la date du "2024-08-01" pour le projet "Du boulodrome de Marseille"

    Scénario: Des tâches de la catégorie "rappel échéance garanties financières" sont planifiées à M-1 et M-2 de la date d'échéance en cas de garanties financières actuelles modifiées
        Etant donné des garanties financières validées pour le projet "Du boulodrome de Marseille" avec :
            | type            | avec-date-échéance |
            | date d'échéance | 2024-08-01         |
        Quand un admin modifie les garanties financières validées pour le projet "Du boulodrome de Marseille" avec :
            | type            | avec-date-échéance |
            | date d'échéance | 2024-10-01         |
        Alors une tâche "rappel échéance garanties financières à un mois" est planifiée à la date du "2024-09-01" pour le projet "Du boulodrome de Marseille"
        Et une tâche "rappel échéance garanties financières à deux mois" est planifiée à la date du "2024-08-01" pour le projet "Du boulodrome de Marseille"

    @NotImplemented
    Scénario: Des tâches de la catégorie "rappel échéance garanties financières" sont planifiées à M-1 et M-2 de la date d'échéance en cas de garanties financières enregistrées


    @NotImplemented
    Scénario: Des tâches de la catégorie "rappel échéance garanties financières" sont planifiées à M-1 et M-2 de la date d'échéance en cas de type de garanties financières importé

