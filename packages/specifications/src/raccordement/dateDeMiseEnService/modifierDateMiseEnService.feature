# language: fr
@raccordement
@date-mise-en-service
Fonctionnalité: Modifier une date de mise en service pour un dossier de raccordement

    Contexte:
        Etant donné le gestionnaire de réseau "Enedis"
        Et le projet lauréat "Du boulodrome de Marseille" avec :
            | date notification | 2021-01-01 |
        Et le gestionnaire de réseau "Enedis" attribué au raccordement du projet lauréat

    # 1 seul dossier
    Scénario: Modifier une date de mise en service sur le même dossier d'un projet lauréat
        Etant donné une demande complète de raccordement pour le projet lauréat avec :
            | La référence du dossier de raccordement | OUE-RP-2022-000031 |
        Et une date de mise en service pour le dossier de raccordement du projet lauréat avec :
            | La référence du dossier de raccordement | OUE-RP-2022-000031 |
            | La date de mise en service              | 2025-01-01         |
        Quand l'administrateur modifie la date de mise en service pour le dossier de raccordement du projet lauréat avec :
            | La référence du dossier de raccordement | OUE-RP-2022-000031 |
            | La date de mise en service              | 2024-10-10         |
        Alors la date de mise en service devrait être consultable dans le dossier de raccordement du projet lauréat
        Et le raccordement du projet lauréat devrait être en service avec :
            | La référence du dossier de raccordement | OUE-RP-2022-000031 |
            | La date de mise en service              | 2024-10-10         |

    # Plusieurs dossiers
    Scénario: Modifier une date d'un dossier (initialement la date la plus tardive) avec une date moins tardive que celle des autres dossiers doit recalculer la mise en service du raccordement du projet lauréat
        Etant donné une demande complète de raccordement pour le projet lauréat avec :
            | La référence du dossier de raccordement | OUE-RP-2022-000033 |
        Et une date de mise en service pour le dossier de raccordement du projet lauréat avec :
            | La référence du dossier de raccordement | OUE-RP-2022-000033 |
            | La date de mise en service              | 2024-01-01         |
        Et une demande complète de raccordement pour le projet lauréat avec :
            | La référence du dossier de raccordement | OUE-RP-2022-000034 |
        Et une date de mise en service pour le dossier de raccordement du projet lauréat avec :
            | La référence du dossier de raccordement | OUE-RP-2022-000034 |
            | La date de mise en service              | 2023-01-01         |
        Quand l'administrateur modifie la date de mise en service pour le dossier de raccordement du projet lauréat avec :
            | La référence du dossier de raccordement | OUE-RP-2022-000033 |
            | La date de mise en service              | 2022-01-01         |
        Alors le raccordement du projet lauréat devrait être en service avec :
            | La référence du dossier de raccordement | OUE-RP-2022-000034 |
            | La date de mise en service              | 2023-01-01         |

    Scénario: Modifier une date d'un dossier avec une date plus tardive que celle des autres dossiers doit recalculer la mise en service du raccordement du projet lauréat
        Etant donné une demande complète de raccordement pour le projet lauréat avec :
            | La référence du dossier de raccordement | OUE-RP-2022-000033 |
        Et une date de mise en service pour le dossier de raccordement du projet lauréat avec :
            | La référence du dossier de raccordement | OUE-RP-2022-000033 |
            | La date de mise en service              | 2024-01-01         |
        Et une demande complète de raccordement pour le projet lauréat avec :
            | La référence du dossier de raccordement | OUE-RP-2022-000034 |
        Et une date de mise en service pour le dossier de raccordement du projet lauréat avec :
            | La référence du dossier de raccordement | OUE-RP-2022-000034 |
            | La date de mise en service              | 2022-01-01         |
        Quand l'administrateur modifie la date de mise en service pour le dossier de raccordement du projet lauréat avec :
            | La référence du dossier de raccordement | OUE-RP-2022-000033 |
            | La date de mise en service              | 2025-01-01         |
        Alors le raccordement du projet lauréat devrait être en service avec :
            | La référence du dossier de raccordement | OUE-RP-2022-000033 |
            | La date de mise en service              | 2025-01-01         |

    Scénario: Impossible de modifier une date de mise en service pour un projet sans dossier de raccordement
        Quand l'administrateur modifie la date de mise en service pour le dossier de raccordement du projet lauréat avec :
            | La référence du dossier de raccordement | OUE-RP-2022-000040 |
        Alors l'administrateur devrait être informé que "Le dossier n'est pas référencé dans le raccordement de ce projet"

    Scénario: Impossible de modifier une date de mise en service pour un dossier n'étant pas référencé dans le raccordement du projet
        Etant donné une demande complète de raccordement pour le projet lauréat avec :
            | La référence du dossier de raccordement | OUE-RP-2022-000056 |
        Quand l'administrateur modifie la date de mise en service pour le dossier de raccordement du projet lauréat avec :
            | La référence du dossier de raccordement | OUE-RP-2022-000057 |
            | La date de mise en service              | 2022-01-01         |
        Alors l'administrateur devrait être informé que "Le dossier n'est pas référencé dans le raccordement de ce projet"

    Scénario: Impossible de modifier une date de mise en service dans le futur
        Etant donné une demande complète de raccordement pour le projet lauréat
        Quand l'administrateur modifie la date de mise en service pour le dossier de raccordement du projet lauréat avec :
            | La date de mise en service | 2999-03-27 |
        Alors l'administrateur devrait être informé que "La date ne peut pas être une date future"

    Scénario: Impossible de modifier une date de mise en service antérieure à la date de notification du projet
        Etant donné le projet lauréat "Du boulodrome de Lille" avec :
            | date notification | 2022-10-26 |
        Et une demande complète de raccordement pour le projet lauréat
        Quand l'administrateur modifie la date de mise en service pour le dossier de raccordement du projet lauréat avec :
            | La date de mise en service | 2021-12-31 |
        Alors l'administrateur devrait être informé que "La date de mise en service ne peut pas être antérieure à la date de désignation du projet"
