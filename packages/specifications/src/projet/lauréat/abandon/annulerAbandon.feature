#Language: fr-FR
Fonctionnalité: Annuler l'abandon d'un projet lauréat
    Contexte:
      Etant donné le projet lauréat "Du boulodrome de Marseille"

    @NotImplemented
    Scénario: Un porteur annule l'abandon d'un projet lauréat
      Etant donné un abandon accordé pour le projet lauréat "Du boulodrome de Marseille"
      Quand le porteur annule l'abandon pour le projet lauréat "Du boulodrome de Marseille"
      Alors l'abandon du projet lauréat "Du boulodrome de Marseille" ne devrait plus exister

    @NotImplemented
    Scénario: Impossible d'annuler l'abandon d'un projet lauréat si l'abandon a déjà été accordé
      Etant donné un abandon accordé pour le projet lauréat "Du boulodrome de Marseille"
      Quand le porteur annule l'abandon pour le projet lauréat "Du boulodrome de Marseille"
      Alors le porteur devrait être informé que "L'abandon a déjà été accordé"

    @NotImplemented
    Scénario: Impossible d'annuler l'abandon d'un projet lauréat si aucun abandon n'a été demandé
      Quand le porteur annule l'abandon pour le projet lauréat "Du boulodrome de Marseille"
      Alors le porteur devrait être informé que "Abandon inconnu"
