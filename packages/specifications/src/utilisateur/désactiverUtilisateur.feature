# language: fr
Fonctionnalité: Désactiver un utilisateur

    Contexte:
        Etant donné le gestionnaire de réseau "Enedis"
        Et le projet lauréat "Du boulodrome de Marseille"
        Et le gestionnaire de réseau "Enedis" attribué au raccordement du projet lauréat

    Plan du scénario: Désactiver un utilisateur (hors Porteur de projet)
        Etant donné un utilisateur invité avec le rôle "<Rôle>"
        Quand un administrateur désactive l'utilisateur
        Alors l'utilisateur devrait être désactivé

        Exemples:
            | Rôle              |
            | admin             |
            | acheteur-obligé   |
            | ademe             |
            | caisse-des-dépôts |
            | cre               |
            | dreal             |
            | dgec-validateur   |
            | grd               |

    Scénario: Désactiver un porteur de projet
        Quand un administrateur désactive le porteur du projet
        Alors le porteur devrait être désactivé

    Scénario: Impossible de désactiver son propre compte
        Etant donné un utilisateur invité avec le rôle "admin"
        Quand l'utilisateur désactive son compte
        Alors l'utilisateur devrait être informé que "Il est impossible de désactiver son propre compte"

    Scénario: Impossible de désactiver un utilisateur déjà désactivé
        Etant donné un utilisateur invité avec le rôle "admin"
        Quand un administrateur désactive l'utilisateur
        Et un administrateur désactive l'utilisateur
        Alors l'utilisateur devrait être informé que "L'utilisateur n'est pas actif"
