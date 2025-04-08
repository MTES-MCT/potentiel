# language: fr
Fonctionnalité: Modifier la puissance d'un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et le porteur "Marcel Patoulatchi" ayant accés au projet lauréat "Du boulodrome de Marseille"

    # TODO: notifications
    Scénario: Modifier la puissance d'un projet lauréat par un admin
        Quand le DGEC validateur modifie la puissance pour le projet lauréat
        Alors la puissance du projet lauréat devrait être mise à jour

    # TODO: notifications
    Scénario: Modifier la puissance d'un projet lauréat abandonné par un admin
        Etant donné un abandon accordé pour le projet lauréat
        Quand le DGEC validateur modifie la puissance pour le projet lauréat
        Alors la puissance du projet lauréat devrait être mise à jour

    # TODO: notifications
    Scénario: Modifier la puissance d'un projet lauréat achevé par un admin
        Etant donné une attestation de conformité transmise pour le projet lauréat
        Quand le DGEC validateur modifie la puissance pour le projet lauréat
        Alors la puissance du projet lauréat devrait être mise à jour

    Scénario: Impossible de modifier la puissance avec une valeur identique
        Quand le DGEC validateur modifie la puissance avec la même valeur pour le projet lauréat
        Alors l'utilisateur devrait être informé que "La puissance doit avoir une valeur différente"

    Scénario: Impossible de modifier la puissance si la nouvelle valeur est nulle ou négative
        Quand le DGEC validateur modifie la puissance pour le projet lauréat avec :
            | ratio puissance | <Ratio> |
        Alors l'utilisateur devrait être informé que "La puissance d'un projet doit être une valeur positive"

        Exemples:
            | Ratio |
            | 0     |
            | -1    |

    Scénario: Impossible de modifier la puissance si la puissance est inexistante
        Etant donné le projet éliminé "Du boulodrome de Lyon"
        Quand le DGEC validateur modifie la puissance pour le projet éliminé
        Alors l'utilisateur devrait être informé que "La puissance n'existe pas"

    Scénario: Impossible de modifier la puissance d'un projet lauréat alors qu'un changement de puissance est en cours
        Etant donné une demande de changement de puissance à la baisse pour le projet lauréat
        Quand le DGEC validateur modifie la puissance pour le projet lauréat
        Alors l'utilisateur devrait être informé que "Une demande de changement de puissance est déjà en cours"
