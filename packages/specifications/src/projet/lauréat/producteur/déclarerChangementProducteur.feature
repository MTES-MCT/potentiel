# language: fr
Fonctionnalité: Déclarer un changement de producteur d'un projet lauréat

    @NotImplemented
    Scénario: Déclarer un changement de producteur d'un projet lauréat
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Quand le porteur déclare un changement de producteur pour le projet lauréat
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
    Scénario: Impossible de déclarer un changement de producteur d'un projet lauréat si l'appel d'offre empêche un changement avant l'achèvement du projet
        Etant donné le projet lauréat "Du boulodrome de Bordeaux" avec :
            | appel d'offre | Eolien |
            | période       | 1      |
        Quand le porteur déclare un changement de producteur pour le projet lauréat
        Alors le porteur devrait être informé que "L'appel d'offre du projet empêche un changement de producteur avant l'achèvement du projet"

    @NotImplemented
    Scénario: Impossible de déclarer un changement de producteur d'un projet lauréat avec un producteur identique
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Quand le porteur déclare un changement de producteur avec un producteur identique pour le projet lauréat
        Alors le porteur devrait être informé que "Le nouveau producteur est identique à celui associé au projet"

    @NotImplemented
    Scénario: Impossible de déclarer un changement de producteur d'un projet lauréat abandonné
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et un abandon accordé pour le projet lauréat
        Quand le porteur déclare un changement de producteur pour le projet lauréat
        Alors le porteur devrait être informé que "Impossible de déclarer un changement de producteur pour un projet abandonné"

    Scénario: Impossible de déclarer un changement de producteur d'un projet lauréat si une demande d'abandon est en cours
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et une demande d'abandon en cours pour le projet lauréat
        Quand le porteur déclare un changement de producteur pour le projet lauréat
        Alors le porteur devrait être informé que "Impossiblede de déclarer un changement de producteur car une demande d'abandon est en cours pour le projet"

    Scénario: Impossible de déclarer le changement de producteur d'un projet achevé
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et une attestation de conformité transmise pour le projet lauréat
        Quand le porteur déclare un changement de producteur pour le projet lauréat
        Alors le porteur devrait être informé que "Impossible de déclarer le changement de producteur pour un projet achevé"
