# language: fr
Fonctionnalité: Inviter un porteur sur un projet

    Plan du scénario: Inviter un porteur
        Etant donné le projet <Statut> "Du boulodrome de Marseille"
        Et le porteur "Marcel Patoulatchi" ayant accés au projet <Statut> "Du boulodrome de Marseille"
        Quand le porteur invite un autre porteur sur le projet <Statut>
        Alors l'utilisateur doit être créé
        Et le nouveau porteur a accès au projet <Statut>

        Exemples:
            | Statut  |
            | lauréat |
            | éliminé |

    Scénario: Impossible d'inviter un porteur déjà invité
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et le porteur "Marcel Patoulatchi" ayant accés au projet lauréat "Du boulodrome de Marseille"
        Quand le porteur invite un autre porteur sur le projet lauréat
        Et le porteur invite un autre porteur sur le projet lauréat
        Alors l'utilisateur devrait être informé que "L'utilisateur a déjà accès à ce projet"

    @NotImplemented
    Scénario: Inviter un porteur dont les accès ont été retirés

