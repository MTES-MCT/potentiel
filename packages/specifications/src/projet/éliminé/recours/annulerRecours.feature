# language: fr
@select
Fonctionnalité: Annuler le recours d'un projet éliminé

    Contexte:
        Etant donné le projet éliminé "Du boulodrome de Marseille"
        Et le porteur "Marcel Patoulatchi" ayant accés au projet éliminé "Du boulodrome de Marseille"
        Et le DGEC validateur "Robert Robichet"

    Scénario: Un porteur annule le recours d'un projet éliminé
        Etant donné un recours en cours pour le projet éliminé
        Quand le porteur annule le recours pour le projet éliminé
        Alors le recours du projet éliminé ne devrait plus exister

    Scénario: Impossible d'annuler le recours d'un projet éliminé si le recours a déjà été accordé
        Etant donné un recours accordé pour le projet éliminé
        Quand le porteur annule le recours pour le projet éliminé
        Alors le porteur devrait être informé que "Le recours a déjà été accordé"

    Scénario: Impossible d'annuler le recours d'un projet éliminé si aucun recours n'a été demandé
        Quand le porteur annule le recours pour le projet éliminé
        Alors le porteur devrait être informé que "Aucun recours n'est en cours"

    Scénario: Impossible d'annuler le recours d'un projet éliminé si le recours a déjà été rejeté
        Etant donné un recours rejeté pour le projet éliminé
        Quand le porteur annule le recours pour le projet éliminé
        Alors le porteur devrait être informé que "Le recours a déjà été rejeté"
