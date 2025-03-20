# language: fr
@NotImplemented
Fonctionnalité: Enregistrer un changement de puissance d'un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et le porteur "Marcel Patoulatchi" ayant accés au projet lauréat "Du boulodrome de Marseille"
        Et la dreal "DREAL" associée à la région du projet

    # pour la fixture
    # pour la modification, la raison est optionnelle et il n'y a pas besoin de pièce justificative
    Scénario: Enregistrer un changement de puissance d'un projet lauréat
        Quand le porteur enregistre un changement de puissance pour le projet lauréat
        Alors la puissance du projet lauréat devrait être mis à jour
        Et le changement enregistré de la puissance devrait être consultable
        Et un email a été envoyé à la dreal avec :
            | sujet      | Potentiel - Enregistrement d'un changement de puissance pour le projet Du boulodrome de Marseille dans le département(.*) |
            | nom_projet | Du boulodrome de Marseille                                                                                                |
            | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                                     |

    Scénario: Enregistrer un changement de puissance avec une valeur identique
        Quand le porteur enregistre un changement de puissance avec la même valeur pour le projet lauréat
        Alors le changement enregistré de la puissance devrait être consultable

    Scénario: Impossible d'enregistrer un changement de puissance si la puissance est inexistant
        Etant donné le projet éliminé "Du boulodrome de Lyon"
        Quand le porteur enregistre un changement de puissance pour le projet éliminé
        Alors l'utilisateur devrait être informé que "la puissance n'existe pas"

    Scénario: Impossible d'enregistrer un changement de puissance alors qu'un changement de puissance est en cours
        Etant donné une demande de changement de puissance en cours pour le projet lauréat
        Quand le porteur enregistre un changement de puissance pour le projet lauréat
        Alors l'utilisateur devrait être informé que "Une demande de changement est déjà en cours"

    Scénario: Impossible pour le porteur de modifier la puissance d'un projet lauréat abandonné
        Etant donné un abandon accordé pour le projet lauréat
        Quand le porteur enregistre un changement de puissance pour le projet lauréat
        Alors le porteur devrait être informé que "Impossible de demander le changement de puissance pour un projet abandonné"

    Scénario: Impossible pour le porteur de modifier la puissance si une demande d'abandon est en cours
        Etant donné une demande d'abandon en cours pour le projet lauréat
        Quand le porteur enregistre un changement de puissance pour le projet lauréat
        Alors le porteur devrait être informé que "Impossible de demander le changement de puissance car une demande d'abandon est en cours pour le projet"

    Scénario: Impossible pour le porteur de modifier la puissance d'un projet achevé
        Etant donné une attestation de conformité transmise pour le projet lauréat
        Quand le porteur enregistre un changement de puissance pour le projet lauréat
        Alors le porteur devrait être informé que "Impossible de demander le changement de puissance pour un projet achevé"

    Scénario: Impossible pour le porteur de modifier la puissance d'un projet si la nouvelle puissance est inférieure au ratio min
        Etant donné le projet lauréat "Du bouchon de Lyon le retour" avec :
            | appel d'offre   | <Appel d'offre> |
            | ratio puissance | <Ratio>         |
        Quand le porteur enregistre un changement de puissance pour le projet lauréat
        Alors le porteur devrait être informé que "Impossible de modifier directement la puissance dans ces conditions"

        Exemples:
            | Appel d'offre     | Ratio |
            | PPE2 - Eolien     | 0.75  |
            | CRE4 - Bâtiment   | 0.85  |
            | CRE4 - Innovation | 0.65  |

    Scénario: Impossible pour le porteur de modifier la puissance d'un projet si la nouvelle puissance est supérieure au ratio max
        Etant donné le projet lauréat "Du bouchon de Lyon" avec :
            | appel d'offre   | <Appel d'offre> |
            | ratio puissance | <Ratio>         |
        Quand le porteur enregistre un changement de puissance pour le projet lauréat
        Alors le porteur devrait être informé que "Impossible de modifier directement la puissance dans ces conditions"

        Exemples:
            | Appel d'offre     | Ratio |
            | PPE2 - Eolien     | 1.25  |
            | CRE4 - Bâtiment   | 1.55  |
            | CRE4 - Innovation | 1.15  |
