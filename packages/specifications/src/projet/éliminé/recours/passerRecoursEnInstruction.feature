# language: fr
Fonctionnalité: Passer le recours d'un projet éliminé en instruction

    Contexte:
        Etant donné le projet éliminé "Du boulodrome de Marseille"
        Et le porteur "Marcel Patoulatchi" ayant accés au projet éliminé "Du boulodrome de Marseille"

    Scénario: Un administrateur passe le recours d'un projet éliminé en instruction
        Etant donné une demande de recours en cours pour le projet éliminé
        Quand l'administrateur passe en instruction le recours pour le projet éliminé
        Alors la demande de recours du projet éliminé devrait être en instruction

    Scénario: Impossible de passer le recours d'un projet éliminé en instruction si le recours a déjà été accordé
        Etant donné un recours accordé pour le projet éliminé
        Quand l'administrateur passe en instruction le recours pour le projet éliminé
        Alors le DGEC validateur devrait être informé que "Le recours a déjà été accordé"

    Scénario: Impossible de passer le recours d'un projet éliminé en instruction si le recours a déjà été rejeté
        Etant donné un recours rejeté pour le projet éliminé
        Quand l'administrateur passe en instruction le recours pour le projet éliminé
        Alors le DGEC validateur devrait être informé que "Le recours a déjà été rejeté"

    Scénario: Impossible de passer le recours d'un projet éliminé en instruction si aucun recours n'a été demandé
        Quand l'administrateur passe en instruction le recours pour le projet éliminé
        Alors le DGEC validateur devrait être informé que "Aucun recours n'est en cours"
