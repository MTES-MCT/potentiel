# language: fr
@achèvement
Fonctionnalité: Transmettre la date d'achèvement

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | date notification | 2024-01-01 |
        Et un cahier des charges permettant la modification du projet
        Et la dreal "Dreal du sud" associée à la région du projet

    Scénario: le co-contractant transmet la date d'achèvement pour le projet lauréat
        Quand le co-contractant transmet la date d'achèvement "2025-11-14" pour le projet lauréat
        Alors la date d'achèvement devrait être consultable pour le projet lauréat
        Et le statut du projet lauréat devrait être "achevé"
        Et un email a été envoyé à la dreal avec :
            | sujet      | Potentiel - Transmission de la date d'achèvement du projet Du boulodrome de Marseille dans le département (.*) |
            | nom_projet | Du boulodrome de Marseille                                                                                     |
            | url        | https://potentiel.beta.gouv.fr/projets/.*                                                                      |
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - Transmission de la date d'achèvement du projet Du boulodrome de Marseille dans le département (.*) |
            | nom_projet | Du boulodrome de Marseille                                                                                     |
            | url        | https://potentiel.beta.gouv.fr/projets/.*                                                                      |

    Scénario: les tâches planifiées de rappel d'échéance du projet sont annulées quand la date d'achèvement est transmise pour un projet de l'appel d'offres Petit PV
        Etant donné le projet lauréat "Du boulodrome de Rennes" avec :
            | appel d'offres    | PPE2 - Petit PV Bâtiment |
            | période           | 1                        |
            | date notification | 2024-01-01               |
        Quand le co-contractant transmet la date d'achèvement "2024-11-01" pour le projet lauréat
        Alors il n'y a pas de tâche "rappel échéance achèvement à trois mois" planifiée pour le projet lauréat
        Et il n'y a pas de tâche "rappel échéance achèvement à deux mois" planifiée pour le projet lauréat
        Et il n'y a pas de tâche "rappel échéance achèvement à un mois" planifiée pour le projet lauréat

    Scénario: la tâche planifiée "échoir les garanties financières" est annulée quand la date d'achèvement est transmise
        Etant donné des garanties financières actuelles pour le projet lauréat avec :
            | type GF            | avec-date-échéance |
            | date d'échéance    | 2050-12-01         |
            | date de validation | 2024-11-24         |
        Quand le co-contractant transmet la date d'achèvement "2024-11-01" pour le projet lauréat
        Alors il n'y a pas de tâche "échoir les garanties financières" planifiée pour le projet lauréat

    Scénario: les tâches planifiées "rappel échéance garanties financières à * mois" sont annulées quand la date d'achèvement est transmise
        Etant donné des garanties financières actuelles pour le projet lauréat avec :
            | type GF            | avec-date-échéance |
            | date d'échéance    | 2050-12-01         |
            | date de validation | 2024-11-24         |
        Quand le co-contractant transmet la date d'achèvement "2024-11-01" pour le projet lauréat
        Alors il n'y a pas de tâche "rappel échéance garanties financières à un mois" planifiée pour le projet lauréat
        Alors il n'y a pas de tâche "rappel échéance garanties financières à deux mois" planifiée pour le projet lauréat
        Alors il n'y a pas de tâche "rappel échéance garanties financières à trois mois" planifiée pour le projet lauréat

    Scénario: les tâches porteur et planifiées de garanties financières en attente sont supprimées quand la date d'achèvement est transmise
        Etant donné des garanties financières en attente pour le projet lauréat
        Quand le co-contractant transmet la date d'achèvement "2024-11-01" pour le projet lauréat
        Alors une tâche indiquant de 'transmettre les garanties financières' n'est plus consultable dans la liste des tâches du porteur pour le projet
        Et il n'y a pas de tâche "rappel des garanties financières à transmettre" planifiée pour le projet lauréat

    Scénario: Impossible de transmettre une date d'achèvement pour un projet lauréat inexistant
        Etant donné le projet éliminé "Du boulodrome de Lyon"
        Quand le co-contractant transmet la date d'achèvement "2025-11-14" pour le projet éliminé
        Alors l'utilisateur devrait être informé que "Le projet lauréat n'existe pas"

    Scénario: Impossible de transmettre une date d'achèvement antérieure à la date de désignation du projet
        Quand le co-contractant transmet la date d'achèvement "2023-01-01" pour le projet lauréat
        Alors l'utilisateur devrait être informé que "La date d'achèvement ne peut pas être antérieure à la date de notification du projet"

    Scénario: Impossible de transmettre une date d'achèvement future
        Quand le co-contractant transmet la date d'achèvement "2050-09-01" pour le projet lauréat
        Alors l'utilisateur devrait être informé que "La date d'achèvement ne peut pas être dans le futur"

    Scénario: Impossible de transmettre une date d'achèvement pour un projet déjà achevé
        Etant donné une attestation de conformité transmise pour le projet lauréat
        Quand le co-contractant transmet la date d'achèvement "2025-11-14" pour le projet lauréat
        Alors l'utilisateur devrait être informé que "Le projet est déjà achevé"

    Scénario: Impossible de transmettre une date d'achèvement pour un projet abandonné
        Etant donné une demande d'abandon accordée pour le projet lauréat
        Quand le co-contractant transmet la date d'achèvement "2025-11-14" pour le projet lauréat
        Alors l'utilisateur devrait être informé que "Le projet est abandonné"
