# language: fr
@puissance
Fonctionnalité: Supprimer la demande de changement de puissance

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offres | PPE2 - Eolien |
            | période        | 1             |

    Scénario: Le système supprime la demande de changement de puissance si le projet est abandonné
        Etant donné une demande de changement de puissance pour le projet lauréat avec :
            | ratio puissance | 0.75 |
        Et une demande d'abandon en cours pour le projet lauréat
        Quand le DGEC validateur accorde la demande d'abandon pour le projet lauréat
        Alors la demande de changement de puissance ne devrait plus être consultable
