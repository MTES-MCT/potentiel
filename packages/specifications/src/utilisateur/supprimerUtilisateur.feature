# language: fr
Fonctionnalité: Supprimer un utilisateur

    Contexte:
        Etant donné le gestionnaire de réseau "Enedis"
        Et le projet lauréat "Du boulodrome de Marseille"
        Et le gestionnaire de réseau "Enedis" attribué au raccordement du projet lauréat

    Plan du scénario: Supprimer un utilisateur avec accès global
        Etant donné un utilisateur invité avec le rôle "<Rôle>"
        Quand un administrateur supprime l'utilisateur
        Alors l'utilisateur devrait être supprimé

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

    Scénario: Impossible de supprimer un Porteur de projet
        Etant donné un utilisateur invité avec le rôle "admin"
        Quand un administrateur supprime le porteur du projet
        Alors l'utilisateur devrait être informé que "Il est impossible de supprimer un utilisateur de type porteur"

    Scénario: Impossible de supprimer son propre compte
        Etant donné un utilisateur invité avec le rôle "admin"
        Quand l'utilisateur supprime son compte
        Alors l'utilisateur devrait être informé que "Il est impossible de supprimer son propre compte"

    Scénario: Impossible de supprimer un utilisateur déjà supprimé
        Etant donné un utilisateur invité avec le rôle "admin"
        Quand un administrateur supprime l'utilisateur
        Et un administrateur supprime l'utilisateur
        Alors l'utilisateur devrait être informé que "L'utilisateur n'est pas référencé"
