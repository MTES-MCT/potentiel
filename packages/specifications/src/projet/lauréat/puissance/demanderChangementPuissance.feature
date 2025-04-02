# language: fr
@select
Fonctionnalité: Demander le changement de puissance d'un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et le porteur "Marcel Patoulatchi" ayant accés au projet lauréat "Du boulodrome de Marseille"
        Et la dreal "Dreal du sud" associée à la région du projet

    #ajouter notification
    Scénario: Demander le changement de puissance d'un projet lauréat avec un ratio à la baisse
        Quand le porteur demande le changement de puissance à la baisse pour le projet lauréat
        Alors la demande de changement de puissance devrait être consultable avec la dreal en autorité compétente

    #ajouter notification
    Scénario: Demander le changement de puissance d'un projet lauréat avec un ratio à la hausse
        Quand le porteur demande le changement de puissance à la hausse pour le projet lauréat
        Alors la demande de changement de puissance devrait être consultable avec la dgec en autorité compétente

    Scénario: Impossible de demander le changement de puissance si la puissance est inexistante
        Etant donné le projet éliminé "Du boulodrome de Lyon"
        Quand le porteur demande le changement de puissance à la baisse pour le projet éliminé
        Alors l'utilisateur devrait être informé que "La puissance n'existe pas"

    Scénario: Impossible de demander le changement de puissance d'un projet lauréat avec une valeur identique
        Quand le porteur demande le changement de puissance avec la même valeur pour le projet lauréat
        Alors l'utilisateur devrait être informé que "La puissance doit avoir une valeur différente"

    Scénario: Impossible de demander le changement de puissance si la nouvelle valeur est nulle ou négative
        Quand le porteur demande le changement de puissance pour le projet lauréat avec :
            | ratio puissance | <Ratio> |
        Alors l'utilisateur devrait être informé que "La puissance d'un projet doit être une valeur positive"

        Exemples:
            | Ratio |
            | 0     |
            | -1    |

    @NotImplemented
    Scénario: Impossible de demander le changement de puissance si la nouvelle puissance dépasse la puissance max par famille
        Quand le porteur demande le changement de puissance pour le projet lauréat avec :
            | nouvelle puissance |  |
            | appel d'offre      |  |
            | période            |  |
            | famille            |  |

        Alors l'utilisateur devrait être informé que "La puissance dépasse la puissance maximale de la famille de votre appel d'offre"

    @NotImplemented
    Scénario: Impossible de demander le changement de puissance si la nouvelle puissance dépasse le volume réservé de l'appel d'offre
        Quand le porteur demande le changement de puissance pour le projet lauréat avec :
            | nouvelle puissance |  |
            | appel d'offre      |  |
        Alors l'utilisateur devrait être informé que "La puissance dépasse le volume réservé de votre appel d'offre"

    Scénario: Impossible de demander le changement de puissance si une demande existe déjà
        Etant donné une demande de changement de puissance à la baisse pour le projet lauréat
        Quand le porteur demande le changement de puissance à la baisse pour le projet lauréat
        Alors l'utilisateur devrait être informé que "Une demande de changement est déjà en cours"

    Scénario: Impossible de demander le changement de puissance d'un projet lauréat abandonné
        Etant donné un abandon accordé pour le projet lauréat
        Quand le porteur demande le changement de puissance à la baisse pour le projet lauréat
        Alors le porteur devrait être informé que "Impossible de demander le changement de puissance pour un projet abandonné"

    Scénario: Impossible de demander le changement de puissance si une demande d'abandon est en cours
        Etant donné une demande d'abandon en cours pour le projet lauréat
        Quand le porteur demande le changement de puissance à la baisse pour le projet lauréat
        Alors le porteur devrait être informé que "Impossible de demander le changement de puissance car une demande d'abandon est en cours pour le projet"

    Scénario: Impossible de demander le changement de puissance d'un projet achevé
        Etant donné une attestation de conformité transmise pour le projet lauréat
        Quand le porteur demande le changement de puissance à la baisse pour le projet lauréat
        Alors le porteur devrait être informé que "Impossible de demander le changement de puissance pour un projet achevé"
