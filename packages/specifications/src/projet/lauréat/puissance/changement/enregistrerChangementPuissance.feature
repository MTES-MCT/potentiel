# language: fr
Fonctionnalité: Enregistrer un changement de puissance d'un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offre | PPE2 - Eolien |
            | période       | 1             |
        Et la dreal "Dreal du sud" associée à la région du projet

    Scénario: Enregistrer un changement de puissance d'un projet lauréat
        Quand le porteur enregistre un changement de puissance pour le projet lauréat avec :
            | ratio puissance | 0.95 |
        Alors la puissance du projet lauréat devrait être mise à jour
        Et le changement enregistré de puissance devrait être consultable
        Et un email a été envoyé à la dreal avec :
            | sujet      | Potentiel - Enregistrement d'un changement de puissance pour le projet Du boulodrome de Marseille dans le département(.*) |
            | nom_projet | Du boulodrome de Marseille                                                                                                |
            | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                                     |

    Scénario: Impossible de demander le changement de puissance d'un projet lauréat avec une valeur identique
        Quand le porteur enregistre un changement de puissance pour le projet lauréat avec :
            | ratio puissance | 1 |
        Alors l'utilisateur devrait être informé que "La puissance doit avoir une valeur différente"

    Scénario: Impossible d'enregistrer un changement de puissance si la puissance est inexistant
        Etant donné le projet éliminé "Du boulodrome lyonnais"
        Quand le porteur enregistre un changement de puissance pour le projet éliminé avec :
            | ratio puissance | 0.95 |
        Alors l'utilisateur devrait être informé que "La puissance n'existe pas"

    Scénario: Impossible d'enregistrer un changement de puissance alors qu'un changement de puissance est en cours
        Etant donné une demande de changement de puissance pour le projet lauréat avec :
            | ratio puissance | 0.75 |
        Quand le porteur enregistre un changement de puissance pour le projet lauréat avec :
            | ratio puissance | 0.95 |
        Alors l'utilisateur devrait être informé que "Une demande de changement est déjà en cours"

    Scénario: Impossible pour le porteur d'enregistrer un changement de puissance d'un projet lauréat abandonné
        Etant donné un abandon accordé pour le projet lauréat
        Quand le porteur enregistre un changement de puissance pour le projet lauréat avec :
            | ratio puissance | 0.95 |
        Alors le porteur devrait être informé que "Impossible de demander le changement de puissance pour un projet abandonné"

    Scénario: Impossible pour le porteur d'enregistrer un changement de puissance si une demande d'abandon est en cours
        Etant donné une demande d'abandon en cours pour le projet lauréat
        Quand le porteur enregistre un changement de puissance pour le projet lauréat avec :
            | ratio puissance | 0.95 |
        Alors le porteur devrait être informé que "Impossible de demander le changement de puissance car une demande d'abandon est en cours pour le projet"

    Scénario: Impossible pour le porteur d'enregistrer un changement de puissance d'un projet achevé
        Etant donné une attestation de conformité transmise pour le projet lauréat
        Quand le porteur enregistre un changement de puissance pour le projet lauréat avec :
            | ratio puissance | 0.95 |
        Alors le porteur devrait être informé que "Impossible de demander le changement de puissance pour un projet achevé"

    Scénario: Impossible pour le porteur d'enregistrer un changement de puissance si elle est inférieure au ratio min autorisé par l'appel d'offres
        Etant donné le projet lauréat "Du bouchon lyonnais" avec :
            | appel d'offre | <Appel d'offre> |
            | période       | <Période>       |
        Quand le porteur enregistre un changement de puissance pour le projet lauréat avec :
            | ratio puissance | <Ratio> |
        Alors le porteur devrait être informé que "La puissance est en deça de la puissance minimale autorisée par l'appel d'offres"

        Exemples:
            | Appel d'offre | Période | Ratio |
            | PPE2 - Eolien | 1       | 0.75  |
            | CRE4 - Sol    | 7       | 0.85  |

    Scénario: Impossible pour le porteur d'enregistrer un changement de puissance si elle est supérieure au ratio max autorisé par l'appel d'offres
        Etant donné le projet lauréat "Du bouchon lyonnais" avec :
            | appel d'offre | <Appel d'offre> |
            | période       | <Période>       |
        Quand le porteur enregistre un changement de puissance pour le projet lauréat avec :
            | ratio puissance | <Ratio> |
        Alors le porteur devrait être informé que "La puissance dépasse la puissance maximale autorisée par l'appel d'offres"

        Exemples:
            | Appel d'offre | Période | Ratio |
            | PPE2 - Eolien | 1       | 1.25  |
            | CRE4 - Sol    | 7       | 1.15  |

    Scénario: Impossible pour le porteur d'enregistrer un changement de puissance si elle dépasse la puissance max par famille
        Etant donné le projet lauréat "Du bouchon lyonnais" avec :
            | appel d'offre | PPE2 - Innovation |
            | période       | 1                 |
            | famille       | 1                 |
        Quand le porteur enregistre un changement de puissance pour le projet lauréat avec :
            | nouvelle puissance | 3.1 |
        Alors l'utilisateur devrait être informé que "La puissance dépasse la puissance maximale de la famille de l'appel d'offre"

    Scénario: Scénario: Impossible pour le porteur d'enregistrer un changement de puissance si elle dépasse le volume réservé de l'appel d'offre
        Etant donné le projet lauréat "Du bouchon lyonnais" avec :
            | appel d'offre | PPE2 - Sol |
            | période       | 3          |
            | note totale   | 34         |
        Quand le porteur enregistre un changement de puissance pour le projet lauréat avec :
            | nouvelle puissance | 6 |
        Alors l'utilisateur devrait être informé que "La puissance dépasse le volume réservé de l'appel d'offre"
