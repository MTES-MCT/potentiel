# language: fr
@utilisateur
Fonctionnalité: Inviter un porteur sur un projet

    Plan du scénario: Inviter un porteur
        Etant donné le projet <Statut> "Du boulodrome de Marseille"
        Quand le porteur invite un autre porteur sur le projet <Statut>
        Alors l'utilisateur devrait être actif
        Et le porteur a accès au projet <Statut>
        Et la liste des porteurs du projet <Statut> est mise à jour
        Et un email a été envoyé au nouveau porteur avec :
            | sujet           | Invitation à suivre les projets sur Potentiel |
            | nomProjet       | Du boulodrome de Marseille                    |
            | invitation_link | https://potentiel.beta.gouv.fr/laureats       |

        Exemples:
            | Statut  |
            | lauréat |
            | éliminé |

    Scénario: Un porteur n'a pas accès à un projet auquel il n'est pas invité
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et le projet lauréat "Du boulodrome de Tourcoing"
        Et un porteur invité sur le projet lauréat "Du boulodrome de Marseille"
        Alors le porteur n'a pas accès au projet lauréat "Du boulodrome de Tourcoing"

    Scénario: Impossible d'inviter un porteur déjà invité
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Quand le porteur invite un autre porteur sur le projet lauréat
        Et le porteur invite un autre porteur sur le projet lauréat
        Alors l'utilisateur devrait être informé que "L'utilisateur a déjà accès à ce projet"

    Scénario: Impossible d'inviter un compte non-porteur existant
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Quand le porteur invite l'administrateur sur le projet lauréat
        Alors l'utilisateur devrait être informé que "L'utilisateur ne peut être invité sur ce projet"

    @NotImplemented
    Scénario: Inviter un porteur désactivé

