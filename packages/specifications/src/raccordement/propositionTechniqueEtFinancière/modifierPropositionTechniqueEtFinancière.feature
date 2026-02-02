# language: fr
@raccordement
@proposition-technique-financière
Fonctionnalité: Modifier une proposition technique et financière

    Contexte:
        Etant donné le gestionnaire de réseau "Enedis"
        Et le projet lauréat "Du boulodrome de Marseille"
        Et le gestionnaire de réseau "Enedis" attribué au raccordement du projet lauréat

    Plan du scénario: Modifier une PTF
        Etant donné une demande complète de raccordement pour le projet lauréat
        Et une proposition technique et financière pour le projet lauréat
        Quand <role> modifie la proposition technique et financière
        Alors la proposition technique et financière signée devrait être consultable dans le dossier de raccordement du projet lauréat

        Exemples:
            | role             |
            | le porteur       |
            | la dreal         |
            | l'administrateur |

    Scénario: Un administrateur modifie la PTF pour un projet en service
        Etant donné une demande complète de raccordement pour le projet lauréat
        Et une proposition technique et financière pour le projet lauréat
        Et une date de mise en service pour le dossier de raccordement du projet lauréat
        Quand l'administrateur modifie la proposition technique et financière
        Alors le dossier est consultable dans la liste des dossiers de raccordement du projet lauréat
        Et la proposition technique et financière signée devrait être consultable dans le dossier de raccordement du projet lauréat

    Scénario: Un administrateur modifie la PTF d'un projet achevé
        Etant donné une demande complète de raccordement pour le projet lauréat
        Et une proposition technique et financière pour le projet lauréat
        Et une attestation de conformité transmise pour le projet lauréat
        Quand l'administrateur modifie la proposition technique et financière
        Alors le dossier est consultable dans la liste des dossiers de raccordement du projet lauréat
        Et la proposition technique et financière signée devrait être consultable dans le dossier de raccordement du projet lauréat

    Scénario: Impossible de modifier une proposition technique et financière pour un projet sans dossier de raccordement
        Quand le porteur modifie la proposition technique et financière avec :
            | La référence du dossier de raccordement | OUE-RP-2022-000033 |
        Alors le porteur devrait être informé que "Le dossier n'est pas référencé dans le raccordement de ce projet"

    Scénario: Impossible de modifier une proposition technique et financière pour un dossier n'étant pas référencé dans le raccordement du projet
        Etant donné une demande complète de raccordement pour le projet lauréat avec :
            | La référence du dossier de raccordement | OUE-RP-2022-000033 |
        Quand le porteur modifie la proposition technique et financière avec :
            | La référence du dossier de raccordement | OUE-RP-2022-000034 |
        Alors le porteur devrait être informé que "Le dossier n'est pas référencé dans le raccordement de ce projet"

    Scénario: Impossible de modifier une proposition technique et financière avec une date de signature dans le futur
        Etant donné une demande complète de raccordement pour le projet lauréat
        Et une proposition technique et financière pour le projet lauréat
        Quand le porteur modifie la proposition technique et financière avec :
            | La date de signature | 2999-12-31 |
        Alors le porteur devrait être informé que "La date ne peut pas être une date future"

    Scénario: Impossible de modifier une proposition technique et financière d'un projet en cours d'abandon
        Etant donné une demande complète de raccordement pour le projet lauréat
        Et une proposition technique et financière pour le projet lauréat
        Et un cahier des charges permettant la modification du projet
        Et une demande d'abandon en cours pour le projet lauréat
        Quand le porteur modifie la proposition technique et financière
        Alors le porteur devrait être informé que "Impossible de faire un changement car une demande d'abandon est en cours pour le projet"

    Plan du scénario: Impossible pour un rôle non administrateur de modifier une PTF si le projet est déjà en service
        Etant donné une demande complète de raccordement pour le projet lauréat
        Et une proposition technique et financière pour le projet lauréat
        Et une date de mise en service pour le dossier de raccordement du projet lauréat
        Quand <role> modifie la proposition technique et financière
        Alors <role> devrait être informé que "La proposition technique et financière du dossier ne peut pas être modifiée car celui-ci dispose déjà d'une date de mise en service"

        Exemples:
            | role       |
            | le porteur |
            | la dreal   |

    Plan du scénario: Impossible pour un rôle non administrateur de modifier une proposition technique et financière si le projet est achevé
        Etant donné une demande complète de raccordement pour le projet lauréat
        Et une proposition technique et financière pour le projet lauréat
        Et une attestation de conformité transmise pour le projet lauréat
        Quand <role> modifie la proposition technique et financière
        Alors <role> devrait être informé que "Impossible de faire un changement pour un projet achevé"

        Exemples:
            | role       |
            | le porteur |
            | la dreal   |
