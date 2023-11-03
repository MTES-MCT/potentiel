#Language: fr-FR
Fonctionnalité: Annuler l'abandon d'un projet lauréat
    Contexte:
      Etant donné le projet lauréat "Du boulodrome de Marseille"

    @NotImplemented
    Scénario: Un porteur annule l'abandon d'un projet lauréat
      Quand le porteur annule l'abandon pour le projet lauréat "Du boulodrome de Marseille"
      Alors la demande d'abandon du projet lauréat "Du boulodrome de Marseille" ne devrait plus exister

    @NotImplemented
    Scénario: Impossible d'annuler l'abandon d'un projet lauréat si l'abandon a déjà été accordé
      Etant donné une demande d'abandon accordée pour le projet lauréat "Du boulodrome de Marseille"
      Quand le porteur annule l'abandon pour le projet lauréat "Du boulodrome de Marseille"
      Alors le porteur devrait être informé que "L'abandon déjà accordé"

    @NotImplemented
    Scénario: Impossible d'annuler l'abandon d'un projet lauréat si aucun abandon n'a été demandé
      Quand le porteur annule l'abandon pour le projet lauréat "Du boulodrome de Marseille"
      Alors le porteur devrait être informé que "Aucun abandon n'a été demandé"
