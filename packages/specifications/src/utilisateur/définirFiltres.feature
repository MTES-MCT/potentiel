# language: fr
@utilisateur
Fonctionnalité: Définir filtres utilisateur en tant qu'administration

  Contexte:
    Etant donné le projet lauréat "De la Tour Crayon"
    Et la dreal "Dreal de Lyon" associée à la région du projet

  Plan du scénario: Définir ses filtres utilisateurs
    Quand la <Rôle> définit ses filtres utilisateur
    Alors les filtres utilisateur devraient être consultables

    Exemples:
      | Rôle  |
      | DREAL |
      | DGEC  |

  Scénario: Impossible de définir ses filtres en étant désactivé
    Etant donné un utilisateur désactivé avec le rôle "dreal"
    Quand l'utilisateur désactivé définit ses filtres utilisateur
    Alors l'utilisateur devrait être informé que "L'utilisateur n'est pas actif"

  Scénario: Impossible de définir ses filtres hors administration
    Etant donné un porteur invité sur le projet lauréat "De la Tour Crayon"
    Quand le porteur définit ses filtres utilisateur
    Alors l'utilisateur devrait être informé que "Il est impossible de définir des filtres utilisateur pour un utilisateur ayant ce rôle"
