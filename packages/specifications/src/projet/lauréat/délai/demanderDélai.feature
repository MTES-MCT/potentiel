# language: fr
@délai
@select
Fonctionnalité: Demander un délai pour un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offres | PPE2 - Eolien |
        Et un cahier des charges permettant la modification du projet
        Et la dreal "Dreal du sud" associée à la région du projet

    Scénario: Un porteur demande une prolongation de délai d'achèvement pour un projet lauréat
        Quand le porteur demande une "prolongation de délai d'achèvement" pour le projet lauréat
        Alors la demande de "prolongation de délai d'achèvement" devrait être consultable
        Et un email a été envoyé à l'autorité instructrice avec :
            | sujet         | Potentiel - Du boulodrome de Marseille - Délai demandé |
            | nom_projet    | Du boulodrome de Marseille                             |
            | url           | https://potentiel.beta.gouv.fr/laureats/.*/delai       |
            | motif_demande | prolongation du délai d'achèvement                     |

    Scénario: Un porteur demande une prolongation de phase d'essai
        Quand le porteur demande une "prolongation de phase d'essai" pour le projet lauréat
        Alors la demande de "prolongation de phase d'essai" devrait être consultable
        Et un email a été envoyé à la dgec avec :
            | sujet         | Potentiel - Du boulodrome de Marseille - Délai demandé |
            | nom_projet    | Du boulodrome de Marseille                             |
            | url           | https://potentiel.beta.gouv.fr/laureats/.*/delai       |
            | motif_demande | prolongation du délai de phase d'essai                 |

    Plan du scénario: Un porteur peut déposer une seconde demande de délai si le motif est différent de celui de la première demande de délai
        Etant donné une demande de <première demande> en cours pour le projet lauréat
        Quand le porteur demande une <seconde demande> pour le projet lauréat
        Alors la demande de <première demande> en cours devrait être consultable
        Et  la demande de <seconde demande> en cours devrait être consultable

        Exemples:
            | première demande                     | seconde demande                      |
            | "prolongation de délai d'achèvement" | "prolongation de phase d'essai"      |
            | "prolongation de phase d'essai"      | "prolongation de délai d'achèvement" |

    Plan du scénario: Impossible de demander un délai pour un projet si une demande de délai du même motif est en cours
        Etant donné une demande de "<motif>" en cours pour le projet lauréat
        Quand le porteur demande une "<motif>" pour le projet lauréat
        Alors le porteur devrait être informé que "Une demande de <motif> est déjà en cours"

        Exemples:
            | motif                              |
            | prolongation de délai d'achèvement |
            | prolongation de phase d'essai      |

    Plan du scénario: Impossible de demander un délai pour un projet si un délai pour le même motif est déjà en instruction
        Etant donné une demande de "<motif>" en instruction pour le projet lauréat
        Quand le porteur demande une "<motif>" pour le projet lauréat
        Alors le porteur devrait être informé que "Une demande de <motif> est déjà en cours"

        Exemples:
            | motif                              |
            | prolongation de délai d'achèvement |
            | prolongation de phase d'essai      |

    Scénario: Impossible de demander un délai pour un projet achevé
        Etant donné l'achèvement réel transmis pour le projet lauréat
        Quand le porteur demande une "prolongation de délai d'achèvement" pour le projet lauréat
        Alors le porteur devrait être informé que "Impossible de faire un changement pour un projet achevé"

    Scénario: Impossible de demander un délai pour un projet si le cahier des charges ne le permet pas
        Etant donné le projet lauréat "Du bouchon lyonnais" avec :
            | appel d'offres | CRE4 - Sol |
            | période        | 10         |
        Quand le porteur demande une "prolongation de délai d'achèvement" pour le projet lauréat
        Alors le porteur devrait être informé que "Le cahier des charges de ce projet ne permet pas ce changement"