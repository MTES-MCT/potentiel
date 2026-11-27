# language: fr
@notifications-application
Fonctionnalité: Ajouter une notification application suite à une information enregistrée

  Contexte:
    Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
      | appel d'offres | PPE2 - Petit PV Bâtiment |
    Et la dreal "Dreal du sud" associée à la région du projet

  @select
  Scénario: Ajouter une notification application suite à un changement de représentant légal enregistré
    Quand le porteur enregistre un changement de représentant légal le '2026-11-26'
    Alors une notification application a été ajoutée pour la dreal avec :
      | domaine         | représentant-légal |
      | date changement | 2026-11-26         |

