# language: fr
@abandon
Fonctionnalité: Demander l'abandon d'un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et un cahier des charges permettant la modification du projet

    Plan du scénario: Un porteur demande l'abandon d'un projet lauréat
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offres | <Appel d'offre> |
            | période        | <Période>       |
        Et la dreal "Dreal du sud" associée à la région du projet
        Quand le porteur demande l'abandon pour le projet lauréat
        Alors l'abandon du projet lauréat devrait être demandé
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - Abandon demandé pour le projet Du boulodrome de Marseille .* |
            | nom_projet | Du boulodrome de Marseille                                               |
        Et un email a été envoyé à l'autorité instructrice avec :
            | sujet      | Potentiel - Abandon demandé pour le projet Du boulodrome de Marseille .* |
            | nom_projet | Du boulodrome de Marseille                                               |

        Exemples:
            | Appel d'offre            | Période |
            | PPE2 - Sol               | 8       |
            | PPE2 - Petit PV Bâtiment | 1       |

    Scénario: Un porteur demande l'abandon d'un projet lauréat après un rejet
        Etant donné un abandon rejeté pour le projet lauréat
        Quand le porteur demande l'abandon pour le projet lauréat
        Alors l'abandon du projet lauréat devrait être de nouveau demandé

    Scénario: Impossible de demander l'abandon d'un projet si l'abandon est déjà en cours (demandé)
        Etant donné une demande d'abandon en cours pour le projet lauréat
        Quand le porteur demande l'abandon pour le projet lauréat
        Alors le porteur devrait être informé que "Une demande d'abandon est déjà en cours"

    Scénario: Impossible de demander l'abandon d'un projet si l'abandon est déjà en cours (en instruction)
        Etant donné une demande d'abandon en instruction pour le projet lauréat
        Quand le porteur demande l'abandon pour le projet lauréat
        Alors le porteur devrait être informé que "Une demande d'abandon est déjà en cours"

    Scénario: Impossible de demander l'abandon d'un projet si l'abandon est accordé
        Etant donné un abandon accordé pour le projet lauréat
        Quand le porteur demande l'abandon pour le projet lauréat
        Alors le porteur devrait être informé que "L'abandon a déjà été accordé"

    Scénario: Impossible de demander l'abandon d'un projet achevé
        Etant donné une attestation de conformité transmise pour le projet lauréat
        Quand le porteur demande l'abandon pour le projet lauréat
        Alors le porteur devrait être informé que "Impossible de faire un changement pour un projet achevé"

    Scénario: Impossible de demander l'abandon d'un projet dont le cahier des charges ne le permet pas
        Etant donné le projet lauréat "Du bouchon lyonnais" avec :
            | appel d'offres | CRE4 - Autoconsommation métropole |
            | période        | 10                                |
        Quand le porteur demande l'abandon pour le projet lauréat
        Alors le porteur devrait être informé que "Le cahier des charges de ce projet ne permet pas ce changement"
