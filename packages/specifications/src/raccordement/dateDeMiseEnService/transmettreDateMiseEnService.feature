# language: fr
@raccordement
@date-mise-en-service
Fonctionnalité: Transmettre une date de mise en service pour une demande complète de raccordement

    Contexte:
        Etant donné le gestionnaire de réseau "Enedis"
        Et le projet lauréat "Du boulodrome de Marseille" avec :
            | date notification | 2021-01-01 |
        Et le gestionnaire de réseau "Enedis" attribué au raccordement du projet lauréat

    @NotImplemented
    Plan du scénario: Transmettre une date de mise en service pour un dossier de raccordement
        Etant donné une demande complète de raccordement pour le projet lauréat
        Quand <role> transmet la date de mise en service pour le dossier de raccordement du projet lauréat
        Alors la date de mise en service devrait être consultable dans le dossier de raccordement du projet lauréat
        Et le raccordement du projet lauréat devrait être en service pour le projet lauréat

        Exemples:
            | role                      |
            | le gestionnaire de réseau |
            | l'administrateur          |

    @NotImplemented
    Plan du scénario: Transmettre une date de mise en service pour un dossier de raccordement 2
        Etant donné une demande complète de raccordement pour le projet lauréat avec :
            | La référence du dossier de raccordement | OUE-RP-2022-000030 |
        Quand <role> transmet la date de mise en service pour le dossier de raccordement du projet lauréat avec :
            | La date de mise en service | 2022-03-27 |
        Alors la date de mise en service devrait être consultable dans le dossier de raccordement du projet lauréat
        Et le raccordement du projet lauréat devrait être en service avec :
            | La date de mise en service              | 2022-03-27         |
            | La référence du dossier de raccordement | OUE-RP-2022-000030 |

        Exemples:
            | role                      |
            | le gestionnaire de réseau |
            | l'administrateur          |

    @NotImplemented
    Plan du scénario: Transmettre une date de mise en service moins tardive que celles des autres dossiers en service d'un projet lauréat
        Etant donné une demande complète de raccordement pour le projet lauréat avec :
            | La référence du dossier de raccordement | OUE-RP-2022-000031 |
        Et une date de mise en service pour le dossier de raccordement du projet lauréat avec :
            | La référence du dossier de raccordement | OUE-RP-2022-000031 |
            | La date de mise en service              | 2027-01-01         |
        Et une demande complète de raccordement pour le projet lauréat avec :
            | La référence du dossier de raccordement | OUE-RP-2022-000032 |
        Quand <role> transmet la date de mise en service pour le dossier de raccordement du projet lauréat avec :
            | La date de mise en service              | 2024-10-10         |
            | La référence du dossier de raccordement | OUE-RP-2022-000032 |
        Alors la date de mise en service devrait être consultable dans le dossier de raccordement du projet lauréat
        Et le raccordement du projet lauréat devrait être en service avec :
            | La date de mise en service              | 2027-01-01         |
            | La référence du dossier de raccordement | OUE-RP-2022-000031 |

    @NotImplemented
    Plan du scénario: Transmettre une date de mise en service plus tardive que celles des autres dossiers en service d'un projet lauréat
        Etant donné une demande complète de raccordement pour le projet lauréat avec :
            | La référence du dossier de raccordement | OUE-RP-2022-000033 |
        Et une date de mise en service pour le dossier de raccordement du projet lauréat avec :
            | La référence du dossier de raccordement | OUE-RP-2022-000033 |
            | La date de mise en service              | 2022-03-27         |
        Et une demande complète de raccordement pour le projet lauréat avec :
            | La référence du dossier de raccordement | OUE-RP-2022-00034 |
        Quand <role> transmet la date de mise en service pour le dossier de raccordement du projet lauréat avec :
            | La date de mise en service              | 2024-10-10        |
            | La référence du dossier de raccordement | OUE-RP-2022-00034 |
        Alors la date de mise en service devrait être consultable dans le dossier de raccordement du projet lauréat
        Et le raccordement du projet lauréat devrait être en service avec :
            | La date de mise en service              | 2024-10-10        |
            | La référence du dossier de raccordement | OUE-RP-2022-00034 |

    Scénario: Impossible de transmettre une date de mise en service pour un projet sans dossier de raccordement
        Quand le gestionnaire de réseau transmet la date de mise en service pour le dossier de raccordement du projet lauréat avec :
            | La référence du dossier de raccordement | OUE-RP-2022-000040 |
        Alors le gestionnaire de réseau devrait être informé que "Le dossier n'est pas référencé dans le raccordement de ce projet"

    Scénario: Impossible de transmettre une date de mise en service pour un dossier n'étant pas référencé dans le raccordement du projet
        Etant donné une demande complète de raccordement pour le projet lauréat avec :
            | La référence du dossier de raccordement | OUE-RP-2022-000056 |
        Quand le gestionnaire de réseau transmet la date de mise en service pour le dossier de raccordement du projet lauréat avec :
            | La référence du dossier de raccordement | OUE-RP-2022-000057 |
        Alors le gestionnaire de réseau devrait être informé que "Le dossier n'est pas référencé dans le raccordement de ce projet"

    Scénario: Impossible de transmettre une date de mise en service dans le futur
        Etant donné une demande complète de raccordement pour le projet lauréat
        Quand le gestionnaire de réseau transmet la date de mise en service pour le dossier de raccordement du projet lauréat avec :
            | La date de mise en service | 2999-03-27 |
        Alors le gestionnaire de réseau devrait être informé que "La date ne peut pas être une date future"

    Scénario: Impossible de transmettre une date de mise en service antérieure à la date de notification du projet
        Etant donné le projet lauréat "Du boulodrome de Lille" avec :
            | date notification | 2022-10-26 |
        Et une demande complète de raccordement pour le projet lauréat
        Quand le gestionnaire de réseau transmet la date de mise en service pour le dossier de raccordement du projet lauréat avec :
            | La date de mise en service | 2021-12-31 |
        Alors le gestionnaire de réseau devrait être informé que "La date de mise en service ne peut pas être antérieure à la date de désignation du projet"

    Scénario: Impossible de transmettre une date de mise en service plus d'une fois
        Etant donné le projet lauréat "Du boulodrome de Lille" avec :
            | date notification | 2021-10-26 |
        Etant donné une demande complète de raccordement pour le projet lauréat
        Quand le gestionnaire de réseau transmet la date de mise en service pour le dossier de raccordement du projet lauréat avec :
            | La date de mise en service | 2021-12-31 |
        Et le gestionnaire de réseau transmet la date de mise en service pour le dossier de raccordement du projet lauréat avec :
            | La date de mise en service | 2021-12-31 |
        Alors le gestionnaire de réseau devrait être informé que "La date de mise en service est déjà transmise pour ce dossier de raccordement"
