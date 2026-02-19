# language: fr
@puissance
Fonctionnalité: Annuler la demande de changement de puissance d'un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offres | PPE2 - Eolien |
            | période        | 1             |
        Et la dreal "Dreal du sud" associée à la région du projet

    Scénario: Annuler la demande de changement de puissance à la baisse d'un projet lauréat
        Etant donné une demande de changement de puissance pour le projet lauréat avec :
            | ratio puissance | 0.75 |
        Quand le porteur annule la demande de changement de puissance pour le projet lauréat
        Alors la demande de changement de la puissance devrait être annulée
        Et un email a été envoyé à la dreal avec :
            | sujet      | Potentiel - La demande de changement de puissance pour le projet Du boulodrome de Marseille dans le département(.*) a été annulée |
            | nom_projet | Du boulodrome de Marseille                                                                                                        |
            | url        | https://potentiel.beta.gouv.fr/laureats/.*                                                                                        |

    Scénario: Annuler la demande de changement de puissance à la hause d'un projet lauréat
        Etant donné une demande de changement de puissance pour le projet lauréat avec :
            | ratio puissance | 1.41 |
        Quand le porteur annule la demande de changement de puissance pour le projet lauréat
        Alors la demande de changement de la puissance devrait être annulée
        Et un email a été envoyé à la dreal avec :
            | sujet      | Potentiel - La demande de changement de puissance pour le projet Du boulodrome de Marseille dans le département(.*) a été annulée |
            | nom_projet | Du boulodrome de Marseille                                                                                                        |
            | url        | https://potentiel.beta.gouv.fr/laureats/.*                                                                                        |

    Scénario: Impossible d'annuler la demande de changement de puissance si la demande est inexistante
        Quand le porteur annule la demande de changement de puissance pour le projet lauréat
        Alors l'utilisateur devrait être informé que "Aucune demande de changement de puissance n'est en cours"

    Scénario: Impossible d'annuler la demande de changement de puissance si la demande est acceptée
        Etant donné une demande de changement de puissance accordée pour le projet lauréat avec :
            | ratio puissance | 0.75 |
        Quand le porteur annule la demande de changement de puissance pour le projet lauréat
        Alors l'utilisateur devrait être informé que "Aucune demande de changement de puissance n'est en cours"

    Scénario: Impossible d'annuler la demande de changement de puissance si la demande est rejetée
        Etant donné une demande de changement de puissance rejetée pour le projet lauréat
            | ratio puissance | 0.75 |
        Quand le porteur annule la demande de changement de puissance pour le projet lauréat
        Alors l'utilisateur devrait être informé que "Aucune demande de changement de puissance n'est en cours"
