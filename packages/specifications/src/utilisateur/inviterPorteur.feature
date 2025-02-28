# language: fr
@select
Fonctionnalité: Inviter un porteur sur un projet

    Plan du scénario: Inviter un porteur inexistant
        Etant donné le projet <Statut> "Du boulodrome de Marseille"
        Et le porteur "Marcel Patoulatchi" ayant accés au projet <Statut> "Du boulodrome de Marseille"
        Quand le porteur invite un autre porteur sur le projet <Statut>
        Alors l'utilisateur doit être invité
        Et l'utilisateur invité a accès au projet <Statut>

        Exemples:
            | Statut  |
            | lauréat |
            | éliminé |

    @NotImplemented
    Scénario: Inviter un porteur existant


    @NotImplemented
    Scénario: Impossible d'inviter un porteur déjà invité


    @NotImplemented
    Scénario: Inviter un porteur dont les accès ont été retirés

