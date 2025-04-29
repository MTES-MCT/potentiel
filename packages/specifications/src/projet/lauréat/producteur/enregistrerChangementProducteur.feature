# language: fr
Fonctionnalité: Enregistrer un changement de producteur d'un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offre | PPE2 - Bâtiment |
            | période       | 1               |
        Et la dreal "Dreal du sud" associée à la région du projet

    @NotImplemented
    Scénario: Enregistrer un changement de producteur d'un projet lauréat
        Quand le porteur enregistre un changement de producteur pour le projet lauréat
        Alors le porteur ne devrait plus avoir accès au projet lauréat
        Et il ne devrait pas y avoir de dépôt de garanties financières pour le projet "Du boulodrome de Marseille"
        Et il ne devrait pas y avoir de garanties financières actuelles pour le projet "Du boulodrome de Marseille"
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - Déclaration de changement de producteur pour le projet Du boulodrome de Marseille dans le département(.*) |
            | nom_projet | Du boulodrome de Marseille                                                                                            |
        Et un email a été envoyé à la dreal avec :
            | sujet      | Potentiel - Déclaration de changement de producteur pour le projet Du boulodrome de Marseille dans le département(.*) |
            | nom_projet | Du boulodrome de Marseille                                                                                            |
            | url        | https://potentiel.beta.gouv.fr/laureats/.*/producteur/changement/.*                                                   |

    @NotImplemented
    Scénario: Impossible d'enregistrer un changement de producteur d'un projet lauréat si l'appel d'offre empêche un changement avant l'achèvement du projet
        Etant donné le projet lauréat "Du boulodrome de Bordeaux" avec :
            | appel d'offre | Eolien |
            | période       | 1      |
        Quand le porteur enregistre un changement de producteur pour le projet lauréat
        Alors le porteur devrait être informé que "L'appel d'offre du projet empêche un changement de producteur avant l'achèvement du projet"

    @NotImplemented
    Scénario: Impossible d'enregistrer un changement de producteur d'un projet lauréat avec un producteur identique
        Quand le porteur enregistre un changement de producteur avec un producteur identique pour le projet lauréat
        Alors le porteur devrait être informé que "Le nouveau producteur est identique à celui associé au projet"

    @NotImplemented
    Scénario: Impossible d'enregistrer un changement de producteur d'un projet lauréat abandonné
        Etant donné un abandon accordé pour le projet lauréat
        Quand le porteur enregistre un changement de producteur pour le projet lauréat
        Alors le porteur devrait être informé que "Impossible d'enregistrer un changement de producteur pour un projet abandonné"

    @NotImplemented
    Scénario: Impossible d'enregistrer un changement de producteur d'un projet lauréat si une demande d'abandon est en cours
        Etant donné une demande d'abandon en cours pour le projet lauréat
        Quand le porteur enregistre un changement de producteur pour le projet lauréat
        Alors le porteur devrait être informé que "Impossible d'enregistrer un changement de producteur car une demande d'abandon est en cours pour le projet"

    @NotImplemented
    Scénario: Impossible d'enregistrer le changement de producteur d'un projet achevé
        Etant donné une attestation de conformité transmise pour le projet lauréat
        Quand le porteur enregistre un changement de producteur pour le projet lauréat
        Alors le porteur devrait être informé que "Impossible d'enregistrer le changement de producteur pour un projet achevé"
