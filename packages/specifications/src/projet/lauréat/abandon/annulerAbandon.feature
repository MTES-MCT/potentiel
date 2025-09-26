# language: fr
@abandon
Fonctionnalité: Annuler l'abandon d'un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et un cahier des charges permettant la modification du projet

    Plan du scénario: Un porteur annule l'abandon d'un projet lauréat
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offres | <Appel d'offre> |
            | période        | <Période>       |
        Et la dreal "Dreal du sud" associée à la région du projet
        Et une demande d'abandon en cours pour le projet lauréat
        Quand le porteur annule l'abandon pour le projet lauréat
        Alors l'abandon du projet lauréat ne devrait plus exister
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - Demande d'abandon annulée pour le projet Du boulodrome de Marseille .* |
            | nom_projet | Du boulodrome de Marseille                                                         |
        Et un email a été envoyé à l'autorité instructrice avec :
            | sujet      | Potentiel - Demande d'abandon annulée pour le projet Du boulodrome de Marseille .* |
            | nom_projet | Du boulodrome de Marseille                                                         |

        Exemples:
            | Appel d'offre            | Période |
            | PPE2 - Sol               | 8       |
            | PPE2 - Petit PV Bâtiment | 1       |

    Scénario: Un porteur annule l'abandon en instruction d'un projet lauréat
        Etant donné une demande d'abandon en instruction pour le projet lauréat
        Quand le porteur annule l'abandon pour le projet lauréat
        Alors l'abandon du projet lauréat ne devrait plus exister

    Scénario: Impossible d'annuler l'abandon d'un projet lauréat si l'abandon a déjà été accordé
        Etant donné un abandon accordé pour le projet lauréat
        Quand le porteur annule l'abandon pour le projet lauréat
        Alors le porteur devrait être informé que "L'abandon a déjà été accordé"

    Scénario: Impossible d'annuler l'abandon d'un projet lauréat si aucun abandon n'a été demandé
        Quand le porteur annule l'abandon pour le projet lauréat
        Alors le porteur devrait être informé que "Aucun abandon n'est en cours"

    Scénario: Impossible d'annuler l'abandon d'un projet lauréat si l'abandon a déjà été rejeté
        Etant donné un abandon rejeté pour le projet lauréat
        Quand le porteur annule l'abandon pour le projet lauréat
        Alors le porteur devrait être informé que "L'abandon a déjà été rejeté"

    Scénario: Impossible d'annuler l'abandon d'un projet lauréat si l'abandon a déjà été confirmé
        Etant donné un abandon confirmé pour le projet lauréat
        Quand le porteur annule l'abandon pour le projet lauréat
        Alors le porteur devrait être informé que "L'abandon a déjà été confirmé"
