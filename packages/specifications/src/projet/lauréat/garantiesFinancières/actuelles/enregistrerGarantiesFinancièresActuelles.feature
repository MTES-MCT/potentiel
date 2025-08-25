# language: fr
@garanties-financières
@garanties-financières-actuelles
Fonctionnalité: Enregistrer des garanties financières actuelles

    Contexte:
        Etant donné le projet lauréat sans garanties financières importées "Du boulodrome de Marseille"

    Plan du Scénario: Un porteur enregistre des garanties financières actuelles pour un projet ayant des garanties financières en attente
        Etant donné des garanties financières en attente pour le projet lauréat
        Quand un porteur enregistre les garanties financières actuelles pour le projet lauréat avec :
            | type GF         | <type GF>         |
            | date d'échéance | <date d'échéance> |
        Alors les garanties financières actuelles devraient être consultables pour le projet lauréat
        Et les garanties financières en attente du projet "Du boulodrome de Marseille" ne devraient plus être consultables
        Et une tâche "rappel des garanties financières à transmettre" n'est plus planifiée pour le projet lauréat

        Exemples:
            | type GF                   | date d'échéance |
            | avec-date-échéance        | 2027-12-01      |
            | consignation              |                 |
            | six-mois-après-achèvement |                 |
            | garantie-bancaire         |                 |

    Plan du Scénario: Un porteur enregistre des garanties financières actuelles
        Quand un porteur enregistre les garanties financières actuelles pour le projet lauréat avec :
            | type GF         | <type GF>         |
            | date d'échéance | <date d'échéance> |
        Alors les garanties financières actuelles devraient être consultables pour le projet lauréat

        Exemples:
            | type GF                   | date d'échéance |
            | avec-date-échéance        | 2027-12-01      |
            | consignation              |                 |
            | six-mois-après-achèvement |                 |
            | garantie-bancaire         |                 |

    # Règles métier à confirmer
    @NotImplemented
    Scénario: Un porteur enregistre des garanties financières actuelles ayant initialement un statut échu
        Etant donné des garanties financières actuelles échues le "2024-07-17" pour le projet lauréat
        Quand un porteur enregistre les garanties financières actuelles pour le projet lauréat
        Alors les garanties financières actuelles devraient être consultables pour le projet lauréat

    Scénario: Une tâche du type "échoir les garanties financières" est planifiée quand des garanties financières sont enregisrées par l'administration
        Quand un porteur enregistre les garanties financières actuelles pour le projet lauréat avec :
            | type GF         | avec-date-échéance |
            | date d'échéance | 2024-12-02         |
        Alors une tâche "échoir les garanties financières" est planifiée à la date du "2024-12-03" pour le projet "Du boulodrome de Marseille"

    Scénario: Des tâches de la catégorie "rappel échéance garanties financières" sont planifiées à M-1 et M-2 de la date d'échéance en cas de garanties financières enregistrées
        Quand un porteur enregistre les garanties financières actuelles pour le projet lauréat avec :
            | type GF         | avec-date-échéance |
            | date d'échéance | 2024-10-01         |
        Alors une tâche "rappel échéance garanties financières à un mois" est planifiée à la date du "2024-09-01" pour le projet "Du boulodrome de Marseille"
        Et une tâche "rappel échéance garanties financières à deux mois" est planifiée à la date du "2024-08-01" pour le projet "Du boulodrome de Marseille"

    Plan du Scénario: Impossible d'enregistrer des garanties financières actuelles avec date d'échéance si le type renseigné n'est pas compatible
        Quand un porteur enregistre les garanties financières actuelles pour le projet lauréat avec :
            | type GF         | <type GF>  |
            | date d'échéance | 2027-12-01 |
        Alors l'utilisateur devrait être informé que "La date d'échéance ne peut être renseignée pour ce type de garanties financières"

        Exemples:
            | type GF                   |
            | consignation              |
            | six-mois-après-achèvement |
            | garantie-bancaire         |

    Scénario: Impossible d'enregister des garanties financières actuelles de type avec date d'échéance   si la date d'échéance est manquante
        Quand un porteur enregistre les garanties financières actuelles pour le projet lauréat avec :
            | type GF         | avec-date-échéance |
            | date d'échéance |                    |
        Alors l'utilisateur devrait être informé que "La date d'échéance des garanties financières est requise"

    Scénario: Impossible d'enregister des garanties financières actuelles si la date de constitution est dans le futur
        Quand un porteur enregistre les garanties financières actuelles pour le projet lauréat avec :
            | date de constitution | 2050-01-01 |
        Alors l'utilisateur devrait être informé que "La date de constitution des garanties financières ne peut pas être une date future"

    Scénario: Impossible d'enregister des garanties financières actuelles avec un type exemption
        Quand un porteur enregistre les garanties financières actuelles pour le projet lauréat avec :
            | type GF              | exemption  |
            | date de délibération | 2020-01-01 |
        Alors l'utilisateur devrait être informé que "Impossible d'enregistrer ou de modifier une exemption de garanties financières"

    Scénario: Impossible d'enregister des garanties financières s'il y a déjà des garanties financières actuelles
        Etant donné des garanties financières actuelles pour le projet "Du boulodrome de Marseille"
        Quand un porteur enregistre les garanties financières actuelles pour le projet lauréat
        Alors l'utilisateur devrait être informé que "Il y a déjà des garanties financières pour ce projet"
