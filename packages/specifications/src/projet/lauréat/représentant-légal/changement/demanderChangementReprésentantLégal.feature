# language: fr
@select
Fonctionnalité: Demander le changement de représentant légal d'un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et la dreal "Dreal du sud-ouest" associée à la région du projet
        Et un cahier des charges modificatif choisi

    Scénario: Un porteur demande le changement de réprésentant légal d'un projet lauréat
        Quand le porteur demande le changement de réprésentant pour le projet lauréat le "2024-10-24"
        Alors une demande de changement de représentant légal du projet lauréat devrait être consultable
        Et un email a été envoyé à la dreal avec :
            | sujet      | Potentiel - Demande de modification du représentant légal pour le projet Du boulodrome de Marseille dans le département(.*) |
            | nom_projet | Du boulodrome de Marseille                                                                                                  |
            | url        | https://potentiel.beta.gouv.fr/laureats/.*/representant-legal/changement/.*                                                 |
        Et une tâche "gestion automatique de la demande de changement de représentant légal" est planifiée à la date du "2025-01-24" pour le projet lauréat
        Et une tâche "rappel d'instruction de la demande de changement de représentant légal à deux mois" est planifiée à la date du "2024-12-24" pour le projet lauréat

    Scénario: Impossible de demander le changement de représentant légal d'un projet lauréat si le changement est déjà en cours
        Etant donné une demande de changement de représentant légal en cours pour le projet lauréat
        Quand le porteur demande le changement de réprésentant pour le projet lauréat
        Alors le porteur devrait être informé que "Une demande de changement de représentant légal est déjà en cours"

    Scénario: Impossible de demander le changement de représentant légal d'un projet lauréat s'il est le même que l'actuel
        Quand le porteur demande le changement de réprésentant pour le projet lauréat avec les mêmes valeurs
        Alors le porteur devrait être informé que "Le représentant légal est identique à celui déjà associé au projet"

    Scénario: Impossible de demander le changement de représentant légal d'un projet lauréat si son type est inconnu
        Quand le porteur demande le changement de réprésentant pour le projet lauréat avec un type inconnu
        Alors le porteur devrait être informé que "Le représentant légal ne peut pas avoir de type inconnu"

    Scénario: Impossible de demander le changement de représentant légal d'un projet lauréat abandonné
        Etant donné un abandon accordé pour le projet lauréat
        Quand le porteur demande le changement de réprésentant pour le projet lauréat
        Alors le porteur devrait être informé que "Impossible de faire un changement pour un projet abandonné"

    Scénario: Impossible de demander le changement de représentant légal avec une demande d'abandon en cours
        Etant donné une demande d'abandon en cours pour le projet lauréat
        Quand le porteur demande le changement de réprésentant pour le projet lauréat
        Alors le porteur devrait être informé que "Impossible de faire un changement car une demande d'abandon est en cours pour le projet"

    Scénario: Impossible de demander le changement de représentant légal si le projet est achevé
        Etant donné une attestation de conformité transmise pour le projet lauréat
        Quand le porteur demande le changement de réprésentant pour le projet lauréat
        Alors le porteur devrait être informé que "Impossible de faire un changement pour un projet achevé"

    Scénario: Impossible d'enregistrer un changement de représentant légal si le cahier des charges ne le permet pas
        Etant donné le projet lauréat legacy "Du bouchon lyonnais" avec :
            | appel d'offre | CRE4 - Sol |
            | période       | 1          |
        Quand le porteur demande le changement de réprésentant pour le projet lauréat
        Alors le porteur devrait être informé que "Impossible de faire un changement pour ce cahier des charges"

    # Tâches planifiées
    Scénario: Relance automatique pour l'instruction de la demande de changement de représentant légal d'un projet lauréat disposant d'un accord automatique
        Etant donné le projet lauréat "Du boulodrome de Bordeaux" sur une période d'appel d'offre avec accord automatique du changement de représentant légal
        Et la dreal "Dreal du sud-ouest" associée à la région du projet
        Et une demande de changement de représentant légal en cours pour le projet lauréat
        Quand le système relance automatiquement la dreal pour faire l'accord de la demande de changement de représentant légal pour le projet lauréat
        Alors un email a été envoyé à la dreal avec :
            | type       | accord                                                                                                                                                    |
            | sujet      | Potentiel - La demande de modification du représentant légal pour le projet Du boulodrome de Bordeaux dans le département(.*) nécessite votre instruction |
            | nom_projet | Du boulodrome de Bordeaux                                                                                                                                 |
            | url        | https://potentiel.beta.gouv.fr/laureats/.*/representant-legal/changement/.*                                                                               |

    Scénario: Relance automatique pour l'instruction de la demande de changement de représentant légal d'un projet lauréat disposant d'un rejet automatique
        Etant donné le projet lauréat "Du boulodrome de Bordeaux" sur une période d'appel d'offre avec rejet automatique du changement de représentant légal
        Et la dreal "Dreal du sud-ouest" associée à la région du projet
        Et une demande de changement de représentant légal en cours pour le projet lauréat
        Quand le système relance automatiquement la dreal pour faire le rejet de la demande de changement de représentant légal pour le projet lauréat
        Alors un email a été envoyé à la dreal avec :
            | type       | rejet                                                                                                                                                     |
            | sujet      | Potentiel - La demande de modification du représentant légal pour le projet Du boulodrome de Bordeaux dans le département(.*) nécessite votre instruction |
            | nom_projet | Du boulodrome de Bordeaux                                                                                                                                 |
            | url        | https://potentiel.beta.gouv.fr/laureats/.*/representant-legal/changement/.*                                                                               |

    Scénario: Un DGEC validateur accorde l'abandon d'un projet lauréat avec une demande de changement de représentant légal en cours
        Etant donné une demande de changement de représentant légal en cours pour le projet lauréat
        Et une demande d'abandon en cours pour le projet lauréat
        Quand le DGEC validateur accorde l'abandon pour le projet lauréat
        Alors une tâche "gestion automatique de la demande de changement de représentant légal" n'est plus planifiée pour le projet "Du boulodrome de Marseille"
        Et une tâche "rappel d'instruction de la demande de changement de représentant légal à deux mois" n'est plus planifiée pour le projet "Du boulodrome de Marseille"

    @NotImplemented
    Scénario: Impossible de demander le changement de représentant légal si le projet est déjà en service
        Etant donné le gestionnaire de réseau "Enedis"
        Et le gestionnaire de réseau "Enedis" attribué au raccordement du projet lauréat
        Et une demande complète de raccordement pour le projet lauréat
        Et une proposition technique et financière pour le dossier de raccordement du projet lauréat
        Et une date de mise en service pour le dossier de raccordement du projet lauréat
        Quand le porteur demande le changement de réprésentant pour le projet lauréat
        Alors le porteur devrait être informé que "Impossible de demander le changement de représentant légal pour un projet déjà en service"
