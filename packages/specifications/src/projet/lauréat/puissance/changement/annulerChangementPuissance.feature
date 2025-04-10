# language: fr
Fonctionnalité: Annuler la demande changement de puissance d'un projet lauréat

    Contexte:
        # on est obligés de cibler un AO et une période spécifique pour simplifier les fixtures
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offre | PPE2 - Eolien |
            | période       | 1             |
        Et le porteur "Marcel Patoulatchi" ayant accés au projet lauréat "Du boulodrome de Marseille"
        Et la dreal "Dreal du sud" associée à la région du projet

    Scénario: Annuler la demande de changement de puissance d'un projet lauréat
        Etant donné une demande de changement de puissance à la baisse pour le projet lauréat
        Quand le porteur annule la demande de changement de puissance pour le projet lauréat
        Alors la demande de changement de puissance ne devrait plus être consultable
        Et un email a été envoyé à la dreal avec :
            | sujet      | Potentiel - La demande de changement de puissance pour le projet Du boulodrome de Marseille dans le département(.*) a été annulée |
            | nom_projet | Du boulodrome de Marseille                                                                                                        |
            | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                                             |

    Scénario: Impossible d'annuler la demande de changement de puissance si la demande est inexistante
        Quand le porteur annule la demande de changement de puissance pour le projet lauréat
        Alors l'utilisateur devrait être informé que "Aucune demande de changement de puissance n'est en cours"

    Scénario: Impossible d'annuler la demande de changement de puissance si la demande est acceptée
        Etant donné une demande de changement de puissance à la baisse accordée pour le projet lauréat
        Quand le porteur annule la demande de changement de puissance pour le projet lauréat
        Alors l'utilisateur devrait être informé que "Aucune demande de changement de puissance n'est en cours"

    Scénario: Impossible d'annuler la demande de changement de puissance si la demande est rejetée
        Etant donné une demande de changement de puissance à la baisse rejetée pour le projet lauréat
        Quand le porteur annule la demande de changement de puissance pour le projet lauréat
        Alors l'utilisateur devrait être informé que "Aucune demande de changement de puissance n'est en cours"
