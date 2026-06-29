# language: fr
@raccordement
@document-raccordement
Fonctionnalité: Modifier un document raccordement

    Contexte:
        Etant donné le gestionnaire de réseau "Enedis"
        Et le projet lauréat "Du boulodrome de Marseille"
        Et un cahier des charges permettant la modification du projet
        Et le gestionnaire de réseau "Enedis" attribué au raccordement du projet lauréat
        Et la dreal "Dreal du sud" associée à la région du projet

    Plan du scénario: Modifier un document raccordement
        Etant donné une demande complète de raccordement pour le projet lauréat
        Et un document raccordement transmis pour le projet lauréat
        Quand <role> modifie le document raccordement
        Alors le document raccordement devrait être consultable dans le dossier de raccordement du projet lauréat

        Exemples:
            | role       |
            | le porteur |
            | la dreal   |
            | la dgec    |

    Scénario: La dgec modifie un document raccordement pour un projet en service
        Etant donné une demande complète de raccordement pour le projet lauréat
        Et un document raccordement transmis pour le projet lauréat
        Et une date de mise en service pour le dossier de raccordement du projet lauréat
        Quand la dgec modifie le document raccordement
        Alors le dossier est consultable dans la liste des dossiers de raccordement du projet lauréat
        Et le document raccordement devrait être consultable dans le dossier de raccordement du projet lauréat

    Scénario: La dgec modifie un document raccordement d'un projet achevé
        Etant donné une demande complète de raccordement pour le projet lauréat
        Et un document raccordement transmis pour le projet lauréat
        Et l'achèvement réel transmis pour le projet lauréat
        Quand la dgec modifie le document raccordement
        Alors le dossier est consultable dans la liste des dossiers de raccordement du projet lauréat
        Et le document raccordement devrait être consultable dans le dossier de raccordement du projet lauréat

    Scénario: Modifier un document raccordement pour un projet abandonné avec PPA
        Etant donné une demande complète de raccordement pour le projet lauréat
        Et un document raccordement transmis pour le projet lauréat
        Et une demande d'abandon accordée avec déclaration de PPA
        Quand le porteur modifie le document raccordement
        Alors le document raccordement devrait être consultable dans le dossier de raccordement du projet lauréat

    Scénario: Modifier un document raccordement pour un projet en cours d'abandon avec PPA
        Etant donné une demande complète de raccordement pour le projet lauréat
        Et un document raccordement transmis pour le projet lauréat
        Et une demande d'abandon en cours avec signalement de PPA pour le projet lauréat
        Quand le porteur modifie le document raccordement
        Alors le document raccordement devrait être consultable dans le dossier de raccordement du projet lauréat

    Scénario: Impossible de modifier un document raccordement qui n'a pas été transmis
        Etant donné une demande complète de raccordement pour le projet lauréat
        Et un document raccordement transmis pour le projet lauréat avec :
            | type de document | proposition-technique-et-financière |
        Quand le porteur modifie le document raccordement avec :
            | type de document | convention-de-raccordement |
        Alors le porteur devrait être informé que "Il n'existe pas de document de ce type à modifier dans ce dossier de raccordement"

    Scénario: Impossible de modifier un document raccordement avec une date de signature dans le futur
        Etant donné une demande complète de raccordement pour le projet lauréat
        Et un document raccordement transmis pour le projet lauréat
        Quand le porteur modifie le document raccordement avec :
            | La date de signature | 2999-12-31 |
        Alors le porteur devrait être informé que "La date ne peut pas être une date future"

    Scénario: Impossible de modifier un document raccordement sans modification
        Etant donné une demande complète de raccordement pour le projet lauréat
        Et un document raccordement transmis pour le projet lauréat
        Quand le porteur modifie le document raccordement avec les mêmes valeurs
        Alors le porteur devrait être informé que "Aucune modification n'a été apportée au document"

    Scénario: Impossible de modifier un document raccordement d'un projet en cours d'abandon
        Etant donné une demande complète de raccordement pour le projet lauréat
        Et un document raccordement transmis pour le projet lauréat
        Et une demande d'abandon en cours pour le projet lauréat
        Quand le porteur modifie le document raccordement
        Alors le porteur devrait être informé que "Impossible de faire un changement car une demande d'abandon est en cours pour le projet"

    Scénario: Impossible pour un rôle hors dgec de modifier une PTF si le projet est déjà en service
        Etant donné une demande complète de raccordement pour le projet lauréat
        Et un document raccordement transmis pour le projet lauréat
        Et une date de mise en service pour le dossier de raccordement du projet lauréat
        Quand <role> modifie le document raccordement
        Alors <role> devrait être informé que "Ce document du dossier de raccordement ne peut pas être modifié car celui-ci est déjà mis en service"

        Exemples:
            | role       |
            | le porteur |
            | la dreal   |

    Scénario: Impossible pour un rôle hors dgec de modifier un document raccordement si le projet est achevé
        Etant donné une demande complète de raccordement pour le projet lauréat
        Et un document raccordement transmis pour le projet lauréat
        Et l'achèvement réel transmis pour le projet lauréat
        Quand <role> modifie le document raccordement
        Alors <role> devrait être informé que "Impossible de faire un changement pour un projet achevé"

        Exemples:
            | role       |
            | le porteur |
            | la dreal   |

    Scénario: Impossible de modifier un document raccordement d'un projet abandonné
        Etant donné une demande complète de raccordement pour le projet lauréat
        Et un document raccordement transmis pour le projet lauréat
        Et une demande d'abandon accordée pour le projet lauréat "Du boulodrome de Marseille"
        Quand la dgec modifie le document raccordement
        Alors la dgec devrait être informé que "Impossible de faire un changement pour un projet abandonné"
