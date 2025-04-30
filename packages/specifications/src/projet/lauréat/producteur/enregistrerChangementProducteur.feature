# language: fr
Fonctionnalité: Enregistrer un changement de producteur d'un projet lauréat

    # ajouter les notifications
    Scénario: Enregistrer un changement de producteur d'un projet lauréat
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offre | PPE2 - Bâtiment |
            | période       | 1               |
        Et la dreal "Dreal du sud" associée à la région du projet
        Quand le porteur enregistre un changement de producteur pour le projet lauréat
        Alors le porteur ne doit plus avoir accès au projet lauréat
        Et le projet lauréat est consultable dans la liste des projets à réclamer
        Et il ne devrait pas y avoir de dépôt de garanties financières pour le projet "Du boulodrome de Marseille"
        Et il ne devrait pas y avoir de garanties financières actuelles pour le projet "Du boulodrome de Marseille"
        Et le changement enregistré du producteur du projet lauréat devrait être consultable

    # Et un email a été envoyé au porteur avec :
    #     | sujet      | Potentiel - Déclaration de changement de producteur pour le projet Du boulodrome de Marseille dans le département(.*) |
    #     | nom_projet | Du boulodrome de Marseille                                                                                            |
    # Et un email a été envoyé à la dreal avec :
    #     | sujet      | Potentiel - Déclaration de changement de producteur pour le projet Du boulodrome de Marseille dans le département(.*) |
    #     | nom_projet | Du boulodrome de Marseille                                                                                            |
    #     | url        | https://potentiel.beta.gouv.fr/laureats/.*/producteur/changement/.*                                                   |
    Scénario: Impossible d'enregistrer un changement de producteur d'un projet lauréat si l'appel d'offre empêche un changement avant l'achèvement du projet
        Etant donné le projet lauréat legacy "Du boulodrome de Bordeaux" avec :
            | appel d'offre | Eolien |
            | période       | 1      |
        Quand le porteur enregistre un changement de producteur pour le projet lauréat
        Alors le porteur devrait être informé que "L'appel d'offre du projet empêche un changement de producteur avant l'achèvement du projet"

    Scénario: Impossible d'enregistrer un changement de producteur d'un projet lauréat avec un producteur identique
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offre | PPE2 - Bâtiment |
            | période       | 1               |
        Quand le porteur enregistre un changement de producteur avec une valeur identique pour le projet lauréat
        Alors le porteur devrait être informé que "Le nouveau producteur est identique à celui associé au projet"

    Scénario: Impossible d'enregistrer un changement de producteur d'un projet lauréat abandonné
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offre | PPE2 - Bâtiment |
            | période       | 1               |
        Etant donné un abandon accordé pour le projet lauréat
        Quand le porteur enregistre un changement de producteur pour le projet lauréat
        Alors le porteur devrait être informé que "Impossible d'enregistrer un changement de producteur pour un projet abandonné"

    Scénario: Impossible d'enregistrer un changement de producteur d'un projet lauréat si une demande d'abandon est en cours
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offre | PPE2 - Bâtiment |
            | période       | 1               |
        Etant donné une demande d'abandon en cours pour le projet lauréat
        Quand le porteur enregistre un changement de producteur pour le projet lauréat
        Alors le porteur devrait être informé que "Impossible d'enregistrer un changement de producteur car une demande d'abandon est en cours pour le projet"

    Scénario: Impossible d'enregistrer le changement de producteur d'un projet achevé
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offre | PPE2 - Bâtiment |
            | période       | 1               |
        Etant donné une attestation de conformité transmise pour le projet lauréat
        Quand le porteur enregistre un changement de producteur pour le projet lauréat
        Alors le porteur devrait être informé que "Impossible d'enregistrer un changement de producteur pour un projet achevé"
