# language: fr
@garanties-financières
@garanties-financières-actuelles
Fonctionnalité: Importer le type (et la date d'échéance selon le cas) des garanties financières actuelles d'un projet lors de la notification

    Plan du Scénario: Un admin importe le type des garanties financières actuelles d'un projet
        Etant donné la candidature lauréate "Du boulodrome de Marseille" avec :
            | appel d'offre   | <AO>              |
            | type GF         | <type GF>         |
            | date d'échéance | <date d'échéance> |
        Quand le DGEC validateur notifie la candidature lauréate
        Alors les garanties financières actuelles devraient être consultables pour le projet lauréat

        Exemples:
            | type GF                   | AO                       | date d'échéance |
            | avec-date-échéance        | PPE2 - Sol               | 2027-12-01      |
            | six-mois-après-achèvement | PPE2 - Eolien            |                 |
            | consignation              | CRE4 - ZNI               |                 |
            | garantie-bancaire         | PPE2 - Petit PV Bâtiment |                 |

    Scénario: Une tâche du type "échoir les garanties financières" est planifiée quand l'administration importe le type d'une garanties financières pour un projet
        Etant donné la candidature lauréate "Du boulodrome de Marseille" avec :
            | appel d'offre   | PPE2 - ZNI         |
            | type GF         | avec-date-échéance |
            | date d'échéance | 2024-12-02         |
        Quand le DGEC validateur notifie la candidature lauréate
        Alors une tâche "échoir les garanties financières" est planifiée à la date du "2024-12-03" pour le projet lauréat

    Scénario: Des tâches de la catégorie "rappel échéance garanties financières" sont planifiées si un type de GF de type avec date d'échéance est importé lors d'une désignation
        Etant donné la candidature lauréate "Du boulodrome de Marseille" avec :
            | appel d'offre   | PPE2 - Autoconsommation métropole |
            | type GF         | avec-date-échéance                |
            | date d'échéance | 2024-10-01                        |
        Quand le DGEC validateur notifie la candidature lauréate
        Alors une tâche "rappel échéance garanties financières à un mois" est planifiée à la date du "2024-09-01" pour le projet lauréat
        Et une tâche "rappel échéance garanties financières à deux mois" est planifiée à la date du "2024-08-01" pour le projet lauréat
