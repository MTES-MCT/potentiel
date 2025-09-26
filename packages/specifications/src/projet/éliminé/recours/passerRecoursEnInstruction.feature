# language: fr
@recours
Fonctionnalité: Passer le recours d'un projet éliminé en instruction

    Contexte:
        Etant donné le projet éliminé "Du boulodrome de Marseille" avec :
            | appel d'offres | PPE2 - ZNI |

    Scénario: Un administrateur passe le recours d'un projet éliminé en instruction
        Etant donné une demande de recours en cours pour le projet éliminé
        Quand l'administrateur passe en instruction le recours pour le projet éliminé
        Alors la demande de recours du projet éliminé devrait être en instruction
        Et un email a été envoyé au porteur avec :
            | sujet        | Potentiel - La demande de recours pour le projet Du boulodrome de Marseille est en instruction |
            | nom_projet   | Du boulodrome de Marseille                                                                     |
            | redirect_url | https://potentiel.beta.gouv.fr/elimine/.*/recours                                              |

    Scénario: Un administrateur reprend l'instruction du recours du projet éliminé
        Etant donné une demande de recours en instruction pour le projet éliminé
        Quand un nouvel administrateur passe en instruction le recours pour le projet éliminé
        Alors la demande de recours du projet éliminé devrait être en instruction

    Scénario: Impossible de passer le recours d'un projet éliminé en instruction si le recours a déjà été accordé
        Etant donné un recours accordé pour le projet éliminé
        Quand l'administrateur passe en instruction le recours pour le projet éliminé
        Alors le DGEC validateur devrait être informé que "Le recours a déjà été accordé"

    Scénario: Impossible de passer le recours d'un projet éliminé en instruction si le recours a déjà été rejeté
        Etant donné un recours rejeté pour le projet éliminé
        Quand l'administrateur passe en instruction le recours pour le projet éliminé
        Alors le DGEC validateur devrait être informé que "Le recours a déjà été rejeté"

    Scénario: Impossible de passer le recours d'un projet éliminé en instruction si aucun recours n'a été demandé
        Quand l'administrateur passe en instruction le recours pour le projet éliminé
        Alors le DGEC validateur devrait être informé que "Aucun recours n'est en cours"

    Scénario: Impossible de reprendre le recours d'un projet éliminé en instruction si on instruit déjà le recours
        Etant donné une demande de recours en instruction pour le projet éliminé
        Quand le même administrateur passe en instruction le recours pour le projet éliminé
        Alors le DGEC validateur devrait être informé que "Le recours est déjà en instruction avec le même administrateur"
