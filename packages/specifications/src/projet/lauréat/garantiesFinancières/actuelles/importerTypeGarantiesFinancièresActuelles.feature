# language: fr
Fonctionnalité: Importer le type (et la date d'échéance selon le cas) des garanties financières actuelles d'un projet lors de la notification

    Contexte:
        Etant donné la candidature lauréate "Du boulodrome de Marseille"

    Plan du Scénario: Un admin importe le type des garanties financières actuelles d'un projet
        Quand un admin importe le type des garanties financières actuelles pour le projet avec :
            | type GF         | <type GF>         |
            | date d'échéance | <date d'échéance> |
        Alors les garanties financières actuelles devraient être consultables pour le projet "Du boulodrome de Marseille" avec :
            | type GF         | <type GF>         |
            | date d'échéance | <date d'échéance> |

        Exemples:
            | type GF                   | date d'échéance |
            | avec-date-échéance        | 2027-12-01      |
            | consignation              |                 |
            | six-mois-après-achèvement |                 |

    Scénario: Une tâche du type "échoir les garanties financières" est planifiée quand l'administration importe le type d'une garanties financières pour un projet
        Quand un admin importe le type des garanties financières actuelles pour le projet avec :
            | type GF         | avec-date-échéance |
            | date d'échéance | 2024-12-02         |
        Alors une tâche "échoir les garanties financières" est planifiée à la date du "2024-12-03" pour le projet "Du boulodrome de Marseille"

    Scénario: Des tâches de la catégorie "rappel échéance garanties financières" sont planifiées à M-1 et M-2 de la date d'échéance en cas de type de garanties financières importé
        Quand un admin importe le type des garanties financières actuelles pour le projet avec :
            | type GF         | avec-date-échéance |
            | date d'échéance | 2024-10-01         |
        Alors une tâche "rappel échéance garanties financières à un mois" est planifiée à la date du "2024-09-01" pour le projet "Du boulodrome de Marseille"
        Et une tâche "rappel échéance garanties financières à deux mois" est planifiée à la date du "2024-08-01" pour le projet "Du boulodrome de Marseille"
