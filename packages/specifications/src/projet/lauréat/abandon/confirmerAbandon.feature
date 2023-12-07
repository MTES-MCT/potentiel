#Language: fr-FR
Fonctionnalité: Conformer l'abandon d'un projet lauréat
    Contexte:
      Etant donné le projet lauréat "Du boulodrome de Marseille"

@select
    Scénario: Un porteur confirme l'abandon d'un projet lauréat
      Etant donné une confirmation d'abandon demandée pour le projet lauréat "Du boulodrome de Marseille"
      Quand "le porteur" confirme l'abandon pour le projet lauréat "Du boulodrome de Marseille"
      Alors l'abandon du projet lauréat "Du boulodrome de Marseille" devrait être confirmé

@select
    Scénario: Impossible de confirmer l'abandon d'un projet lauréat si la confirmation d'abandon n'a pas été demandé
      Etant donné une demande d'abandon en cours pour le projet lauréat "Du boulodrome de Marseille"
      Quand "le porteur" confirme l'abandon pour le projet lauréat "Du boulodrome de Marseille"
      Alors le porteur devrait être informé que "Aucune demande de confirmation d'abandon en attente"

@select
    Scénario: Impossible de confirmer l'abandon d'un projet lauréat si l'abandon a déjà été accordé
      Etant donné un abandon accordé pour le projet lauréat "Du boulodrome de Marseille"
      Quand "le porteur" confirme l'abandon pour le projet lauréat "Du boulodrome de Marseille"
      Alors le porteur devrait être informé que "L'abandon a déjà été accordé"

@select
    Scénario: Impossible de confirmer l'abandon d'un projet lauréat si l'abandon a déjà été rejeté
      Etant donné un abandon rejeté pour le projet lauréat "Du boulodrome de Marseille"
      Quand "le porteur" confirme l'abandon pour le projet lauréat "Du boulodrome de Marseille"
      Alors le porteur devrait être informé que "L'abandon a déjà été rejeté"

@select
    Scénario: Impossible de confirmer l'abandon d'un projet lauréat si l'abandon a déjà été confirmé
      Etant donné un abandon confirmé pour le projet lauréat "Du boulodrome de Marseille"
      Quand "le porteur" confirme l'abandon pour le projet lauréat "Du boulodrome de Marseille"
      Alors le porteur devrait être informé que "L'abandon a déjà été confirmé"

@select
    Scénario: Impossible de confirmer l'abandon d'un projet lauréat si aucun abandon n'a été demandé
      Quand "le porteur" confirme l'abandon pour le projet lauréat "Du boulodrome de Marseille"
      Alors le porteur devrait être informé que "Aucun abandon n'est en cours"

@select
  Plan du Scénario: Impossible de confirmer l'abandon d'un projet lauréat en tant qu'utilisateur n'ayant pas le rôle de validateur
    Etant donné une confirmation d'abandon demandée pour le projet lauréat "Du boulodrome de Marseille"
    Quand "<Role non autorisé>" confirme l'abandon pour le projet lauréat "Du boulodrome de Marseille"
    Alors "<Role non autorisé>" devrait être informé que "L'accés à cette fonctionnalité n'est pas autorisé"
    Exemples:
      | Role non autorisé    |
      | l'administrateur     |
      | l'acheteur obligé    |
      | l'ADEME              |
      | la caisse des dépôts |
      | la CRE               |
      | la DREAL             |
      | le DGEC validateur   |
