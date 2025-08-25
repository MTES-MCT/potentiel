# language: fr
@garanties-financières
@garanties-financières-actuelles
Fonctionnalité: Échoir les garanties financières actuelles d'un projet

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offre | PPE2 - Bâtiment |
        Et la dreal "Dreal du sud" associée à la région du projet
        Et un cahier des charges permettant la modification du projet

    Scénario: Échoir les garanties financières actuelles d'un projet à J+1 après la date d'échéance
        Etant donné des garanties financières actuelles pour le projet "Du boulodrome de Marseille" avec :
            | type GF         | avec-date-échéance |
            | date d'échéance | 2024-07-17         |
        Quand un admin échoie les garanties financières actuelles pour le projet lauréat
        Alors les garanties financières actuelles du projet "Du boulodrome de Marseille" sont échues
        Et des garanties financières devraient être attendues pour le projet lauréat avec :
            | motif | échéance-garanties-financières-actuelles |
        Et une tâche indiquant de "transmettre les garanties financières" est consultable dans la liste des tâches du porteur pour le projet
        Et un email a été envoyé au porteur avec :
            | sujet         | Potentiel - Date d'échéance dépassée pour les garanties financières du projet Du boulodrome de Marseille dans le département(.*) |
            | nom_projet    | Du boulodrome de Marseille                                                                                                       |
            | date_echeance | 17/07/2024                                                                                                                       |
        Et un email a été envoyé à la dreal avec :
            | sujet         | Potentiel - Date d'échéance dépassée pour les garanties financières du projet Du boulodrome de Marseille dans le département(.*) |
            | nom_projet    | Du boulodrome de Marseille                                                                                                       |
            | date_echeance | 17/07/2024                                                                                                                       |

    Scénario: Un DGEC validateur accorde l'abandon d'un projet lauréat avec garanties financières à échoir
        Etant donné des garanties financières actuelles pour le projet "Du boulodrome de Marseille" avec :
            | type GF         | avec-date-échéance |
            | date d'échéance | 2024-07-17         |
        Et une demande d'abandon en cours pour le projet lauréat
        Quand le DGEC validateur accorde l'abandon pour le projet lauréat
        Alors l'abandon du projet lauréat devrait être accordé
        Et une tâche "échoir les garanties financières" n'est plus planifiée pour le projet lauréat

    Scénario: Un DGEC validateur accorde la demande de mainlevée d'un projet lauréat avec garanties financières à échoir
        Etant donné un abandon accordé pour le projet lauréat "Du boulodrome de Marseille"
        Etant donné des garanties financières actuelles pour le projet "Du boulodrome de Marseille" avec :
            | type GF         | avec-date-échéance |
            | date d'échéance | 2024-10-01         |
        Et une demande de mainlevée de garanties financières pour le projet "Du boulodrome de Marseille" avec :
            | motif | projet-abandonné |
        Quand un utilisateur Dreal accorde la demande de mainlevée des garanties financières du projet "Du boulodrome de Marseille"
        Alors une tâche "échoir les garanties financières" n'est plus planifiée pour le projet lauréat
        Et une tâche "rappel échéance garanties financières à un mois" n'est plus planifiée pour le projet lauréat
        Et une tâche "rappel échéance garanties financières à deux mois" n'est plus planifiée pour le projet lauréat

    @NotImplemented
    Scénario: Impossible d'échoir les garanties financières actuelles d'un projet si il n'y a pas de garanties financières actuelles pour ce projet
        Quand un admin échoie les garanties financières actuelles pour le projet lauréat avec :
            | date d'échéance | 2024-07-17 |
            | date à vérifier | 2024-07-18 |
        Alors l'utilisateur devrait être informé que "Il n'y a aucunes garanties financières actuelles pour ce projet"

    @NotImplemented
    Scénario: Impossible d'échoir les garanties financières actuelles d'un projet si la date d'échéance est dans le futur
        Etant donné des garanties financières actuelles pour le projet "Du boulodrome de Marseille" avec :
            | type GF         | avec-date-échéance |
            | date d'échéance | 2024-07-17         |
        Quand un admin échoie les garanties financières actuelles pour le projet lauréat avec :
            | date d'échéance | 2024-07-17 |
            | date à vérifier | 2024-07-16 |
        Alors l'utilisateur devrait être informé que "La date d'échéance des garanties financières n'est pas encore passée"

    @NotImplemented
    Scénario: Impossible d'échoir les garanties financières actuelles d'un projet si la vérification est le jour de la date d'échéance
        Etant donné des garanties financières actuelles pour le projet "Du boulodrome de Marseille" avec :
            | type GF         | avec-date-échéance |
            | date d'échéance | 2024-07-17         |
        Quand un admin échoie les garanties financières actuelles pour le projet lauréat avec :
            | date d'échéance | 2024-07-17 |
            | date à vérifier | 2024-07-17 |
        Alors l'utilisateur devrait être informé que "La date d'échéance des garanties financières n'est pas encore passée"

    @NotImplemented
    Scénario: Impossible d'échoir les garanties financières actuelles d'un projet si les garanties financières sont déjà échues
        Etant donné des garanties financières actuelles échues pour le projet lauréat avec :
            | type GF         | avec-date-échéance |
            | date d'échéance | 2024-07-17         |
        Quand un admin échoie les garanties financières actuelles pour le projet lauréat avec :
            | date d'échéance | 2024-07-17 |
            | date à vérifier | 2024-07-18 |
        Alors l'utilisateur devrait être informé que "Les garanties financières du projet sont déjà échues"

    @NotImplemented
    Scénario: Impossible d'échoir les garanties financières actuelles d'un projet si le projet dispose d'un dépôt de garanties financières
        Etant donné des garanties financières actuelles pour le projet lauréat avec :
            | type GF         | avec-date-échéance |
            | date d'échéance | 2024-07-17         |
        Et un dépôt de garanties financières pour le projet "Du boulodrome de Marseille"
        Quand un admin échoie les garanties financières actuelles pour le projet lauréat avec :
            | date d'échéance | 2024-07-17 |
            | date à vérifier | 2024-07-18 |
        Alors l'utilisateur devrait être informé que "Le projet dispose d'un dépôt de garanties financières en attente de validation, ce qui empêche de pouvoir échoir ses garanties financières"

    @NotImplemented
    Scénario: Impossible d'échoir les garanties financières actuelles d'un projet si le projet a transmis l'attestation de conformité
        Etant donné des garanties financières actuelles pour le projet "Du boulodrome de Marseille" avec :
            | type GF         | avec-date-échéance |
            | date d'échéance | 2024-07-17         |
        Et une attestation de conformité transmise pour le projet lauréat
        Quand un admin échoie les garanties financières actuelles pour le projet lauréat avec :
            | date d'échéance | 2024-07-17 |
            | date à vérifier | 2024-07-18 |
        Alors l'utilisateur devrait être informé que "Le projet dispose d'une attestation de conformité, ce qui empêche de pouvoir échoir ses garanties financières"

    # Ce cas ne peut pas être implémenté à date car nous n'avons pas accès à l'aggréagat candidature (projet)
    @NotImplemented
    Scénario: Impossible d'échoir les garanties financières actuelles d'un projet abandonné


    # Ce cas ne peut pas être implémenté à date car nous n'avons pas accès à l'aggréagat candidature (projet)
    @NotImplemented
    Scénario: Impossible d'échoir les garanties financières actuelles d'un projet éliminé

