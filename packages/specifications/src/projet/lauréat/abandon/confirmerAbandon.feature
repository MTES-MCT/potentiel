# language: fr
Fonctionnalité: Conformer l'abandon d'un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"

    Scénario: Un porteur confirme l'abandon d'un projet lauréat
        Etant donné une confirmation d'abandon demandée pour le projet lauréat
        Quand le porteur confirme l'abandon pour le projet lauréat
        Alors l'abandon du projet lauréat devrait être confirmé
        Et une tâche indiquant de "confirmer un abandon" n'est plus consultable dans la liste des tâches du porteur pour le projet

    Scénario: Impossible de confirmer l'abandon d'un projet lauréat si la confirmation d'abandon n'a pas été demandé
        Etant donné une demande d'abandon en cours pour le projet lauréat
        Quand le porteur confirme l'abandon pour le projet lauréat
        Alors le porteur devrait être informé que "Aucune demande de confirmation d'abandon en attente"

    Scénario: Impossible de confirmer l'abandon d'un projet lauréat si l'abandon a déjà été accordé
        Etant donné un abandon accordé pour le projet lauréat
        Quand le porteur confirme l'abandon pour le projet lauréat
        Alors le porteur devrait être informé que "L'abandon a déjà été accordé"

    Scénario: Impossible de confirmer l'abandon d'un projet lauréat si l'abandon a déjà été rejeté
        Etant donné un abandon rejeté pour le projet lauréat
        Quand le porteur confirme l'abandon pour le projet lauréat
        Alors le porteur devrait être informé que "L'abandon a déjà été rejeté"

    Scénario: Impossible de confirmer l'abandon d'un projet lauréat si l'abandon a déjà été confirmé
        Etant donné un abandon confirmé pour le projet lauréat
        Quand le porteur confirme l'abandon pour le projet lauréat
        Alors le porteur devrait être informé que "L'abandon a déjà été confirmé"

    Scénario: Impossible de confirmer l'abandon d'un projet lauréat si aucun abandon n'a été demandé
        Quand le porteur confirme l'abandon pour le projet lauréat
        Alors le porteur devrait être informé que "Aucun abandon n'est en cours"
