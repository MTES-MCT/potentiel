# language: fr
@accès
Fonctionnalité: Retirer les accès d'un utilisateur à un projet

    Scénario: Retirer les accès d'un utilisateur à un projet
        Etant donné le projet <Statut> "Du boulodrome de Marseille"
        Quand un administrateur retire l'accès de l'utilisateur au projet <Statut>
        Alors le porteur ne doit plus avoir accès au projet <Statut>
        Et le projet <Statut> est consultable dans la liste des projets à réclamer
        Et un email a été envoyé au porteur avec :
            | sujet           | Révocation de vos accès pour le projet Du boulodrome de Marseille |
            | nom_projet      | Du boulodrome de Marseille                                        |
            | mes_projets_url | https://potentiel.beta.gouv.fr/laureats                           |
            | cause           |                                                                   |

        Exemples:
            | Statut  |
            | éliminé |
            | lauréat |

    Scénario: Impossible de retirer ses accès à un projet
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Quand un porteur retire ses accès au projet lauréat
        Alors l'utilisateur devrait être informé que "Vous ne pouvez pas retirer vos accès à ce projet"

    Scénario: Impossible de retirer les accès d'un utilisateur à un projet si celui-ci n'a pas accès au projet
        Etant donné le projet éliminé "Du bouchon lyonnais"
        Quand un administrateur retire l'accès de l'utilisateur au projet lauréat
        Alors l'utilisateur devrait être informé que "L'utilisateur n'a pas accès au projet"
