# language: fr
@raccordement
@date-mise-en-service
Fonctionnalité: Supprimer le raccordement d'un projet

    Contexte:
        Etant donné le gestionnaire de réseau "Arc Energies Maurienne"
        Et le référentiel ORE
        Et le projet lauréat "Du boulodrome de Marseille"
        Et un cahier des charges permettant la modification du projet

    @NotImplemented
    Scénario: Le gestionnaire de réseau supprime la mise en service du dossier de raccordement
        Etant donné une demande complète de raccordement pour le projet lauréat
        Et une proposition technique et financière pour le projet lauréat
        Et une date de mise en service pour le dossier de raccordement du projet lauréat
        Quand le gestionnaire de réseau supprime la mise en service du dossier de raccordement
        Alors la mise en service du dossier de raccordement devrait être supprimée
        Et il ne devrait pas y avoir de mise en service dans le raccordement du projet lauréat

    @NotImplemented
    Scénario: Le Gestionnaire de réseau supprime la mise en service d'un dossier de raccordement alors que le projet dispose de plusieurs dossiers en service
        Etant donné une demande complète de raccordement pour le projet lauréat avec :
            | La référence du dossier de raccordement | OUE-RP-2022-000031 |
        Et une date de mise en service pour le dossier de raccordement du projet lauréat avec :
            | La référence du dossier de raccordement | OUE-RP-2022-000031 |
            | La date de mise en service              | 2025-01-01         |
        Et une demande complète de raccordement pour le projet lauréat avec :
            | La référence du dossier de raccordement | OUE-RP-2022-000032 |
        Et une date de mise en service pour le dossier de raccordement du projet lauréat avec :
            | La référence du dossier de raccordement | OUE-RP-2022-000032 |
            | La date de mise en service              | 2024-10-10         |
        Quand le gestionnaire de réseau supprime la mise en service du dossier de raccordement pour le projet lauréat avec :
            | La référence du dossier de raccordement | OUE-RP-2022-000031 |
        Alors la mise en service du dossier de raccordement devrait être supprimée avec :
            | La référence du dossier de raccordement | OUE-RP-2022-000031 |
        Et le raccordement du projet lauréat devrait être en service avec :
            | La référence du dossier de raccordement | OUE-RP-2022-000032 |
            | La date de mise en service              | 2024-10-10         |

        Et le dossier de raccordement avec la référence "OUE-RP-2022-000031" devrait être le seul dossier en service dans le raccordement du projet lauréat

    Scénario: Impossible de supprimer la mise en service du dossier de raccordement si celui-ci n'est pas en service
        Etant donné une demande complète de raccordement pour le projet lauréat
        Quand le gestionnaire de réseau supprime la mise en service du dossier de raccordement
        Alors l'utilisateur devrait être informé que "Le dossier de raccordement n'est pas en service"
