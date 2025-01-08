# language: fr
Fonctionnalité: Demander le changement de représentant légal d'un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et le porteur "Marcel Patoulatchi" ayant accés au projet lauréat "Du boulodrome de Marseille"
        Et la dreal "Dreal du sud-ouest" associée à la région du projet

    Scénario: Un porteur demande le changement de réprésentant légal d'un projet lauréat
        Quand le porteur demande le changement de réprésentant pour le projet lauréat le "2024-10-24"
        Alors une demande de changement de représentant légal du projet lauréat devrait être consultable
        Et un email a été envoyé à la dreal avec :
            | sujet      | Potentiel - Demande de modification du représentant légal pour le projet Du boulodrome de Marseille dans le département(.*) |
            | nom_projet | Du boulodrome de Marseille                                                                                                  |
            | url        | https://potentiel.beta.gouv.fr/laureats/.*/changement/representant-legal                                                    |
        Et une tâche "gestion automatique de la demande de changement de représentant légal" est planifiée à la date du "2025-01-24" pour le projet lauréat

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
        Alors le porteur devrait être informé que "Impossible de demander le changement de réprésentant légal pour un projet abandonné"

    Scénario: Impossible de demander le changement de représentant légal avec une demande d'abandon en cours
        Etant donné une demande d'abandon en cours pour le projet lauréat
        Quand le porteur demande le changement de réprésentant pour le projet lauréat
        Alors le porteur devrait être informé que "Impossible de demander le changement de réprésentant légal car une demande d'abandon est en cours pour le projet"

    Scénario: Impossible de demander le changement de représentant légal si le projet est achevé
        Etant donné une attestation de conformité transmise pour le projet "Du boulodrome de Marseille"
        Quand le porteur demande le changement de réprésentant pour le projet lauréat
        Alors le porteur devrait être informé que "Impossible de demander le changement de représentant légal pour un projet achevé"

    @NotImplemented
    Scénario: Impossible de demander le changement de représentant légal si le projet est déjà en service
        Etant donné le gestionnaire de réseau "Enedis"
        Et le gestionnaire de réseau "Enedis" attribué au raccordement du projet lauréat "Du boulodrome de Marseille"
        Et une demande complète de raccordement pour le projet lauréat "Du boulodrome de Marseille" transmise auprès du gestionnaire de réseau "Enedis" avec :
            | La date de qualification                | 2022-10-28                                                                                            |
            | La référence du dossier de raccordement | OUE-RP-2022-000033                                                                                    |
            | Le format de l'accusé de réception      | application/pdf                                                                                       |
            | Le contenu de l'accusé de réception     | Accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-28 |
        Et une proposition technique et financière pour le dossier ayant comme référence "OUE-RP-2022-000033" du raccordement pour le projet lauréat "Du boulodrome de Marseille" avec :
            | La date de signature                                | 2023-01-10                                                                                                        |
            | Le format de la proposition technique et financière | application/pdf                                                                                                   |
            | Le contenu de proposition technique et financière   | Proposition technique et financière pour la référence OUE-RP-2022-000033 avec une date de signature au 2023-01-10 |
        Et une date de mise en service "2024-01-01" pour le dossier ayant comme référence "OUE-RP-2022-000033" du raccordement pour le projet lauréat "Du boulodrome de Marseille"
        Quand le porteur demande le changement de réprésentant pour le projet lauréat
        Alors le porteur devrait être informé que "Impossible de demander le changement de représentant légal pour un projet déjà en service"
