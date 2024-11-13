# language: fr
Fonctionnalité: Échoir les garanties financières actuelles d'un projet

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et le porteur "Marcel Patoulatchi" ayant accés au projet lauréat "Du boulodrome de Marseille"

    @select
    Scénario: Échoir les garanties financières actuelles d'un projet à J+1 après la date d'échéance
        Etant donné des garanties financières actuelles pour le projet "Du boulodrome de Marseille" avec :
            | type            | avec-date-échéance |
            | date d'échéance | 2024-07-17         |
        Quand un admin échoie les garanties financières actuelles pour le projet "Du boulodrome de Marseille" avec :
            | à échoir le | 2024-07-18 |
        Alors les garanties financières actuelles du projet "Du boulodrome de Marseille" sont échues
        Et un email a été envoyé au porteur avec :
            | sujet              | Potentiel - Date d'échéance dépassée pour les garanties financières du projet Du boulodrome de Marseille dans le département departementProjet |
            | nom_projet         | Du boulodrome de Marseille                                                                                                                     |
            | departement_projet | departementProjet                                                                                                                              |
            | region_projet      | regionProjet                                                                                                                                   |
            | date_echeance      | 17/07/2024                                                                                                                                     |

    @NotImplemented
    Scénario: Impossible d'échoir les garanties financières actuelles d'un projet si il n'y a pas de garanties financières actuelles pour ce projet
        Quand un admin échoie les garanties financières actuelles pour le projet "Du boulodrome de Marseille" avec :
            | date d'échéance | 2024-07-17 |
            | date à vérifier | 2024-07-18 |
        Alors l'utilisateur devrait être informé que "Il n'y a aucunes garanties financières actuelles pour ce projet"

    @NotImplemented
    Scénario: Impossible d'échoir les garanties financières actuelles d'un projet si la date d'échéance est dans le futur
        Etant donné des garanties financières actuelles pour le projet "Du boulodrome de Marseille" avec :
            | type            | avec-date-échéance |
            | date d'échéance | 2024-07-17         |
        Quand un admin échoie les garanties financières actuelles pour le projet "Du boulodrome de Marseille" avec :
            | date d'échéance | 2024-07-17 |
            | date à vérifier | 2024-07-16 |
        Alors l'utilisateur devrait être informé que "La date d'échéance des garanties financières n'est pas encore passée"

    @NotImplemented
    Scénario: Impossible d'échoir les garanties financières actuelles d'un projet si la vérification est le jour de la date d'échéance
        Etant donné des garanties financières actuelles pour le projet "Du boulodrome de Marseille" avec :
            | type            | avec-date-échéance |
            | date d'échéance | 2024-07-17         |
        Quand un admin échoie les garanties financières actuelles pour le projet "Du boulodrome de Marseille" avec :
            | date d'échéance | 2024-07-17 |
            | date à vérifier | 2024-07-17 |
        Alors l'utilisateur devrait être informé que "La date d'échéance des garanties financières n'est pas encore passée"

    @NotImplemented
    Scénario: Impossible d'échoir les garanties financières actuelles d'un projet si les garanties financières sont déjà échues
        Etant donné des garanties financières actuelles échues pour le projet "Du boulodrome de Marseille" avec :
            | type            | avec-date-échéance |
            | date d'échéance | 2024-07-17         |
        Quand un admin échoie les garanties financières actuelles pour le projet "Du boulodrome de Marseille" avec :
            | date d'échéance | 2024-07-17 |
            | date à vérifier | 2024-07-18 |
        Alors l'utilisateur devrait être informé que "Les garanties financières du projet sont déjà échues"

    @NotImplemented
    Scénario: Impossible d'échoir les garanties financières actuelles d'un projet si le projet dispose d'un dépôt de garanties financières
        Etant donné des garanties financières actuelles pour le projet "Du boulodrome de Marseille" avec :
            | type            | avec-date-échéance |
            | date d'échéance | 2024-07-17         |
        Et un dépôt de garanties financières pour le projet "Du boulodrome de Marseille"
        Quand un admin échoie les garanties financières actuelles pour le projet "Du boulodrome de Marseille" avec :
            | date d'échéance | 2024-07-17 |
            | date à vérifier | 2024-07-18 |
        Alors l'utilisateur devrait être informé que "Le projet dispose d'un dépôt de garanties financières en attente de validation, ce qui empêche de pouvoir échoir ses garanties financières"

    @NotImplemented
    Scénario: Impossible d'échoir les garanties financières actuelles d'un projet si le projet a transmis l'attestation de conformité
        Etant donné des garanties financières actuelles pour le projet "Du boulodrome de Marseille" avec :
            | type            | avec-date-échéance |
            | date d'échéance | 2024-07-17         |
        Et une attestation de conformité transmise pour le projet "Du boulodrome de Marseille"
        Quand un admin échoie les garanties financières actuelles pour le projet "Du boulodrome de Marseille" avec :
            | date d'échéance | 2024-07-17 |
            | date à vérifier | 2024-07-18 |
        Alors l'utilisateur devrait être informé que "Le projet dispose d'une attestation de conformité, ce qui empêche de pouvoir échoir ses garanties financières"

    # Ce cas ne peut pas être implémenté à date car nous n'avons pas accès à l'aggréagat candidature (projet)
    @NotImplemented
    Scénario: Impossible d'échoir les garanties financières actuelles d'un projet abandonné


    # Ce cas ne peut pas être implémenté à date car nous n'avons pas accès à l'aggréagat candidature (projet)
    @NotImplemented
    Scénario: Impossible d'échoir les garanties financières actuelles d'un projet éliminé

