# language: fr
@recours
Fonctionnalité: Annuler le recours d'un projet éliminé

    Contexte:
        Etant donné le projet éliminé legacy "Du boulodrome de Marseille" avec :
            | appel d'offres | PPE2 - Neutre |

    Scénario: Un porteur annule le recours d'un projet éliminé
        Etant donné une demande de recours en cours pour le projet éliminé
        Quand le porteur annule le recours pour le projet éliminé
        Alors le recours du projet éliminé ne devrait plus exister
        Et un email a été envoyé à la dgec avec :
            | sujet      | Potentiel - Demande de recours annulée pour le projet Du boulodrome de Marseille .* |
            | nom_projet | Du boulodrome de Marseille                                                          |
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - Demande de recours annulée pour le projet Du boulodrome de Marseille .* |
            | nom_projet | Du boulodrome de Marseille                                                          |

    Scénario: Un porteur annule le recours en instruction d'un projet éliminé
        Etant donné une demande de recours en instruction pour le projet éliminé
        Quand le porteur annule le recours pour le projet éliminé
        Alors le recours du projet éliminé ne devrait plus exister

    Scénario: Impossible d'annuler le recours d'un projet éliminé si le recours a déjà été accordé
        Etant donné un recours accordé pour le projet éliminé
        Quand le porteur annule le recours pour le projet éliminé
        Alors le porteur devrait être informé que "Le recours a déjà été accordé"

    Scénario: Impossible d'annuler le recours d'un projet éliminé si aucun recours n'a été demandé
        Quand le porteur annule le recours pour le projet éliminé
        Alors le porteur devrait être informé que "Aucun recours n'est en cours"

    Scénario: Impossible d'annuler le recours d'un projet éliminé si le recours a déjà été rejeté
        Etant donné un recours rejeté pour le projet éliminé
        Quand le porteur annule le recours pour le projet éliminé
        Alors le porteur devrait être informé que "Le recours a déjà été rejeté"
