# language: fr
Fonctionnalité: Demander le recours d'un projet éliminé

    Contexte:
        Etant donné le projet éliminé "Du boulodrome de Marseille"
        Et le porteur "Marcel Patoulatchi" ayant accés au projet éliminé "Du boulodrome de Marseille"

    Scénario: Un porteur demande le recours d'un projet éliminé
        Quand le porteur demande le recours pour le projet éliminé
        Alors le recours du projet éliminé devrait être demandé

    Scénario: Un porteur demande le recours d'un projet éliminé après un rejet
        Etant donné un recours rejeté pour le projet éliminé
        Quand le porteur demande le recours pour le projet éliminé
        Alors le recours du projet éliminé devrait être de nouveau demandé

    Scénario: Impossible de demander un recours pour un projet si le recours est déjà en cours
        Etant donné un recours en cours pour le projet éliminé
        Quand le porteur demande le recours pour le projet éliminé
        Alors le porteur devrait être informé que "Un recours est déjà en cours"

    Scénario: Impossible de demander un recours pour un projet si le recours est accordé
        Etant donné un recours accordé pour le projet éliminé
        Quand le porteur demande le recours pour le projet éliminé
        Alors le porteur devrait être informé que "Le recours a déjà été accordé"

    @NotImplemented
    Scénario: Impossible de demander un recours pour un projet éliminé inexistant
        Etant donné le projet lauréat "MIOS"
        Et le porteur "Marcel Patoulatchi" ayant accés au projet lauréat "MIOS"
        Quand le porteur demande le recours pour le projet lauréat
        Alors le porteur devrait être informé que "Il est impossible de demander un recours pour un projet lauréat"
