# language: fr
@raccordement
@demande-complète-raccordement
Fonctionnalité: Modifier la référence d'une demande complète de raccordement

    Contexte:
        Etant donné le gestionnaire de réseau "Enedis"
        Et le projet lauréat "Du boulodrome de Marseille"
        Et un cahier des charges permettant la modification du projet
        Et le gestionnaire de réseau "Enedis" attribué au raccordement du projet lauréat
        Et la dreal "Dreal du sud-ouest" associée à la région du projet

    Plan du Scénario: Modifier la référence d'une demande complète de raccordement
        Etant donné une demande complète de raccordement pour le projet lauréat avec :
            | La référence du dossier de raccordement | <Référence actuelle> |
        Quand <rôle> modifie la référence de la demande complète de raccordement pour le projet lauréat
        Alors le dossier est consultable dans la liste des dossiers de raccordement du projet lauréat
        Et la demande complète de raccordement devrait être consultable dans le dossier de raccordement du projet lauréat

        Exemples:
            | Référence actuelle        | rôle       |
            | Référence non transmise   | la dreal   |
            | Enedis                    | le porteur |
            | Enedis OUE-RP-2022-000033 | la dgec    |
            | Enedis DDD                | le porteur |
            | OUE-RP-2022-000033        | la dreal   |

    Scénario: Modifier en tant qu'la dgec la référence d'une demande complète de raccordement pour un dossier ayant déjà une date de mise en service
        Etant donné une demande complète de raccordement pour le projet lauréat
        Et une date de mise en service pour le dossier de raccordement du projet lauréat
        Quand la dgec modifie la référence de la demande complète de raccordement pour le projet lauréat
        Alors le dossier est consultable dans la liste des dossiers de raccordement du projet lauréat
        Et la demande complète de raccordement devrait être consultable dans le dossier de raccordement du projet lauréat

    Scénario: Modifier un dossier de raccordement suite à la modification de la référence
        Etant donné une demande complète de raccordement pour le projet lauréat
        Quand le porteur modifie la référence de la demande complète de raccordement pour le projet lauréat
        Et la dreal modifie la demande complète de raccordement
        Alors le dossier est consultable dans la liste des dossiers de raccordement du projet lauréat
        Et la demande complète de raccordement devrait être consultable dans le dossier de raccordement du projet lauréat

    Scénario: Modifier la référence d'une demande complète de raccordement ayant un document de raccordement
        Etant donné une demande complète de raccordement pour le projet lauréat avec :
            | La référence du dossier de raccordement | OUE-RP-2022-000033 |
        Et un document proposition technique et financière pour le projet lauréat
        Quand le porteur modifie la référence de la demande complète de raccordement pour le projet lauréat avec :
            | La référence du dossier de raccordement          | OUE-RP-2022-000033 |
            | La nouvelle référence du dossier de raccordement | OUE-RP-2022-000034 |
        Alors le document devrait être consultable dans le dossier de raccordement du projet lauréat

    Scénario: Modifier la référence d'une demande complète de raccordement pour un projet abandonné avec PPA
        Etant donné une demande complète de raccordement pour le projet lauréat
        Et une demande d'abandon accordée avec déclaration de PPA
        Quand le porteur modifie la référence de la demande complète de raccordement pour le projet lauréat
        Alors le dossier est consultable dans la liste des dossiers de raccordement du projet lauréat
        Et la demande complète de raccordement devrait être consultable dans le dossier de raccordement du projet lauréat

    Scénario: Modifier la référence d'une demande complète de raccordement pour un projet en cours d'abandon avec PPA
        Etant donné une demande complète de raccordement pour le projet lauréat
        Et une demande d'abandon en cours avec signalement de PPA pour le projet lauréat
        Quand le porteur modifie la référence de la demande complète de raccordement pour le projet lauréat
        Alors le dossier est consultable dans la liste des dossiers de raccordement du projet lauréat
        Et la demande complète de raccordement devrait être consultable dans le dossier de raccordement du projet lauréat

    Scénario: Impossible de modifier une demande complète de raccordement avec une référence ne correspondant pas au format défini par le gestionnaire de réseau
        Etant donné le gestionnaire de réseau avec :
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

    Scénario: Impossible pour un porteur ou la dreal de modifier la référence pour un dossier de raccordement ayant déjà une date de mise en service
        Etant donné une demande complète de raccordement pour le projet lauréat avec :
            | La référence du dossier de raccordement | OUE-RP-2022-000033 |
        Et une date de mise en service pour le dossier de raccordement du projet lauréat
        Quand <rôle> modifie la référence de la demande complète de raccordement pour le projet lauréat
        Alors <rôle> devrait être informé que "La référence du dossier de raccordement OUE-RP-2022-000033 ne peut pas être modifiée car le dossier dispose déjà d'une date de mise en service"

        Exemples:
            | rôle       |
            | la dreal   |
            | le porteur |

    Scénario: Impossible de modifier la référence pour un dossier si un autre dossier du même projet a déjà cette référence
        Etant donné une demande complète de raccordement pour le projet lauréat avec :
            | La référence du dossier de raccordement | OUE-RP-2022-000033 |
        Etant donné une demande complète de raccordement pour le projet lauréat avec :
            | La référence du dossier de raccordement | OUE-RP-2022-000034 |
        Quand le porteur modifie la référence de la demande complète de raccordement pour le projet lauréat avec :
            | La référence du dossier de raccordement          | OUE-RP-2022-000033 |
            | La nouvelle référence du dossier de raccordement | OUE-RP-2022-000034 |
        Alors le porteur devrait être informé que "Il est impossible d'avoir plusieurs dossiers de raccordement avec la même référence pour un projet"

    Scénario: Impossible de modifier une référence de raccordement si le projet a une demande d'abandon en cours
        Etant donné une demande complète de raccordement pour le projet lauréat
        Et une date de mise en service pour le dossier de raccordement du projet lauréat
        Et une demande d'abandon en cours pour le projet lauréat
        Quand la dgec modifie la référence de la demande complète de raccordement pour le projet lauréat
        Alors la dgec devrait être informé que "Impossible de faire un changement car une demande d'abandon est en cours pour le projet"

    Scénario: Impossible de modifier une référence de raccordement si le projet est abandonné
        Etant donné une demande complète de raccordement pour le projet lauréat
        Et une date de mise en service pour le dossier de raccordement du projet lauréat
        Et une demande d'abandon accordée pour le projet lauréat "Du boulodrome de Marseille"
        Quand la dgec modifie la référence de la demande complète de raccordement pour le projet lauréat
        Alors la dgec devrait être informé que "Impossible de faire un changement pour un projet abandonné"
