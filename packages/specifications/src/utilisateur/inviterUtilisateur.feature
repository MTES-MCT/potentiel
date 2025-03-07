# language: fr
Fonctionnalité: Inviter un utilisateur en tant qu'admin

    Plan du scénario: Inviter un utilisateur avec accès global
        Quand un administrateur invite un utilisateur avec le rôle "<Rôle>"
        Alors l'utilisateur doit être invité

        Exemples:
            | Rôle              |
            | admin             |
            | acheteur-obligé   |
            | ademe             |
            | caisse-des-dépôts |
            | cre               |

    Scénario: Inviter un DGEC validateur
        Quand un administrateur invite un dgec validateur
        Alors l'utilisateur doit être invité

    Scénario: Inviter une dreal
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Quand un administrateur invite une dreal pour la région du projet
        Alors l'utilisateur doit être invité
        Alors l'utilisateur invité a accès au projet lauréat

    Scénario: Inviter un gestionnaire de réseau
        Etant donné le gestionnaire de réseau "Enedis"
        Et le projet lauréat "Du boulodrome de Marseille"
        Et le gestionnaire de réseau "Enedis" attribué au raccordement du projet lauréat
        Quand un administrateur invite un gestionnaire de réseau attribué au raccordement du projet lauréat
        Alors l'utilisateur invité a accès au projet lauréat

    Scénario: Impossible d'inviter un utilisateur déjà invité
        Quand un administrateur invite un utilisateur avec le rôle "admin"
        Et un administrateur réinvite le même utilisateur
        Alors l'utilisateur devrait être informé que "L'utilisateur existe déjà"

    Scénario: Impossible d'inviter un porteur
        Quand un administrateur invite un utilisateur avec le rôle "porteur-projet"
        Alors l'utilisateur devrait être informé que "Il est impossible d'inviter un porteur sans projet"

    Scénario: Impossible d'inviter une dreal sans région
        Quand un administrateur invite un utilisateur avec le rôle "dreal"
        Alors l'utilisateur devrait être informé que "La région est obligatoire pour un utilisateur dreal"

    Scénario: Impossible d'inviter un grd sans identifiant
        Quand un administrateur invite un utilisateur avec le rôle "grd"
        Alors l'utilisateur devrait être informé que "L'identifiant du gestionnaire de réseau est obligatoire pour un utilisateur grd"

    @NotImplemented
    Scénario: Inviter un utilisateur désactivé

