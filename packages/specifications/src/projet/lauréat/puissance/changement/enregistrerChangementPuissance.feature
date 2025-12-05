# language: fr
@puissance
Fonctionnalité: Enregistrer un changement de puissance d'un projet lauréat par un porteur

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offres | PPE2 - Eolien |
            | période        | 1             |
        Et la dreal "Dreal du sud" associée à la région du projet

    Scénario: Enregistrer un changement de puissance d'un projet lauréat
        Quand le porteur enregistre un changement de puissance pour le projet lauréat avec :
            | ratio puissance | 0.95 |
        Alors la puissance du projet lauréat devrait être mise à jour
        Et le changement enregistré de puissance devrait être consultable
        Et un email a été envoyé à la dreal avec :
            | sujet      | Potentiel - Déclaration de changement de puissance pour le projet Du boulodrome de Marseille dans le département(.*) |
            | nom_projet | Du boulodrome de Marseille                                                                                           |
            | url        | https://potentiel.beta.gouv.fr/projets/.*                                                                            |
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - Déclaration de changement de puissance pour le projet Du boulodrome de Marseille dans le département(.*) |
            | nom_projet | Du boulodrome de Marseille                                                                                           |
            | url        | https://potentiel.beta.gouv.fr/projets/.*                                                                            |

    Scénario: Enregistrer un changement de puissance et de puissance de site, en modifiant ou non la puissance, d'un projet lauréat pour un projet dont l'AO requiert la puissance de site
        Etant donné le projet lauréat "Du bouchon lyonnais" avec :
            | appel d'offres | PPE2 - Petit PV Bâtiment |
        Et la dreal "Dreal du nord" associée à la région du projet
        Quand le porteur enregistre un changement de puissance pour le projet lauréat avec :
            | puissance de site | <Puissance de site> |
            | ratio puissance   | <Ratio>             |
        Alors la puissance du projet lauréat devrait être mise à jour
        Et le changement enregistré de puissance devrait être consultable
        Et un email a été envoyé à la dreal avec :
            | sujet      | Potentiel - Déclaration de changement de puissance pour le projet Du bouchon lyonnais dans le département(.*) |
            | nom_projet | Du bouchon lyonnais                                                                                           |
            | url        | https://potentiel.beta.gouv.fr/projets/.*                                                                     |
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - Déclaration de changement de puissance pour le projet Du bouchon lyonnais dans le département(.*) |
            | nom_projet | Du bouchon lyonnais                                                                                           |
            | url        | https://potentiel.beta.gouv.fr/projets/.*                                                                     |

        Exemples:
            | Ratio | Puissance de site |
            | 1     | 1                 |
            | 1.05  | 1                 |

    Scénario: Impossible d'enregistrer un changement de puissance d'un projet lauréat avec une valeur identique
        Quand le porteur enregistre un changement de puissance pour le projet lauréat avec :
            | ratio puissance | 1 |
        Alors l'utilisateur devrait être informé que "La puissance doit avoir une valeur différente"

    Scénario: Impossible d'enregistrer un changement de puissance avec une valeur négative ou nulle
        Quand le porteur enregistre un changement de puissance pour le projet lauréat avec :
            | ratio puissance | <Ratio> |
        Alors l'utilisateur devrait être informé que "La puissance d'un projet doit avoir une valeur positive"

        Exemples:
            | Ratio |
            | 0     |
            | -1    |

    Scénario: Impossible d'enregistrer un changement de puissance de site avec une valeur négative ou nulle
        Etant donné le projet lauréat "Du bouchon lyonnais" avec :
            | appel d'offres | PPE2 - Petit PV Bâtiment |
        Quand le porteur enregistre un changement de puissance pour le projet lauréat avec :
            | puissance de site | <Puissance de site> |
            | ratio puissance   | 1                   |
        Alors l'utilisateur devrait être informé que "La puissance de site d'un projet doit avoir une valeur positive"

        Exemples:
            | Puissance de site |
            | 0                 |
            | -1                |

    Scénario: Impossible d'enregistrer un changement de puissance alors qu'un changement de puissance est en cours
        Etant donné une demande de changement de puissance pour le projet lauréat avec :
            | ratio puissance | 0.75 |
        Quand le porteur enregistre un changement de puissance pour le projet lauréat avec :
            | ratio puissance | 0.95 |
        Alors l'utilisateur devrait être informé que "Une demande de changement est déjà en cours"

    Scénario: Impossible pour le porteur d'enregistrer un changement de puissance d'un projet lauréat abandonné
        Etant donné une demande d'abandon accordée pour le projet lauréat
        Quand le porteur enregistre un changement de puissance pour le projet lauréat avec :
            | ratio puissance | 0.95 |
        Alors le porteur devrait être informé que "Impossible de faire un changement pour un projet abandonné"

    Scénario: Impossible pour le porteur d'enregistrer un changement de puissance si une demande d'abandon est en cours
        Etant donné une demande d'abandon en cours pour le projet lauréat
        Quand le porteur enregistre un changement de puissance pour le projet lauréat avec :
            | ratio puissance | 0.95 |
        Alors le porteur devrait être informé que "Impossible de faire un changement car une demande d'abandon est en cours pour le projet"

    Scénario: Impossible pour le porteur d'enregistrer un changement de puissance d'un projet achevé
        Etant donné une attestation de conformité transmise pour le projet lauréat
        Quand le porteur enregistre un changement de puissance pour le projet lauréat avec :
            | ratio puissance | 0.95 |
        Alors le porteur devrait être informé que "Impossible de faire un changement pour un projet achevé"

    # Règles spécifiques liées aux ratios
    Scénario: Impossible pour le porteur d'enregistrer un changement de puissance si elle est inférieure au ratio min autorisé par l'appel d'offres
        Etant donné le projet lauréat "Du bouchon lyonnais" avec :
            | appel d'offres | <Appel d'offre> |
            | période        | <Période>       |
        Et un cahier des charges permettant la modification du projet
        Quand le porteur enregistre un changement de puissance pour le projet lauréat avec :
            | ratio puissance | <Ratio> |
        Alors le porteur devrait être informé que "La puissance ne peut être en deça de la puissance minimale autorisée par l'appel d'offres"

        Exemples:
            | Appel d'offre | Période | Ratio |
            | PPE2 - Eolien | 1       | 0.75  |
            | CRE4 - Sol    | 7       | 0.85  |

    Scénario: Impossible pour le porteur d'enregistrer un changement de puissance si elle est supérieure au ratio max autorisé par l'appel d'offres
        Etant donné le projet lauréat "Du bouchon lyonnais" avec :
            | appel d'offres | <Appel d'offre> |
            | période        | <Période>       |
        Et un cahier des charges permettant la modification du projet
        Quand le porteur enregistre un changement de puissance pour le projet lauréat avec :
            | ratio puissance | <Ratio> |
        Alors le porteur devrait être informé que "La nouvelle puissance ne peut dépasser la puissance maximale autorisée par l'appel d'offres"

        Exemples:
            | Appel d'offre | Période | Ratio |
            | PPE2 - Eolien | 1       | 1.25  |
            | CRE4 - Sol    | 7       | 1.15  |

    Scénario: Impossible pour le porteur d'enregistrer un changement de puissance si elle dépasse la puissance max par famille
        Etant donné le projet lauréat "Du bouchon lyonnais" avec :
            | appel d'offres                | PPE2 - Innovation |
            | période                       | 1                 |
            | famille                       | 1                 |
            | puissance production annuelle | 1                 |
        # la puissance max par famille est 3 pour cette famille
        Quand le porteur enregistre un changement de puissance pour le projet lauréat avec :
            | ratio puissance | 3.1 |
        Alors l'utilisateur devrait être informé que "La nouvelle puissance ne peut pas dépasser la puissance maximale de la famille de l'appel d'offres"

    Scénario: Impossible pour le porteur d'enregistrer un changement de puissance si elle dépasse le volume réservé de l'appel d'offre
        Etant donné le projet lauréat "Du bouchon lyonnais" avec :
            | appel d'offres                | PPE2 - Sol |
            | période                       | 3          |
            | note totale                   | 34         |
            | puissance production annuelle | 1          |
        # le volume réservé de l'AO est de 5
        Quand le porteur enregistre un changement de puissance pour le projet lauréat avec :
            | ratio puissance | 6 |
        Alors l'utilisateur devrait être informé que "La nouvelle puissance ne peut pas dépasser la puissance maximale du volume réservé"

    # Règles spécifiques aux AO
    Scénario: Impossible d'enregistrer un changement de puissance si le cahier des charges ne le permet pas
        Etant donné le projet lauréat legacy "Du bouchon lyonnais" avec :
            | appel d'offres | CRE4 - Sol |
            | période        | 1          |
        Quand le porteur enregistre un changement de puissance pour le projet lauréat avec :
            | ratio puissance | 0.95 |
        Alors le porteur devrait être informé que "Le cahier des charges de ce projet ne permet pas ce changement"

    Scénario: Impossible d'enregistrer un changement de puissance avec une valeur identique pour un AO qui ne requiert pas la puissance de site
        Quand le porteur enregistre un changement de puissance pour le projet lauréat avec :
            | ratio puissance | 1 |
        Alors l'utilisateur devrait être informé que "La puissance doit avoir une valeur différente"

    Scénario: Impossible d'enregistrer un changement de puissance de site sans modification pour un AO qui requiert ce champ
        Etant donné le projet lauréat "Du bouchon lyonnais" avec :
            | appel d'offres    | PPE2 - Petit PV Bâtiment |
            | puissance de site | 100                      |
        Quand le porteur enregistre un changement de puissance pour le projet lauréat avec :
            | ratio puissance   | 1.2 |
            | puissance de site | 100 |
        Alors l'utilisateur devrait être informé que "La puissance de site doit être modifiée"

    Scénario: Impossible d'enregistrer un changement de puissance de site sans valeur pour un AO qui requiert ce champ
        Etant donné le projet lauréat "Du bouchon lyonnais" avec :
            | appel d'offres | PPE2 - Petit PV Bâtiment |
        Quand le porteur enregistre un changement de puissance pour le projet lauréat avec :
            | ratio puissance   | 1.2 |
            | puissance de site |     |
        Alors l'utilisateur devrait être informé que "La puissance de site doit être modifiée"

    Scénario: Impossible d'enregistrer un changement de puissance de site pour un AO qui interdit ce champ
        Quand le porteur enregistre un changement de puissance pour le projet lauréat avec :
            | ratio puissance   | 1.1 |
            | puissance de site | 1.1 |
        Alors l'utilisateur devrait être informé que "La puissance de site ne peut être renseignée pour cet appel d'offres"
