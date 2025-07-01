# language: fr
Fonctionnalité: Effacer tout l'historique de garanties financières d'un projet

    Contexte:
        Etant donné le projet lauréat sans garanties financières importées "Du boulodrome de Marseille"

    Scénario: Un admin supprime l'historique de garanties financières d'un projet
        Etant donné des garanties financières actuelles pour le projet "Du boulodrome de Marseille" avec :
            | type GF         | avec-date-échéance |
            | date d'échéance | 2024-08-01         |
        Et un dépôt de garanties financières pour le projet "Du boulodrome de Marseille" avec :
            | type GF | consignation |
        Quand un admin efface l'historique des garanties financières pour le projet "Du boulodrome de Marseille"
        Alors il ne devrait pas y avoir de dépôt de garanties financières pour le projet "Du boulodrome de Marseille"
        Et il ne devrait pas y avoir de garanties financières actuelles pour le projet "Du boulodrome de Marseille"
        Et un historique des garanties financières devrait être consultable pour le projet "Du boulodrome de Marseille" avec :
            | type GF         | avec-date-échéance       |
            | date d'échéance | 2024-08-01               |
            | raison          | changement de producteur |

    Scénario: Un admin supprime l'historique de garanties financières d'un projet sans garanties financières
        Quand un admin efface l'historique des garanties financières pour le projet "Du boulodrome de Marseille"
        Alors il ne devrait pas y avoir de dépôt de garanties financières pour le projet "Du boulodrome de Marseille"
        Et il ne devrait pas y avoir de garanties financières actuelles pour le projet "Du boulodrome de Marseille"
        Et un historique des garanties financières ne devrait pas être consultable pour le projet lauréat
