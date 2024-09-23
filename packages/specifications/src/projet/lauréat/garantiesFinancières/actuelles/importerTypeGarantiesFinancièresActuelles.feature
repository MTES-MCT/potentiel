# language: fr
Fonctionnalité: Importer le type (et la date d'échéance selon le cas) des garanties financières actuelles d'un projet

    Contexte:
        Etant donné le DGEC validateur "Robert Robichet"

    Plan du Scénario: Un admin importe le type des garanties financières actuelles d'un projet
        Etant donné la candidature lauréate "Du boulodrome de Marseille" avec :
            | type GF          | <type>            |
            | date échéance GF | <date d'échéance> |

        Quand le DGEC validateur notifie la candidature comme lauréate
        Alors les garanties financières actuelles devraient être consultables pour le projet "Du boulodrome de Marseille" avec :
            | type GF          | <type>            |
            | date échéance GF | <date d'échéance> |

        Exemples:
            | type                      | date d'échéance |
            | avec-date-échéance        | 2027-12-01      |
            | consignation              |                 |
            | six-mois-après-achèvement |                 |

    Scénario: Une tâche du type "échoir les garanties financières" est planifiée quand l'administration importe le type d'une garanties financières pour un projet
        Etant donné la candidature lauréate "Du boulodrome de Marseille" avec :
            | type GF          | avec-date-échéance |
            | date échéance GF | 2024-10-02         |

        Quand le DGEC validateur notifie la candidature comme lauréate
        Alors une tâche "échoir les garanties financières" est planifiée à la date du "2024-10-03" pour le projet "Du boulodrome de Marseille"

    Scénario: Des tâches de la catégorie "rappel échéance garanties financières" sont planifiées à M-1 et M-2 de la date d'échéance en cas de type de garanties financières importé
        Etant donné la candidature lauréate "Du boulodrome de Marseille" avec :
            | type GF          | avec-date-échéance |
            | date échéance GF | 2024-10-01         |

        Quand le DGEC validateur notifie la candidature comme lauréate
        Alors une tâche "rappel échéance garanties financières à un mois" est planifiée à la date du "2024-09-01" pour le projet "Du boulodrome de Marseille"
        Et une tâche "rappel échéance garanties financières à deux mois" est planifiée à la date du "2024-08-01" pour le projet "Du boulodrome de Marseille"


# Scénario: Impossible d'importer le type (et la date d'échéance selon le cas) des garanties financières actuelles d'un projet si date d'échéance manquante
#     Etant donné la candidature lauréate "Du boulodrome de Marseille" avec :
#         | type GF          | avec-date-échéance |
#         | date échéance GF |                    |
#     Quand le DGEC validateur notifie la candidature comme lauréate
#     Alors l'utilisateur devrait être informé que "Vous devez renseigner la date d'échéance pour ce type de garanties financières"
# @select
# Plan du Scénario: Impossible d'importer le type (et la date d'échéance selon le cas) des garanties financières actuelles d'un projet si la date d'échéance est non compatible avec le type
#     Etant donné la candidature lauréate "Du boulodrome de Marseille" avec :
#         | type GF          | <type>     |
#         | date échéance GF | 2028-01-01 |
#     Quand le DGEC validateur notifie la candidature comme lauréate
#     Alors l'utilisateur devrait être informé que "Vous ne pouvez pas renseigner de date d'échéance pour ce type de garanties financières"

#     Exemples:
#         | type                      |
#         | consignation              |
#         | six-mois-après-achèvement |