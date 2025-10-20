# language: fr
@utilisateur
Fonctionnalité: Réactiver un utilisateur

    Contexte:
        Etant donné le gestionnaire de réseau "Enedis"
        Et le projet lauréat "Du boulodrome de Marseille"
        Et le gestionnaire de réseau "Enedis" attribué au raccordement du projet lauréat

    Plan du scénario: Réactiver un utilisateur désactivé (hors Porteur de projet)
        Etant donné un utilisateur désactivé avec le rôle "<Rôle>"
        Quand un administrateur réactive l'utilisateur
        Alors l'utilisateur devrait être actif

        Exemples:
            | Rôle              |
            | admin             |
            | acheteur-obligé   |
            | cocontractant     |
            | ademe             |
            | caisse-des-dépôts |
            | cre               |
            | dreal             |
            | dgec-validateur   |
            | grd               |

    Scénario: Réactiver un porteur de projet
        Etant donné le porteur du projet désactivé
        Quand un administrateur réactive le porteur du projet
        Alors le porteur devrait être actif

    Scénario: Impossible de réactiver un utilisateur déjà actif
        Etant donné un utilisateur invité avec le rôle "admin"
        Quand un administrateur réactive l'utilisateur
        Alors l'utilisateur devrait être informé que "L'utilisateur est déjà actif"
