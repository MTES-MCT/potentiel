# language: fr
Fonctionnalité: Annuler le rejet d'un abandon d'un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et le porteur "Marcel Patoulatchi" ayant accés au projet lauréat "Du boulodrome de Marseille"

    Scénario: Un DGEC validateur annule le rejet de l'abandon d'un projet lauréat
        Etant donné un abandon rejeté pour le projet lauréat
        Quand le DGEC validateur annule le rejet de l'abandon pour le projet lauréat
        Alors l'abandon du projet lauréat devrait être de nouveau demandé

    Scénario: Impossible d'annuler le rejet de l'abandon d'un projet lauréat si l'abandon a déjà été accordé
        Etant donné un abandon accordé pour le projet lauréat
        Quand le DGEC validateur annule le rejet de l'abandon pour le projet lauréat
        Alors le DGEC validateur devrait être informé que "L'abandon a déjà été accordé"

    Scénario: Impossible d'annuler l'abandon d'un projet lauréat si aucun abandon n'a été demandé
        Quand le DGEC validateur annule le rejet de l'abandon pour le projet lauréat
        Alors le DGEC validateur devrait être informé que "Aucun abandon n'est en cours"
