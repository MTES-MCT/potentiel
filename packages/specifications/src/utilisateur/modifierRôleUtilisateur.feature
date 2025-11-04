# language: fr
@utilisateur
Fonctionnalité: Modifier le rôle d'un utilisateur en tant qu'admin

    Contexte:
        Etant donné le gestionnaire de réseau "Enedis"
        Et le projet lauréat "Du boulodrome de Marseille"
        Et le gestionnaire de réseau "Enedis" attribué au raccordement du projet lauréat

    Plan du scénario: Modifier le rôle d'un utilisateur avec accès global
        Etant donné un utilisateur invité avec le rôle "<Rôle Initial>"
        Quand un administrateur modifie le rôle de l'utilisateur en "<Nouveau Rôle>"
        Alors l'utilisateur devrait être modifié

        Exemples:
            | Rôle Initial      | Nouveau Rôle      |
            | admin             | ademe             |
            | ademe             | cre               |
            | cre               | caisse-des-dépôts |
            | caisse-des-dépôts | dreal             |
            | dreal             | dgec-validateur   |
            | dgec-validateur   | grd               |
            | grd               | cocontractant     |
            | cocontractant     | admin             |

    Scénario: Impossible de modifier un utilisateur en porteur de projet
        Etant donné un utilisateur invité avec le rôle "admin"
        Quand un administrateur modifie le rôle de l'utilisateur en "porteur-projet"
        Alors l'utilisateur devrait être informé que "Il est impossible de donner ou d'enlever le rôle porteur de projet à un utilisateur"

    Scénario: Impossible de modifier un porteur de projet
        Etant donné un porteur invité sur le projet lauréat
        Quand un administrateur modifie le rôle du porteur en "ademe"
        Alors l'utilisateur devrait être informé que "Il est impossible de donner ou d'enlever le rôle porteur de projet à un utilisateur"

    Scénario: Impossible de modifier le rôle en dreal sans région
        Etant donné un utilisateur invité avec le rôle "admin"
        Quand un administrateur modifie le rôle de l'utilisateur avec :
            | rôle   | dreal |
            | région |       |
        Alors l'utilisateur devrait être informé que "La région est obligatoire pour un utilisateur dreal"

    Scénario: Impossible de modifier le rôle en grd sans identifiant gestionnaire réseau
        Etant donné un utilisateur invité avec le rôle "admin"
        Quand un administrateur modifie le rôle de l'utilisateur avec :
            | rôle                | grd |
            | gestionnaire réseau |     |
        Alors l'utilisateur devrait être informé que "L'identifiant du gestionnaire de réseau est obligatoire pour un utilisateur grd"

    Scénario: Impossible de modifier le rôle en dgec-validateur sans fonction
        Etant donné un utilisateur invité avec le rôle "admin"
        Quand un administrateur modifie le rôle de l'utilisateur avec :
            | rôle        | dgec-validateur |
            | fonction    |                 |
            | nom complet | un nom          |

        Alors l'utilisateur devrait être informé que "La fonction est obligatoire pour un utilisateur dgec-validateur"

    Scénario: Impossible de modifier le rôle en dgec-validateur sans nom
        Etant donné un utilisateur invité avec le rôle "admin"
        Quand un administrateur modifie le rôle de l'utilisateur avec :
            | rôle        | dgec-validateur |
            | fonction    | une fonction    |
            | nom complet |                 |
        Alors l'utilisateur devrait être informé que "Le nom complet est obligatoire pour un utilisateur dgec-validateur"

    Scénario: Impossible de modifier son propre rôle
        Etant donné un utilisateur invité avec le rôle "admin"
        Quand l'administrateur modifie son propre rôle en "ademe"
        Alors l'utilisateur devrait être informé que "Il est impossible de modifier son propre rôle"

    Scénario: Impossible de modifier un utilisateur désactivé
        Etant donné un utilisateur désactivé avec le rôle "ademe"
        Quand un administrateur modifie le rôle de l'utilisateur en "admin"
        Alors l'utilisateur devrait être informé que "L'utilisateur n'est pas actif"

    Plan du scénario: Impossible de modifier avec les même valeurs
        Etant donné un utilisateur invité avec le rôle "<Rôle>"
        Quand un administrateur modifie le rôle de l'utilisateur avec les même valeurs
        Alors l'utilisateur devrait être informé que "L'utilisateur a déjà ce rôle ou les mêmes attributs"

        Exemples:
            | Rôle              |
            | admin             |
            | ademe             |
            | cre               |
            | caisse-des-dépôts |
            | dreal             |
            | dgec-validateur   |
            | grd               |
            | cocontractant     |
