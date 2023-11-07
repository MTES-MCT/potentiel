#Language: fr-FR
Fonctionnalité: Annuler le rejet d'un abandon d'un projet lauréat
    Contexte:
      Etant donné le projet lauréat "Du boulodrome de Marseille"
    
    @NotImplemented
    Scénario: Un DGEC validateur annule le rejet de l'abandon d'un projet lauréat
      Etant donné un abandon rejeté pour le projet lauréat "Du boulodrome de Marseille"
      Quand le DGEC validateur annule le rejet de l'abandon pour le projet lauréat "Du boulodrome de Marseille"
      Alors l'abandon du projet lauréat "Du boulodrome de Marseille" est de nouveau demandé
    
    @NotImplemented
    Scénario: Impossible d'annuler le rejet de l'abandon d'un projet lauréat si l'abandon a déjà été accordé
      Etant donné une demande d'abandon accordée pour le projet lauréat "Du boulodrome de Marseille"
      Quand le DGEC validateur annule le rejet de l'abandon pour le projet lauréat "Du boulodrome de Marseille"
      Alors le DGEC validateur devrait être informé que "L'abandon a déjà été accordé"
    
    @NotImplemented
    Scénario: Impossible d'annuler l'abandon d'un projet lauréat si aucun abandon n'a été demandé
      Quand le DGEC validateur annule l'abandon pour le projet lauréat "Du boulodrome de Marseille"
      Alors le DGEC validateur devrait être informé que "Aucun abandon n'a été demandé"
