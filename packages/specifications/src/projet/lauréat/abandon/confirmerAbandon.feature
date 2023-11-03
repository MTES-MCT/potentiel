#Language: fr-FR
Fonctionnalité: Conformer l'abandon d'un projet lauréat
    Contexte:
      Etant donné le projet lauréat "Du boulodrome de Marseille"

    Scénario: Un porteur confirme l'abandon d'un projet lauréat
      Etant donné une confirmation d'abandon demandé pour le projet lauréat "Du boulodrome de Marseille"
      Quand le porteur confirme l'abandon pour le projet lauréat "Du boulodrome de Marseille"
      Alors la demande d'abandon du projet lauréat "Du boulodrome de Marseille" est confirmée

    Scénario: Impossible de confirmer l'abandon d'un projet lauréat si la confirmation d'abandon n'a déjà été demandé
      Etant donné une demande d'abandon en cours pour le projet lauréat "Du boulodrome de Marseille"
      Quand le porteur confirme l'abandon pour le projet lauréat "Du boulodrome de Marseille"
      Alors le porteur devrait être informé que "Aucune confirmation d'abandon n'a été demandé"

    Scénario: Impossible de confirmer l'abandon d'un projet lauréat si l'abandon a déjà été accordé
      Etant donné un abandon accordé pour le projet lauréat "Du boulodrome de Marseille"
      Quand le porteur confirme l'abandon pour le projet lauréat "Du boulodrome de Marseille"
      Alors le porteur devrait être informé que "L'abandon a déjà accordé"

    Scénario: Impossible de confirmer l'abandon d'un projet lauréat si l'abandon a déjà été rejeté
      Etant donné un abandon rejeté pour le projet lauréat "Du boulodrome de Marseille"
      Quand le porteur confirme l'abandon pour le projet lauréat "Du boulodrome de Marseille"
      Alors le porteur devrait être informé que "L'abandon a déjà été rejeté"

    Scénario: Impossible de confirmer l'abandon d'un projet lauréat si l'abandon a déjà été confirmé
      Etant donné un abandon confirmé pour le projet lauréat "Du boulodrome de Marseille"
      Quand le porteur confirme l'abandon pour le projet lauréat "Du boulodrome de Marseille"
      Alors le porteur devrait être informé que "L'abandon a déjà été confirmé"

    Scénario: Impossible de confirmer l'abandon d'un projet lauréat si aucun abandon n'a été demandé
      Quand le porteur confirme l'abandon pour le projet lauréat "Du boulodrome de Marseille"
      Alors le porteur devrait être informé que "Aucun abandon n'a été demandé"
