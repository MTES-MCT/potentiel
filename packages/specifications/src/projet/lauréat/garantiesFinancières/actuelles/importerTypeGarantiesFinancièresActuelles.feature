# language: fr
Fonctionnalité: Importer le type (et la date d'échéance selon le cas) des garanties financières actuelles d'un projet

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et le porteur pour le projet lauréat "Du boulodrome de Marseille"
            | email | porteur@test.test   |
            | nom   | Porteur Projet Test |
            | role  | porteur-projet      |

    Plan du Scénario: Un admin importe le type des garanties financières actuelles d'un projet
        Quand un admin importe le type des garanties financières actuelles pour le projet "Du boulodrome de Marseille" avec :
            | type            | <type>            |
            | date d'échéance | <date d'échéance> |
            | date d'import   | <date import>     |
        Alors les garanties financières actuelles devraient être consultables pour le projet "Du boulodrome de Marseille" avec :
            | type                      | <type>            |
            | date d'échéance           | <date d'échéance> |
            | date dernière mise à jour | <date import>     |

        Exemples:
            | type                      | date d'échéance | date import |
            | avec-date-échéance        | 2027-12-01      | 2024-01-01  |
            | consignation              |                 | 2024-01-01  |
            | six-mois-après-achèvement |                 | 2024-01-01  |

    Scénario: Un admin importe le type des garanties financières actuelles d'un projet en attente de garanties financières
        Etant donné des garanties financières en attente pour le projet "Du boulodrome de Marseille" avec :
            | date limite de soumission | 2024-02-01      |
            | date de notification      | 2023-09-01      |
            | motif                     | recours-accordé |
        Quand un admin importe le type des garanties financières actuelles pour le projet "Du boulodrome de Marseille" avec :
            | type          | consignation |
            | date d'import | 2024-01-01   |
        Alors les garanties financières actuelles devraient être consultables pour le projet "Du boulodrome de Marseille" avec :
            | type                      | consignation |
            | date dernière mise à jour | 2024-01-01   |
        Et les garanties financières en attente du projet "Du boulodrome de Marseille" ne devraient plus être consultables dans la liste des garanties financières en attente

    Scénario: Une tâche du type "échoir les garanties financières" est planifiée quand l'administration importe le type d'une garanties financières pour un projet
        Quand un admin importe le type des garanties financières actuelles pour le projet "Du boulodrome de Marseille" avec :
            | type            | avec-date-échéance |
            | date d'échéance | 2024-12-02         |
        Alors une tâche "échoir les garanties financières" est planifiée à la date du "2024-12-03" pour le projet "Du boulodrome de Marseille"

    Scénario: Des tâches de la catégorie "rappel échéance garanties financières" sont planifiées à M-1 et M-2 de la date d'échéance en cas de type de garanties financières importé
        Quand un admin importe le type des garanties financières actuelles pour le projet "Du boulodrome de Marseille" avec :
            | type            | avec-date-échéance |
            | date d'échéance | 2024-10-01         |
        Alors une tâche "rappel échéance garanties financières à un mois" est planifiée à la date du "2024-09-01" pour le projet "Du boulodrome de Marseille"
        Et une tâche "rappel échéance garanties financières à deux mois" est planifiée à la date du "2024-08-01" pour le projet "Du boulodrome de Marseille"

    Scénario: Impossible d'importer le type (et la date d'échéance selon le cas) des garanties financières actuelles d'un projet si date d'échéance manquante
        Quand un admin importe le type des garanties financières actuelles pour le projet "Du boulodrome de Marseille" avec :
            | type            | avec-date-échéance |
            | date d'échéance |                    |
        Alors l'utilisateur devrait être informé que "Vous devez renseigner la date d'échéance pour ce type de garanties financières"

    Plan du Scénario: Impossible d'importer le type (et la date d'échéance selon le cas) des garanties financières actuelles d'un projet si la date d'échéance est non compatible avec le type
        Quand un admin importe le type des garanties financières actuelles pour le projet "Du boulodrome de Marseille" avec :
            | type            | <type>     |
            | date d'échéance | 2028-01-01 |
        Alors l'utilisateur devrait être informé que "Vous ne pouvez pas renseigner de date d'échéance pour ce type de garanties financières"

        Exemples:
            | type                      |
            | consignation              |
            | six-mois-après-achèvement |
