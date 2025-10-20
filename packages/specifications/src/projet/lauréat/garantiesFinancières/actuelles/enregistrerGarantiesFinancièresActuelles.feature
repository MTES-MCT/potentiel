# language: fr
@garanties-financières
@garanties-financières-actuelles
Fonctionnalité: Enregistrer des garanties financières actuelles

    Contexte:
        Etant donné le projet lauréat sans garanties financières importées "Du boulodrome de Marseille"
        Et la dreal "Dreal du sud" associée à la région du projet

    Plan du Scénario: La Dreal enregistre des garanties financières actuelles pour un projet ayant des garanties financières en attente
        Etant donné des garanties financières en attente pour le projet lauréat
        Quand la DREAL enregistre les garanties financières actuelles pour le projet lauréat avec :
            | type GF         | <type GF>         |
            | date d'échéance | <date d'échéance> |
        Alors les garanties financières actuelles devraient être consultables pour le projet lauréat
        Et les garanties financières en attente du projet ne devraient plus être consultables
        Et une tâche "rappel des garanties financières à transmettre" n'est plus planifiée pour le projet lauréat

        Exemples:
            | type GF                   | date d'échéance |
            | avec-date-échéance        | 2027-12-01      |
            | consignation              |                 |
            | six-mois-après-achèvement |                 |

    Plan du Scénario: La DREAL enregistre des garanties financières actuelles
        Quand la DREAL enregistre les garanties financières actuelles pour le projet lauréat avec :
            | type GF         | <type GF>         |
            | date d'échéance | <date d'échéance> |
        Alors les garanties financières actuelles devraient être consultables pour le projet lauréat

        Exemples:
            | type GF                   | date d'échéance |
            | avec-date-échéance        | 2027-12-01      |
            | consignation              |                 |
            | six-mois-après-achèvement |                 |

    Scénario: La DREAL enregistre des garanties financières actuelles ayant initialement un statut échu
        Quand la DREAL enregistre les garanties financières actuelles pour le projet lauréat avec :
            | type GF         | avec-date-échéance |
            | date d'échéance | 2024-12-02         |
        Alors les garanties financières actuelles devraient être consultables pour le projet lauréat
        Et les garanties financières actuelles du projet sont échues
        Et des garanties financières devraient être attendues pour le projet lauréat avec :
            | motif | échéance-garanties-financières-actuelles |
        Et une tâche "rappel des garanties financières à transmettre" est planifiée pour le projet lauréat

    Scénario: Une tâche du type "échoir les garanties financières" est planifiée quand des garanties financières sont enregisrées par l'administration
        Quand la DREAL enregistre les garanties financières actuelles pour le projet lauréat avec :
            | type GF         | avec-date-échéance |
            | date d'échéance | 2050-12-02         |
        Alors une tâche "échoir les garanties financières" est planifiée à la date du "2050-12-03" pour le projet lauréat

    Scénario: Des tâches de la catégorie "rappel échéance garanties financières" sont planifiées à M-1 et M-3 de la date d'échéance en cas de garanties financières enregistrées
        Quand la DREAL enregistre les garanties financières actuelles pour le projet lauréat avec :
            | type GF         | avec-date-échéance |
            | date d'échéance | 2050-10-01         |
        Alors une tâche "rappel échéance garanties financières à un mois" est planifiée à la date du "2050-09-01" pour le projet lauréat
        Et une tâche "rappel échéance garanties financières à trois mois" est planifiée à la date du "2050-07-01" pour le projet lauréat

    Scénario: Enregister des garanties financières actuelles avec un type exemption
        Etant donné le projet éliminé "Du Boulodrome de Toulouse" avec :
            | appel d'offres | PPE2 - Petit PV Bâtiment |
        Et un recours accordé pour le projet éliminé
        Quand la DREAL enregistre les garanties financières actuelles pour le projet lauréat avec :
            | type GF | exemption |
        Alors les garanties financières actuelles devraient être consultables pour le projet lauréat

    Plan du Scénario: Impossible d'enregistrer des garanties financières actuelles avec date d'échéance si le type renseigné n'est pas compatible
        Quand la DREAL enregistre les garanties financières actuelles pour le projet lauréat avec :
            | type GF         | <type GF>  |
            | date d'échéance | 2027-12-01 |
        Alors l'utilisateur devrait être informé que "La date d'échéance ne peut être renseignée pour ce type de garanties financières"

        Exemples:
            | type GF                   |
            | consignation              |
            | six-mois-après-achèvement |

    Scénario: Impossible d'enregister des garanties financières actuelles de type avec date d'échéance si la date d'échéance est manquante
        Quand la DREAL enregistre les garanties financières actuelles pour le projet lauréat avec :
            | type GF         | avec-date-échéance |
            | date d'échéance |                    |
        Alors l'utilisateur devrait être informé que "La date d'échéance des garanties financières est requise"

    Scénario: Impossible d'enregister des garanties financières actuelles si la date de constitution est dans le futur
        Quand la DREAL enregistre les garanties financières actuelles pour le projet lauréat avec :
            | date de constitution | 2050-01-01 |
        Alors l'utilisateur devrait être informé que "La date de prise d'effet des garanties financières ne peut pas être une date future"

    Scénario: Impossible d'enregister des garanties financières s'il y a déjà des garanties financières actuelles
        Etant donné des garanties financières actuelles pour le projet lauréat
        Quand la DREAL enregistre les garanties financières actuelles pour le projet lauréat
        Alors l'utilisateur devrait être informé que "Il y a déjà des garanties financières pour ce projet"

    Scénario: Impossible d'enregistrer des garanties financières avec un type non disponible pour l'appel d'offre
        Etant donné le projet éliminé "Du Boulodrome de Toulouse" avec :
            | appel d'offres | PPE2 - Petit PV Bâtiment |
        Et un recours accordé pour le projet éliminé
        Quand la DREAL enregistre les garanties financières actuelles pour le projet lauréat avec :
            | type GF | six-mois-après-achèvement |
        Alors l'utilisateur devrait être informé que "Ce type de garanties financières n'est pas disponible pour cet appel d'offres"
