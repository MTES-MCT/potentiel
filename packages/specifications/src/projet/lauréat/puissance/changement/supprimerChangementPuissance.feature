# language: fr
Fonctionnalité: Supprimer la demande de changement de puissance

    Contexte:
        # on est obligés de cibler un AO et une période spécifique pour simplifier les fixtures
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offre | PPE2 - Eolien |
            | période       | 1             |
        Et le porteur "Marcel Patoulatchi" ayant accés au projet lauréat "Du boulodrome de Marseille"

    Scénario: Le système supprime la demande de changement de puissance si le projet est abandonné
        Etant donné une demande de changement de puissance à la baisse pour le projet lauréat
        Et une demande d'abandon en cours pour le projet lauréat
        Quand le DGEC validateur accorde l'abandon pour le projet lauréat
        Alors la demande de changement de puissance ne devrait plus être consultable
