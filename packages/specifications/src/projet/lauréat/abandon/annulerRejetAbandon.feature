#Language: fr-FR
Fonctionnalité: Annuler le rejet d'un abandon d'un projet lauréat
    Contexte:
      Etant donné le projet lauréat "Du boulodrome de Marseille"
    @select
    Scénario: Un DGEC validateur annule le rejet de l'abandon d'un projet lauréat
      Etant donné un abandon rejeté pour le projet lauréat "Du boulodrome de Marseille"
      Quand "le DGEC validateur" annule le rejet de l'abandon pour le projet lauréat "Du boulodrome de Marseille"
      Alors l'abandon du projet lauréat "Du boulodrome de Marseille" devrait être de nouveau demandé
    @select
    Scénario: Impossible d'annuler le rejet de l'abandon d'un projet lauréat si l'abandon a déjà été accordé
      Etant donné un abandon accordé pour le projet lauréat "Du boulodrome de Marseille"
      Quand "le DGEC validateur" annule le rejet de l'abandon pour le projet lauréat "Du boulodrome de Marseille"
      Alors le DGEC validateur devrait être informé que "L'abandon a déjà été accordé"

    @select
    Scénario: Impossible d'annuler l'abandon d'un projet lauréat si aucun abandon n'a été demandé
      Quand "le DGEC validateur" annule le rejet de l'abandon pour le projet lauréat "Du boulodrome de Marseille"
      Alors le DGEC validateur devrait être informé que "Aucun abandon n'est en cours"

    @select
    Plan du Scénario: Impossible d'annuler le rejet de l'abandon d'un projet lauréat en tant qu'utilisateur n'ayant pas le rôle de validateur
      Quand "<Role non autorisé>" annule le rejet de l'abandon pour le projet lauréat "Du boulodrome de Marseille"
      Alors "<Role non autorisé>" devrait être informé que "L'accés à cette fonctionnalité n'est pas autorisé"
      Exemples:
        | Role non autorisé    |
        | l'administrateur     |
        | l'acheteur obligé    |
        | l'ADEME              |
        | la caisse des dépôts |
        | la CRE               |
        | la DREAL             |
        | le porteur           |
