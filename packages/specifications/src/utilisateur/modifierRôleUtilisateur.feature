# language: fr
@utilisateur
Fonctionnalité: Modifier le rôle d'un utilisateur en tant qu'admin

    Contexte:
        Etant donné le gestionnaire de réseau "Enedis"
        Et le projet lauréat "Du boulodrome de Marseille"
        Et le gestionnaire de réseau "Enedis" attribué au raccordement du projet lauréat

    Plan du scénario: Modifier le rôle d'un utilisateur avec accès global
        Etant donné un utilisateur invité avec le rôle "<RôleInitial>"
        Quand un administrateur modifie le rôle de l'utilisateur vers "<NouveauRôle>"
        Alors l'utilisateur devrait être modifié

        Exemples:
            | RôleInitial       | NouveauRôle       |
            | admin             | ademe             |
            | ademe             | cre               |
            | cre               | caisse-des-dépôts |
            | caisse-des-dépôts | dreal             |
            | dreal             | dgec-validateur   |
            | dgec-validateur   | grd               |
            | grd               | cocontractant     |
            | cocontractant     | admin             |

    Scénario: Impossible de modifier un utilisateur vers porteur-projet
        Etant donné un utilisateur invité avec le rôle "admin"
        Quand un administrateur modifie le rôle de l'utilisateur vers "porteur-projet"
        Alors l'utilisateur devrait être informé que "Il est impossible de modifier un utilisateur depuis ou vers le rôle porteur de projet"

    Scénario: Impossible de modifier vers dreal sans région
        Etant donné un utilisateur invité avec le rôle "admin"
        Quand un administrateur modifie le rôle de l'utilisateur avec :
            | rôle   | dreal |
            | région |       |
        Alors l'utilisateur devrait être informé que "La région est obligatoire pour un utilisateur dreal"

    Scénario: Impossible de modifier vers grd sans identifiant
        Etant donné un utilisateur invité avec le rôle "admin"
        Quand un administrateur modifie le rôle de l'utilisateur avec :
            | rôle                | grd |
            | gestionnaire réseau |     |
        Alors l'utilisateur devrait être informé que "L'identifiant du gestionnaire de réseau est obligatoire pour un utilisateur grd"

    Scénario: Impossible de modifier vers dgec-validateur sans fonction
        Etant donné un utilisateur invité avec le rôle "admin"
        Quand un administrateur modifie le rôle de l'utilisateur avec :
            | rôle        | dgec-validateur |
            | fonction    |                 |
            | nom complet | un nom          |

        Alors l'utilisateur devrait être informé que "La fonction est obligatoire pour un utilisateur dgec-validateur"

    Scénario: Impossible de modifier vers dgec-validateur sans nom
        Etant donné un utilisateur invité avec le rôle "admin"
        Quand un administrateur modifie le rôle de l'utilisateur avec :
            | rôle        | dgec-validateur |
            | fonction    | une fonction    |
            | nom complet |                 |
        Alors l'utilisateur devrait être informé que "Le nom complet est obligatoire pour un utilisateur dgec-validateur"

    Scénario: Impossible de modifier son propre rôle
        Etant donné un utilisateur invité avec le rôle "admin"
        Quand l'administrateur modifie son propre rôle vers "ademe"
        Alors l'utilisateur devrait être informé que "Il est impossible de modifier son propre rôle"

    Scénario: Impossible de modifier un utilisateur désactivé
        Etant donné un utilisateur désactivé avec le rôle "ademe"
        Quand un administrateur modifie le rôle de l'utilisateur vers "admin"
        Alors l'utilisateur devrait être informé que "L'utilisateur n'est pas actif"
