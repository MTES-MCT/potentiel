# language: fr
@puissance
Fonctionnalité: Demander le changement de puissance d'un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offres | PPE2 - Eolien |
            | période        | 1             |
        Et la dreal "Dreal du sud" associée à la région du projet

    Scénario: Demander le changement de puissance d'un projet lauréat avec un ratio à la baisse
        Quand le porteur demande le changement de puissance pour le projet lauréat avec :
            | ratio puissance | 0.75 |
        Alors la demande de changement de puissance devrait être consultable
        Et un email a été envoyé à la dreal avec :
            | sujet      | Potentiel - Demande de changement de puissance pour le projet Du boulodrome de Marseille dans le département(.*) |
            | nom_projet | Du boulodrome de Marseille                                                                                       |
            | url        | https://potentiel.beta.gouv.fr/laureats/.*/puissance/changement/.*                                               |

    Scénario: Demander le changement de puissance d'un projet lauréat avec un ratio à la hausse
        Quand le porteur demande le changement de puissance pour le projet lauréat avec :
            | ratio puissance | 1.25 |
        Alors la demande de changement de puissance devrait être consultable
        Et un email a été envoyé à la dreal avec :
            | sujet      | Potentiel - Demande de changement de puissance pour le projet Du boulodrome de Marseille dans le département(.*) |
            | nom_projet | Du boulodrome de Marseille                                                                                       |
            | url        | https://potentiel.beta.gouv.fr/laureats/.*/puissance/changement/.*                                               |
        Et un email a été envoyé à la dgec avec :
            | sujet      | Potentiel - Demande de changement de puissance pour le projet Du boulodrome de Marseille dans le département(.*) |
            | nom_projet | Du boulodrome de Marseille                                                                                       |
            | url        | https://potentiel.beta.gouv.fr/laureats/.*/puissance/changement/.*                                               |

    Scénario: Demander le changement de puissance d'un projet lauréat dont le cahier des charges initial ne le permet pas, suite à un choix de cahier des charges modificatif
        Etant donné le projet lauréat legacy "Du bouchon lyonnais" avec :
            | appel d'offres | CRE4 - Sol |
            | période        | 1          |
        Et la dreal "Dreal du sud" associée à la région du projet
        Et un cahier des charges permettant la modification du projet
        Quand le porteur demande le changement de puissance pour le projet lauréat avec :
            | ratio puissance | 0.75 |
        Alors la demande de changement de puissance devrait être consultable

    Scénario: Impossible de demander le changement de puissance si la puissance est inexistante
        Etant donné le projet éliminé "Du boulodrome de Lyon"
        Quand le porteur demande le changement de puissance pour le projet éliminé avec :
            | ratio puissance | 0.75 |
        Alors l'utilisateur devrait être informé que "Le projet lauréat n'existe pas"

    Scénario: Impossible de demander le changement de puissance d'un projet lauréat avec une valeur identique
        Quand le porteur demande le changement de puissance pour le projet lauréat avec :
            | ratio puissance | 1 |
        Alors l'utilisateur devrait être informé que "La puissance doit avoir une valeur différente"

    Scénario: Impossible de demander le changement de puissance si la nouvelle valeur est nulle ou négative
        Quand le porteur demande le changement de puissance pour le projet lauréat avec :
            | ratio puissance | <Ratio> |
        Alors l'utilisateur devrait être informé que "La puissance d'un projet doit être une valeur positive"

        Exemples:
            | Ratio |
            | 0     |
            | -1    |

    Scénario: Impossible pour le porteur d'enregistrer un changement de puissance si elle dépasse la puissance max par famille
        Etant donné le projet lauréat "Du bouchon lyonnais" avec :
            | appel d'offres | PPE2 - Innovation |
            | période        | 1                 |
            | famille        | 1                 |
        Quand le porteur demande le changement de puissance pour le projet lauréat avec :
            | nouvelle puissance | 3.1 |
        Alors l'utilisateur devrait être informé que "La nouvelle puissance ne peut pas dépasser la puissance maximale de la famille de l'appel d'offres"

    Scénario: Impossible pour le porteur de demander un changement de puissance si elle dépasse le volume réservé de l'appel d'offre
        Etant donné le projet lauréat "Du bouchon lyonnais" avec :
            | appel d'offres | PPE2 - Sol |
            | période        | 3          |
            | note totale    | 34         |
        Quand le porteur demande le changement de puissance pour le projet lauréat avec :
            | nouvelle puissance | 6 |
        Alors l'utilisateur devrait être informé que "La nouvelle puissance ne peut pas dépasser la puissance maximale du volume réservé"

    Scénario: Impossible de demander le changement de puissance si une demande existe déjà
        Etant donné une demande de changement de puissance pour le projet lauréat avec :
            | ratio puissance | 0.95 |
        Quand le porteur demande le changement de puissance pour le projet lauréat avec :
            | ratio puissance | 1.25 |
        Alors l'utilisateur devrait être informé que "Une demande de changement est déjà en cours"

    Scénario: Impossible de demander le changement de puissance d'un projet lauréat abandonné
        Etant donné un abandon accordé pour le projet lauréat
        Quand le porteur demande le changement de puissance pour le projet lauréat avec :
            | ratio puissance | 1.25 |
        Alors le porteur devrait être informé que "Impossible de faire un changement pour un projet abandonné"

    Scénario: Impossible de demander le changement de puissance si une demande d'abandon est en cours
        Etant donné une demande d'abandon en cours pour le projet lauréat
        Quand le porteur demande le changement de puissance pour le projet lauréat avec :
            | ratio puissance | 1.25 |
        Alors le porteur devrait être informé que "Impossible de faire un changement car une demande d'abandon est en cours pour le projet"

    Scénario: Impossible de demander le changement de puissance d'un projet achevé
        Etant donné une attestation de conformité transmise pour le projet lauréat
        Quand le porteur demande le changement de puissance pour le projet lauréat avec :
            | ratio puissance | 1.25 |
        Alors le porteur devrait être informé que "Impossible de faire un changement pour un projet achevé"

    Scénario: Impossible de demander le changement de puissance d'un projet lauréat dont le cahier des charges ne le permet pas
        Etant donné le projet lauréat legacy "Du bouchon lyonnais" avec :
            | appel d'offres | CRE4 - Sol |
            | période        | 1          |
        Quand le porteur demande le changement de puissance pour le projet lauréat avec :
            | ratio puissance | 0.75 |
        Alors le porteur devrait être informé que "Le cahier des charges de ce projet ne permet pas ce changement"
