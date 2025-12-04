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

    Scénario: Demander le changement de puissance et de puissance de site, en modifiant ou non la puissance, d'un projet lauréat pour un projet dont l'AO
        Etant donné le projet lauréat "Du bouchon lyonnais" avec :
            | appel d'offres | PPE2 - Petit PV Bâtiment |
        Et la dreal "Dreal du rhône" associée à la région du projet
        Quand le porteur demande le changement de puissance pour le projet lauréat avec :
            | puissance de site | 1   |
            | ratio puissance   | 1.2 |
        Alors la demande de changement de puissance devrait être consultable
        Et un email a été envoyé à la dreal avec :
            | sujet      | Potentiel - Demande de changement de puissance pour le projet Du bouchon lyonnais dans le département(.*) |
            | nom_projet | Du bouchon lyonnais                                                                                       |
            | url        | https://potentiel.beta.gouv.fr/laureats/.*/puissance/changement/.*                                        |

    Scénario: Demander le changement de puissance d'un projet lauréat dont le cahier des charges initial ne le permet pas, suite à un choix de cahier des charges modificatif
        Etant donné le projet lauréat legacy "Du bouchon lyonnais" avec :
            | appel d'offres | CRE4 - Sol |
            | période        | 1          |
        Et la dreal "Dreal du sud" associée à la région du projet
        Et un cahier des charges permettant la modification du projet
        Quand le porteur demande le changement de puissance pour le projet lauréat avec :
            | ratio puissance | 0.75 |
        Alors la demande de changement de puissance devrait être consultable

    Scénario: Impossible de demander le changement de puissance si une demande existe déjà
        Etant donné une demande de changement de puissance pour le projet lauréat avec :
            | ratio puissance | 0.95 |
        Quand le porteur demande le changement de puissance pour le projet lauréat avec :
            | ratio puissance | 1.25 |
        Alors l'utilisateur devrait être informé que "Une demande de changement est déjà en cours"

    Scénario: Impossible de demander le changement de puissance d'un projet lauréat abandonné
        Etant donné une demande d'abandon accordée pour le projet lauréat
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

    # Règles spécifiques ratio
    Scénario: Impossible de demander le changement de puissance d'un projet lauréat avec une valeur identique
        Quand le porteur demande le changement de puissance pour le projet lauréat avec :
            | ratio puissance | 1 |
        Alors l'utilisateur devrait être informé que "La puissance doit avoir une valeur différente"

    Scénario: Impossible de demander le changement de puissance avec une valeur nulle ou négative
        Quand le porteur demande le changement de puissance pour le projet lauréat avec :
            | ratio puissance | <Ratio> |
        Alors l'utilisateur devrait être informé que "La puissance d'un projet doit avoir une valeur positive"

        Exemples:
            | Ratio |
            | 0     |
            | -1    |

    Scénario: Impossible de demander le changement de puissance de site avec une valeur négative ou nulle
        Etant donné le projet lauréat "Du bouchon lyonnais" avec :
            | appel d'offres | PPE2 - Petit PV Bâtiment |
        Quand le porteur demande le changement de puissance pour le projet lauréat avec :
            | puissance de site | <Puissance de site> |
            | ratio puissance   | 1                   |
        Alors l'utilisateur devrait être informé que "La puissance de site d'un projet doit avoir une valeur positive"

        Exemples:
            | Puissance de site |
            | 0                 |
            | -1                |

    Scénario: Impossible pour le porteur de demander le changement de puissance si elle dépasse la puissance max par famille
        Etant donné le projet lauréat "Du bouchon lyonnais" avec :
            | appel d'offres                | PPE2 - Innovation |
            | période                       | 1                 |
            | famille                       | 1                 |
            | puissance production annuelle | 1                 |
        # la puissance max par famille est 3 pour cette famille
        Quand le porteur demande le changement de puissance pour le projet lauréat avec :
            | ratio puissance | 3.1 |
        Alors l'utilisateur devrait être informé que "La nouvelle puissance ne peut pas dépasser la puissance maximale de la famille de l'appel d'offres"

    Scénario: Impossible pour le porteur de demander un changement de puissance si elle dépasse le volume réservé de l'appel d'offre
        Etant donné le projet lauréat "Du bouchon lyonnais" avec :
            | appel d'offres                | PPE2 - Sol |
            | période                       | 3          |
            | note totale                   | 34         |
            | puissance production annuelle | 1          |
        # le volume réservé de l'AO est de 5
        Quand le porteur demande le changement de puissance pour le projet lauréat avec :
            | ratio puissance | 6 |
        Alors l'utilisateur devrait être informé que "La nouvelle puissance ne peut pas dépasser la puissance maximale du volume réservé"

    # Règles spécifiques aux AO
    Scénario: Impossible de demander le changement de puissance si le cahier des charges ne le permet pas
        Etant donné le projet lauréat legacy "Du bouchon lyonnais" avec :
            | appel d'offres | CRE4 - Sol |
            | période        | 1          |
        Quand le porteur demande le changement de puissance pour le projet lauréat avec :
            | ratio puissance | 0.95 |
        Alors le porteur devrait être informé que "Le cahier des charges de ce projet ne permet pas ce changement"

    Scénario: Impossible de demander le changement de puissance avec une valeur identique pour un AO qui ne requiert pas la puissance de site
        Quand le porteur demande le changement de puissance pour le projet lauréat avec :
            | ratio puissance | 1 |
        Alors l'utilisateur devrait être informé que "La puissance doit avoir une valeur différente"

    Scénario: Impossible de demander le changement de puissance si la puissance de site n'est pas également modifiée pour un AO qui requiert la puissance de site
        Etant donné le projet lauréat "Du bouchon lyonnais" avec :
            | appel d'offres    | PPE2 - Petit PV Bâtiment |
            | puissance de site | 20                       |
        Quand le porteur demande le changement de puissance pour le projet lauréat avec :
            | ratio puissance   | 1.2 |
            | puissance de site | 20  |
        Alors l'utilisateur devrait être informé que "La puissance de site doit être modifiée"

    Scénario: Impossible de demander le changement de puissance de site sans valeur pour un AO qui requiert ce champ
        Etant donné le projet lauréat "Du bouchon lyonnais" avec :
            | appel d'offres | PPE2 - Petit PV Bâtiment |
        Quand le porteur demande le changement de puissance pour le projet lauréat avec :
            | ratio puissance   | 1.2 |
            | puissance de site |     |
        Alors l'utilisateur devrait être informé que "La puissance de site doit être modifiée"

    Scénario: Impossible de demander le changement de puissance de site pour un AO qui interdit ce champ
        Quand le porteur demande le changement de puissance pour le projet lauréat avec :
            | ratio puissance   | 1.1 |
            | puissance de site | 100 |
        Alors l'utilisateur devrait être informé que "La puissance de site ne peut être renseignée pour cet appel d'offres"
