# language: fr
Fonctionnalité: Supprimer un utilisateur

    Contexte:
        Etant donné le gestionnaire de réseau "Enedis"
        Et le projet lauréat "Du boulodrome de Marseille"
        Et le gestionnaire de réseau "Enedis" attribué au raccordement du projet lauréat

    Plan du scénario: Supprimer un utilisateur avec accès global
        Etant donné un utilisateur invité avec le rôle "<Rôle>"
        Quand un administrateur supprime l'utilisateur
        Alors l'utilisateur n'existe plus

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

    Scénario: Impossible de supprimer son propre compte
        Etant donné un utilisateur invité avec le rôle "admin"
        Quand l'utilisateur supprime son compte
        Alors l'utilisateur devrait être informé que "Il est impossible de supprimer son propre compte"
