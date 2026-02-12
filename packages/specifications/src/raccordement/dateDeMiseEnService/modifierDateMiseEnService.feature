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
        Quand l'administrateur transmet la date de mise en service pour le dossier de raccordement du projet lauréat avec :
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
        Quand l'administrateur transmet la date de mise en service pour le dossier de raccordement du projet lauréat avec :
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
        Quand l'administrateur transmet la date de mise en service pour le dossier de raccordement du projet lauréat avec :
            | La référence du dossier de raccordement | OUE-RP-2022-000033 |
            | La date de mise en service              | 2025-01-01         |
        Alors le raccordement du projet lauréat devrait être en service avec :
            | La référence du dossier de raccordement | OUE-RP-2022-000033 |
            | La date de mise en service              | 2025-01-01         |
