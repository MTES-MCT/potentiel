# language: fr
@raccordement
@modifier-référence-dcr
Fonctionnalité: Modifier la référence d'une demande complète de raccordement

    Contexte:
        Etant donné le gestionnaire de réseau "Enedis"
        Et le projet lauréat "Du boulodrome de Marseille"
        Et le gestionnaire de réseau "Enedis" attribué au raccordement du projet lauréat
        Et la dreal "Dreal du sud-ouest" associée à la région du projet

    Plan du Scénario: Modifier la référence d'une demande complète de raccordement
        Etant donné une demande complète de raccordement pour le projet lauréat avec :
            | La référence du dossier de raccordement | <Référence actuelle> |
        Quand le porteur modifie la référence de la demande complète de raccordement pour le projet lauréat
        Alors le dossier est consultable dans la liste des dossiers de raccordement du projet lauréat
        Et la demande complète de raccordement devrait être consultable dans le dossier de raccordement du projet lauréat

        Exemples:
            | Référence actuelle        |
            | Référence non transmise   |
            | Enedis                    |
            | Enedis OUE-RP-2022-000033 |
            | Enedis DDD                |
            | OUE-RP-2022-000033        |

    Scénario: Modifier en tant qu'administrateur la référence d'une demande complète de raccordement pour un dossier ayant déjà une date de mise en service
        Etant donné une demande complète de raccordement pour le projet lauréat
        Et une date de mise en service pour le dossier de raccordement du projet lauréat
        Quand l'administrateur modifie la référence de la demande complète de raccordement pour le projet lauréat
        Alors le dossier est consultable dans la liste des dossiers de raccordement du projet lauréat
        Et la demande complète de raccordement devrait être consultable dans le dossier de raccordement du projet lauréat

    Scénario: Modifier un dossier de raccordement suite à la modification de la référence
        Etant donné une demande complète de raccordement pour le projet lauréat
        Quand le porteur modifie la référence de la demande complète de raccordement pour le projet lauréat
        Et la dreal modifie la demande complète de raccordement
        Alors le dossier est consultable dans la liste des dossiers de raccordement du projet lauréat
        Et la demande complète de raccordement devrait être consultable dans le dossier de raccordement du projet lauréat

    Scénario: Modifier la référence d'une demande complète de raccordement ayant une PTF
        Etant donné une demande complète de raccordement pour le projet lauréat avec :
            | La référence du dossier de raccordement | OUE-RP-2022-000033 |
        Et une proposition technique et financière pour le dossier de raccordement du projet lauréat
        Quand le porteur modifie la référence de la demande complète de raccordement pour le projet lauréat avec :
            | La référence du dossier de raccordement          | OUE-RP-2022-000033 |
            | La nouvelle référence du dossier de raccordement | OUE-RP-2022-000034 |
        Alors la proposition technique et financière signée devrait être consultable dans le dossier de raccordement du projet lauréat

    Scénario: Impossible de modifier une demande complète de raccordement avec une référence ne correspondant pas au format défini par le gestionnaire de réseau
        Etant donné un gestionnaire de réseau
            | Code EIC             | 17X0000009352859 |
            | Raison sociale       | RTE              |
            | Expression régulière | ^[a-zA-Z]{3}$    |
        Et le gestionnaire de réseau "RTE" attribué au raccordement du projet lauréat
        Et une demande complète de raccordement pour le projet lauréat avec :
            | La référence du dossier de raccordement | ABC |
        Quand le porteur modifie la référence de la demande complète de raccordement pour le projet lauréat avec :
            | La  nouvelle référence du dossier de raccordement | UneRéférenceAvecUnFormatInvalide |
        Alors le porteur devrait être informé que "Le format de la référence du dossier de raccordement est invalide"

    Scénario: Impossible de modifier la référence pour un projet sans dossier de raccordement
        Quand le porteur modifie la référence de la demande complète de raccordement pour le projet lauréat avec :
            | La référence du dossier de raccordement | OUE-RP-2022-000033 |
        Alors le porteur devrait être informé que "Le dossier n'est pas référencé dans le raccordement de ce projet"

    Scénario: Impossible de modifier la référence pour un dossier n'étant pas référencé dans le raccordement du projet
        Etant donné une demande complète de raccordement pour le projet lauréat avec :
            | La référence du dossier de raccordement | OUE-RP-2022-000033 |
        Quand le porteur modifie la référence de la demande complète de raccordement pour le projet lauréat avec :
            | La référence du dossier de raccordement | OUE-RP-2022-000034 |
        Alors le porteur devrait être informé que "Le dossier n'est pas référencé dans le raccordement de ce projet"

    Scénario: Impossible pour un porteur de modifier la référence pour un dossier de raccordement ayant déjà une date de mise en service
        Etant donné une demande complète de raccordement pour le projet lauréat avec :
            | La référence du dossier de raccordement | OUE-RP-2022-000033 |
        Et une date de mise en service pour le dossier de raccordement du projet lauréat
        Quand le porteur modifie la référence de la demande complète de raccordement pour le projet lauréat
        Alors le porteur devrait être informé que "La référence du dossier de raccordement OUE-RP-2022-000033 ne peut pas être modifiée car le dossier dispose déjà d'une date de mise en service"

    Scénario: Impossible pour une dreal de modifier la référence pour un dossier de raccordement ayant déjà une date de mise en service
        Etant donné une demande complète de raccordement pour le projet lauréat avec :
            | La référence du dossier de raccordement | OUE-RP-2022-000033 |
        Et une date de mise en service pour le dossier de raccordement du projet lauréat
        Quand la dreal modifie la référence de la demande complète de raccordement pour le projet lauréat
        Alors la dreal devrait être informé que "La référence du dossier de raccordement OUE-RP-2022-000033 ne peut pas être modifiée car le dossier dispose déjà d'une date de mise en service"

    Scénario: Impossible de modifier la référence pour un dossier si un autre dossier du même projet a déjà cette référence
        Etant donné une demande complète de raccordement pour le projet lauréat avec :
            | La référence du dossier de raccordement | OUE-RP-2022-000033 |
        Etant donné une demande complète de raccordement pour le projet lauréat avec :
            | La référence du dossier de raccordement | OUE-RP-2022-000034 |
        Quand le porteur modifie la référence de la demande complète de raccordement pour le projet lauréat avec :
            | La référence du dossier de raccordement          | OUE-RP-2022-000033 |
            | La nouvelle référence du dossier de raccordement | OUE-RP-2022-000034 |
        Alors le porteur devrait être informé que "Il est impossible d'avoir plusieurs dossiers de raccordement avec la même référence pour un projet"
