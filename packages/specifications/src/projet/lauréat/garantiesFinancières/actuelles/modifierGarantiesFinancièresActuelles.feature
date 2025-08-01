# language: fr
@garanties-financières
@garanties-financières-actuelles
Fonctionnalité: Modifier des garanties financières actuelles

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et un cahier des charges permettant la modification du projet

    Plan du Scénario: Un admin modifie des garanties financières actuelles
        Quand un admin modifie les garanties financières actuelles du projet lauréat avec :
            | type GF         | <type GF>         |
            | date d'échéance | <date d'échéance> |
        Alors les garanties financières actuelles devraient être consultables pour le projet lauréat

        Exemples:
            | type GF                   | date d'échéance |
            | avec-date-échéance        | 2027-12-01      |
            | consignation              |                 |
            | six-mois-après-achèvement |                 |

    Scénario: Une tâche du type "échoir les garanties financières" est replanifiée quand la date d'échéance des garanties financières est modifiée
        Etant donné des garanties financières actuelles pour le projet "Du boulodrome de Marseille" avec :
            | type GF            | avec-date-échéance |
            | date d'échéance    | 2024-12-01         |
            | date de validation | 2024-11-24         |
        Quand un admin modifie les garanties financières actuelles du projet lauréat avec :
            | type GF         | avec-date-échéance |
            | date d'échéance | 2024-12-02         |
        Alors une tâche "échoir les garanties financières" est planifiée à la date du "2024-12-03" pour le projet "Du boulodrome de Marseille"

    Scénario: Des tâches de la catégorie "rappel échéance garanties financières" sont planifiées à M-1 et M-2 de la date d'échéance en cas de garanties financières actuelles modifiées
        Etant donné des garanties financières actuelles pour le projet "Du boulodrome de Marseille" avec :
            | type GF         | avec-date-échéance |
            | date d'échéance | 2024-08-01         |
        Quand un admin modifie les garanties financières actuelles du projet lauréat avec :
            | type GF         | avec-date-échéance |
            | date d'échéance | 2024-10-01         |
        Alors une tâche "rappel échéance garanties financières à un mois" est planifiée à la date du "2024-09-01" pour le projet "Du boulodrome de Marseille"
        Et une tâche "rappel échéance garanties financières à deux mois" est planifiée à la date du "2024-08-01" pour le projet "Du boulodrome de Marseille"

    Plan du Scénario: Impossible de modifier des garanties financières actuelles si le type renseigné n'est pas compatible avec une date d'échéance
        Etant donné des garanties financières actuelles pour le projet "Du boulodrome de Marseille" avec :
            | type GF | type-inconnu |
        Quand un admin modifie les garanties financières actuelles du projet lauréat avec :
            | type GF         | <type GF>         |
            | date d'échéance | <date d'échéance> |
        Alors l'utilisateur devrait être informé que "La date d'échéance ne peut être renseignée pour ce type de garanties financières"

        Exemples:
            | type GF                   | date d'échéance |
            | consignation              | 2027-12-01      |
            | six-mois-après-achèvement | 2027-12-01      |

    Scénario: Impossible de modifier des garanties financières actuelles si la date d'échéance est manquante
        Etant donné des garanties financières actuelles pour le projet "Du boulodrome de Marseille" avec :
            | type GF | type-inconnu |
        Quand un admin modifie les garanties financières actuelles du projet lauréat avec :
            | type GF         | avec-date-échéance |
            | date d'échéance |                    |
        Alors l'utilisateur devrait être informé que "La date d'échéance des garanties financières est requise"

    Scénario: Impossible de modifier des garanties financières actuelles si la date de constitution est dans le futur
        Etant donné des garanties financières actuelles pour le projet "Du boulodrome de Marseille" avec :
            | type GF | type-inconnu |
        Quand un admin modifie les garanties financières actuelles du projet lauréat avec :
            | date de constitution | 2050-01-01 |
        Alors l'utilisateur devrait être informé que "La date de constitution des garanties financières ne peut pas être une date future"

    Scénario: Impossible de modifier des garanties financières actuelles si aucunes garanties financières actuelles ne sont trouvées
        Etant donné le projet lauréat sans garanties financières importées "Du boulodrome de Lyon"
        Quand un admin modifie les garanties financières actuelles du projet lauréat
        Alors l'utilisateur devrait être informé que "Il n'y a aucunes garanties financières actuelles pour ce projet"

    Scénario: Impossible de modifier des garanties financières actuelles si les garanties financières du projet sont levées
        Etant donné une attestation de conformité transmise pour le projet lauréat
        Et des garanties financières actuelles pour le projet "Du boulodrome de Marseille"
        Et une demande de mainlevée de garanties financières accordée pour le projet "Du boulodrome de Marseille" achevé
        Quand un admin modifie les garanties financières actuelles du projet lauréat avec :
            | date de constitution | 2020-01-01 |
        Alors l'utilisateur devrait être informé que "Vous ne pouvez pas déposer ou modifier des garanties financières car elles ont déjà été levées pour ce projet"

    Scénario: Une tâche du type "échoir les garanties financières" n'est pas ajoutée si une attestation de conformité est déjà transmise
        Etant donné des garanties financières actuelles pour le projet "Du boulodrome de Marseille" avec :
            | type GF            | avec-date-échéance |
            | date d'échéance    | 2024-12-01         |
            | date de validation | 2024-11-24         |
        Et une attestation de conformité transmise pour le projet lauréat
        Quand un admin modifie les garanties financières actuelles du projet lauréat avec :
            | type GF         | avec-date-échéance |
            | date d'échéance | 2024-12-02         |
        Alors une tâche "échoir les garanties financières" n'est plus planifiée pour le projet lauréat

    Scénario: Impossible de modifier des garanties financières actuelles si le projet en est exempt
        Etant donné le projet lauréat "Du boulodrome de Toulouse" avec :
            | appel d'offre        | PPE2 - Petit PV Bâtiment |
            | type GF              | exemption                |
            | date de délibération | 2023-01-02               |
        Quand un admin modifie les garanties financières actuelles du projet lauréat avec :
            | type GF | consignation |
        Alors l'utilisateur devrait être informé que "Vous ne pouvez pas déposer ou modifier des garanties financières car ce projet en est exempt"
