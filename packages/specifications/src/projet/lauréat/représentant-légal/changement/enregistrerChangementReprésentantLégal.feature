# language: fr
@select
Fonctionnalité: Enregistrer un changement de représentant légal

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offre | PPE2 - Petit PV |
            | période       | 1               |
        Et un cahier des charges modificatif choisi
        Et la dreal "Dreal du sud" associée à la région du projet

    Scénario: Enregistrer un changement de représentant légal
        Quand le porteur enregistre un changement de représentant légal
        Alors le représentant légal devrait être mis à jour
        Et le changement enregistré du représentant légal du projet lauréat devrait être consultable
        Et un email a été envoyé à la dreal avec :
            | sujet      | Potentiel - Enregistrement d'un changement de représentant légal pour le projet Du boulodrome de Marseille dans le département(.*) |
            | nom_projet | Du boulodrome de Marseille                                                                                                         |
            | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                                              |
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - Enregistrement d'un changement de représentant légal pour le projet Du boulodrome de Marseille dans le département(.*) |
            | nom_projet | Du boulodrome de Marseille                                                                                                         |
            | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                                              |

    Scénario: Impossible d'enregistrer un changement de représentant légal pour certains AO
        Etant donné le projet lauréat "Du boulodrome de Lyon" avec :
            | appel d'offre | PPE2 - Bâtiment |
        Quand le porteur enregistre un changement de représentant légal
        Alors le porteur devrait être informé que "Impossible de faire ce type de changement pour cet appel d'offre ou cette période"

    Scénario: Impossible d'enregistrer un changement de représentant légal sans modification
        Quand le porteur enregistre un changement de représentant légal avec les mêmes valeurs
        Alors l'utilisateur devrait être informé que "Le changement de représentant légal doit contenir une modification"

    Scénario: Impossible d'enregistrer un changement de représentant légal d'un projet lauréat s'il est le même que l'actuel
        Quand le porteur demande le changement de réprésentant pour le projet lauréat avec les mêmes valeurs
        Alors le porteur devrait être informé que "Le représentant légal est identique à celui déjà associé au projet"

    Scénario: Impossible d'enregistrer un changement de représentant légal d'un projet lauréat si son type est inconnu
        Quand le porteur demande le changement de réprésentant avec un type inconnu
        Alors le porteur devrait être informé que "Le représentant légal ne peut pas avoir de type inconnu"

    Scénario: Impossible d'enregistrer un changement de représentant légal d'un projet lauréat abandonné
        Etant donné un abandon accordé pour le projet lauréat
        Quand le porteur demande le changement de réprésentant pour le projet lauréat
        Alors le porteur devrait être informé que "Impossible de faire un changement pour un projet abandonné"

    Scénario: Impossible d'enregistrer un changement de représentant légal avec une demande d'abandon en cours
        Etant donné une demande d'abandon en cours pour le projet lauréat
        Quand le porteur demande le changement de réprésentant pour le projet lauréat
        Alors le porteur devrait être informé que "Impossible de faire un changement car une demande d'abandon est en cours pour le projet"

    Scénario: Impossible d'enregistrer un changement de représentant légal si le projet est achevé
        Etant donné une attestation de conformité transmise pour le projet lauréat
        Quand le porteur demande le changement de réprésentant pour le projet lauréat
        Alors le porteur devrait être informé que "Impossible de faire un changement pour un projet achevé"

    # A voir si facile à reproduire
    Scénario: Impossible d'enregistrer le changement de représentant légal d'un projet lauréat dont le cahier des charges ne le permet pas
        Etant donné le projet lauréat legacy "Du bouchon lyonnais" avec :
            | appel d'offre | CRE4 - Sol |
            | période       | 1          |
        Quand le porteur enregistre un changement de représentant légal
        Alors le porteur devrait être informé que "Impossible de faire un changement pour ce cahier des charges"
