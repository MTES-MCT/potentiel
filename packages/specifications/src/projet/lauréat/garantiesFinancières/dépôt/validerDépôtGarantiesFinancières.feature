# language: fr
Fonctionnalité: Valider un dépôt de garanties financières

    Contexte:
        Etant donné le projet lauréat sans garanties financières importées "Du boulodrome de Marseille"
        Et le porteur "Marcel Patoulatchi" ayant accés au projet lauréat "Du boulodrome de Marseille"

    Plan du Scénario: Valide un dépôt de garanties financières
        Etant donné des garanties financières en attente pour le projet "Du boulodrome de Marseille" avec :
            | date limite de soumission | 2023-11-01    |
            | date de notification      | 2023-09-01    |
            | motif                     | motif-inconnu |
        Et un dépôt de garanties financières pour le projet "Du boulodrome de Marseille" avec :
            | type                 | <type>                 |
            | date d'échéance      | <date d'échéance>      |
            | format               | <format du fichier>    |
            | contenu fichier      | <contenu du fichier>   |
            | date de constitution | <date de constitution> |
            | date de soumission   | 2023-10-01             |
            | soumis par           | porteur@test.test      |
        Quand l'utilisateur dreal valide un dépôt de garanties financières pour le projet "Du boulodrome de Marseille" avec :
            | date de validation | <date de validation> |
        Alors les garanties financières actuelles devraient être consultables pour le projet "Du boulodrome de Marseille" avec :
            | type                 | <type>                 |
            | date d'échéance      | <date d'échéance>      |
            | format               | <format du fichier>    |
            | contenu fichier      | <contenu du fichier>   |
            | date de constitution | <date de constitution> |
            | date de validation   | <date de validation>   |
        Et il ne devrait pas y avoir de dépôt de garanties financières pour le projet "Du boulodrome de Marseille"

        Exemples:
            | type                      | date d'échéance | format du fichier | contenu du fichier    | date de constitution | date de validation |
            | avec-date-échéance        | 2027-12-01      | application/pdf   | le contenu du fichier | 2023-06-01           | 2023-10-10         |
            | consignation              |                 | application/pdf   | le contenu du fichier | 2023-06-01           | 2023-10-10         |
            | six-mois-après-achèvement |                 | application/pdf   | le contenu du fichier | 2023-06-01           | 2023-10-10         |

    Scénario: Valider un dépôt de garanties financières pour un projet ayant déjà des garanties financières actuelles avec un statut validé
        Etant donné des garanties financières actuelles pour le projet "Du boulodrome de Marseille"

        Et un dépôt de garanties financières pour le projet "Du boulodrome de Marseille"
        Quand l'utilisateur dreal valide un dépôt de garanties financières pour le projet "Du boulodrome de Marseille" avec :
            | date de validation | 2023-10-10 |
        Et un historique des garanties financières devrait être consultable pour le projet "Du boulodrome de Marseille" avec :
            | raison | modification des garanties financières |

    Scénario: Valider un dépôt de garanties financières pour un projet ayant déjà des garanties financières actuelles avec un statut échu
        Etant donné des garanties financières actuelles échues pour le projet "Du boulodrome de Marseille" avec :
            | type            | avec-date-échéance |
            | date d'échéance | 2024-07-17         |
        Et un dépôt de garanties financières pour le projet "Du boulodrome de Marseille"
        Quand l'utilisateur dreal valide un dépôt de garanties financières pour le projet "Du boulodrome de Marseille" avec :
            | date de validation | 2023-10-10 |
        Et un historique des garanties financières devrait être consultable pour le projet "Du boulodrome de Marseille" avec :
            | type            | avec-date-échéance                              |
            | date d'échéance | 2024-07-17                                      |
            | statut          | échu                                            |
            | raison          | renouvellement des garanties financières échues |

    Scénario: Une tâche du type "échoir les garanties financières" est planifiée quand des garanties financières avec date d'échéance sont créées
        Etant donné un dépôt de garanties financières pour le projet "Du boulodrome de Marseille" avec :
            | type            | avec-date-échéance |
            | date d'échéance | 2024-12-01         |
        Quand l'utilisateur dreal valide un dépôt de garanties financières pour le projet "Du boulodrome de Marseille" avec :
            | date de validation | 2024-11-02 |
            | date d'échéance    | 2024-12-01 |
        Alors une tâche "échoir les garanties financières" est planifiée à la date du "2024-12-02" pour le projet "Du boulodrome de Marseille"

    Scénario: Des tâches de la catégorie "rappel échéance garanties financières" sont planifiées à M-1 et M-2 de la date d'échéance en cas de dépôt validé
        Etant donné un dépôt de garanties financières pour le projet "Du boulodrome de Marseille" avec :
            | type            | avec-date-échéance |
            | date d'échéance | 2024-10-01         |
        Quand l'utilisateur dreal valide un dépôt de garanties financières pour le projet "Du boulodrome de Marseille" avec :
            | date de validation | 2023-10-10 |
            | date d'échéance    | 2024-10-01 |
        Alors une tâche "rappel échéance garanties financières à un mois" est planifiée à la date du "2024-09-01" pour le projet "Du boulodrome de Marseille"
        Et une tâche "rappel échéance garanties financières à deux mois" est planifiée à la date du "2024-08-01" pour le projet "Du boulodrome de Marseille"

    Scénario: Impossible de valider un dépôt de garanties financières si aucune dépôt n'est trouvé
        Etant donné des garanties financières en attente pour le projet "Du boulodrome de Marseille" avec :
            | date limite de soumission | 2023-11-01    |
            | date de notification      | 2023-09-01    |
            | motif                     | motif-inconnu |
        Quand l'utilisateur dreal valide un dépôt de garanties financières pour le projet "Du boulodrome de Marseille" avec :
            | date de validation | 2023-09-02 |
        Alors l'utilisateur devrait être informé que "Il n'y a aucun dépôt de garanties financières en cours pour ce projet"
