# language: fr
Fonctionnalité: Effacer tout l'historique de garanties financières d'un projet

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"

    @select
    Scénario: Un admin supprime l'historique de garanties financières d'un projet
        Etant donné des garanties financières actuelles pour le projet "Du boulodrome de Marseille" avec :
            | type                 | avec-date-échéance |
            | date d'échéance      | 2024-08-01         |
            | format               | application/pdf    |
            | contenu fichier      | contenu fichier 1  |
            | date de constitution | 2023-06-10         |
            | date de soumission   | 2023-11-01         |
            | soumis par           | porteur@test.test  |
            | date de validation   | 2023-11-03         |
        Et un dépôt de garanties financières pour le projet "Du boulodrome de Marseille" avec :
            | type | consignation |
        Quand un admin efface l'historique des garanties financières pour le projet "Du boulodrome de Marseille"
        Alors il ne devrait pas y avoir de dépôt de garanties financières pour le projet "Du boulodrome de Marseille"
        Et il ne devrait pas y avoir de garanties financières actuelles pour le projet "Du boulodrome de Marseille"
        Et un historique des garanties financières devrait être consultable pour le projet "Du boulodrome de Marseille" avec :
            | type                 | avec-date-échéance |
            | date d'échéance      | 2024-08-01         |
            | format               | application/pdf    |
            | contenu fichier      | contenu fichier 1  |
            | date de constitution | 2023-06-10         |
            | date de soumission   | 2023-11-01         |
            | soumis par           | porteur@test.test  |
            | date de validation   | 2023-11-03         |

    Scénario: Impossible d'effacer l'historique des garanties financières s'il n'y a aucun historique de garanties financières sur le projet
        Quand un admin efface l'historique des garanties financières pour le projet "Du boulodrome de Marseille"
        Alors l'utilisateur devrait être informé que "Il n'y a aucunes garanties financières sur ce projet"
