# language: fr
@raccordement
@document-raccordement
Fonctionnalité: Modifier un document

    Contexte:
        Etant donné le gestionnaire de réseau "Enedis"
        Et le projet lauréat "Du boulodrome de Marseille"
        Et un cahier des charges permettant la modification du projet
        Et le gestionnaire de réseau "Enedis" attribué au raccordement du projet lauréat
        Et la dreal "Dreal du sud" associée à la région du projet

    Plan du scénario: Modifier un document
        Etant donné une demande complète de raccordement pour le projet lauréat
        Et un document transmis pour le projet lauréat
        Quand <role> modifie le document
        Alors le document devrait être consultable dans le dossier de raccordement du projet lauréat

        Exemples:
            | role       |
            | le porteur |
            | la dreal   |
            | la dgec    |

    Scénario: Modifier un document pour un projet abandonné avec PPA
        Etant donné une demande complète de raccordement pour le projet lauréat
        Et un document transmis pour le projet lauréat
        Et une demande d'abandon accordée avec déclaration de PPA
        Quand le porteur modifie le document
        Alors le document devrait être consultable dans le dossier de raccordement du projet lauréat

    Scénario: Modifier un document pour un projet en cours d'abandon avec PPA
        Etant donné une demande complète de raccordement pour le projet lauréat
        Et un document transmis pour le projet lauréat
        Et une demande d'abandon en cours avec signalement de PPA pour le projet lauréat
        Quand le porteur modifie le document
        Alors le document devrait être consultable dans le dossier de raccordement du projet lauréat

    Scénario: La dgec modifie un document pour un projet en service
        Etant donné une demande complète de raccordement pour le projet lauréat
        Et un document transmis pour le projet lauréat
        Et une date de mise en service pour le dossier de raccordement du projet lauréat
        Quand la dgec modifie le document
        Alors le dossier est consultable dans la liste des dossiers de raccordement du projet lauréat
        Et le document devrait être consultable dans le dossier de raccordement du projet lauréat

    Scénario: La dgec modifie un document d'un projet achevé
        Etant donné une demande complète de raccordement pour le projet lauréat
        Et un document transmis pour le projet lauréat
        Et l'achèvement réel transmis pour le projet lauréat
        Quand la dgec modifie le document
        Alors le dossier est consultable dans la liste des dossiers de raccordement du projet lauréat
        Et le document devrait être consultable dans le dossier de raccordement du projet lauréat

    Scénario: Impossible de modifier un document qui n'a pas été transmis
        Etant donné une demande complète de raccordement pour le projet lauréat
        Et un document proposition technique et financière pour le projet lauréat
        Quand le porteur modifie le document avec :
            | type de document | convention-de-raccordement |
        Alors le porteur devrait être informé que "Il n'existe pas de document de ce type dans ce dossier de raccordement"

    Scénario: Impossible de modifier un document avec une date de signature dans le futur
        Etant donné une demande complète de raccordement pour le projet lauréat
        Et un document transmis pour le projet lauréat
        Quand le porteur modifie le document avec :
            | La date de signature | 2999-12-31 |
        Alors le porteur devrait être informé que "La date ne peut pas être une date future"

    Scénario: Impossible de modifier un document sans modification
        Etant donné une demande complète de raccordement pour le projet lauréat
        Et un document transmis pour le projet lauréat
        Quand le porteur modifie le document avec les mêmes valeurs
        Alors le porteur devrait être informé que "Aucune modification n'a été apportée au document"

    Scénario: Impossible de modifier un document d'un projet en cours d'abandon
        Etant donné une demande complète de raccordement pour le projet lauréat
        Et un document transmis pour le projet lauréat
        Et une demande d'abandon en cours pour le projet lauréat
        Quand le porteur modifie le document
        Alors le porteur devrait être informé que "Impossible de faire un changement car une demande d'abandon est en cours pour le projet"

    Scénario: Impossible pour un rôle hors dgec de modifier une PTF si le projet est déjà en service
        Etant donné une demande complète de raccordement pour le projet lauréat
        Et un document transmis pour le projet lauréat
        Et une date de mise en service pour le dossier de raccordement du projet lauréat
        Quand <role> modifie le document
        Alors <role> devrait être informé que "Ce document du dossier de raccordement ne peut pas être modifié car celui-ci est déjà mis en service"

        Exemples:
            | role       |
            | le porteur |
            | la dreal   |

    Scénario: Impossible pour un rôle hors dgec de modifier un document si le projet est achevé
        Etant donné une demande complète de raccordement pour le projet lauréat
        Et un document transmis pour le projet lauréat
        Et l'achèvement réel transmis pour le projet lauréat
        Quand <role> modifie le document
        Alors <role> devrait être informé que "Impossible de faire un changement pour un projet achevé"

        Exemples:
            | role       |
            | le porteur |
            | la dreal   |

    Scénario: Impossible de modifier un document d'un projet abandonné
        Etant donné une demande complète de raccordement pour le projet lauréat
        Et un document transmis pour le projet lauréat
        Et une demande d'abandon accordée pour le projet lauréat "Du boulodrome de Marseille"
        Quand la dgec modifie le document
        Alors la dgec devrait être informé que "Impossible de faire un changement pour un projet abandonné"
