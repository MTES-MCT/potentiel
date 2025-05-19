# language: fr
Fonctionnalité: Demander une confirmation d'abandon d'un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"

    Scénario: Un DGEC validateur demande une confirmation d'abandon d'un projet lauréat
        Etant donné une demande d'abandon en cours pour le projet lauréat
        Quand le DGEC validateur demande une confirmation d'abandon pour le projet lauréat
        Alors la confirmation d'abandon du projet lauréat devrait être demandée
        Et une tâche indiquant de "confirmer un abandon" est consultable dans la liste des tâches du porteur pour le projet

    Scénario: Un DGEC validateur demande une confirmation d'abandon d'un projet lauréat en instruction
        Etant donné une demande d'abandon en instruction pour le projet lauréat
        Quand le DGEC validateur demande une confirmation d'abandon pour le projet lauréat
        Alors la confirmation d'abandon du projet lauréat devrait être demandée
        Et une tâche indiquant de "confirmer un abandon" est consultable dans la liste des tâches du porteur pour le projet

    Scénario: Impossible de demande une confirmation d'abandon d'un projet lauréat si l'abandon a déjà été accordé
        Etant donné un abandon accordé pour le projet lauréat
        Quand le DGEC validateur demande une confirmation d'abandon pour le projet lauréat
        Alors le DGEC validateur devrait être informé que "L'abandon a déjà été accordé"

    Scénario: Impossible de demande une confirmation d'abandon d'un projet lauréat si l'abandon a déjà été rejeté
        Etant donné un abandon rejeté pour le projet lauréat
        Quand le DGEC validateur demande une confirmation d'abandon pour le projet lauréat
        Alors le DGEC validateur devrait être informé que "L'abandon a déjà été rejeté"

    Scénario: Impossible de demande une confirmation d'abandon d'un projet lauréat si la confirmation d'abandon a déjà été demandé
        Etant donné une confirmation d'abandon demandée pour le projet lauréat
        Quand le DGEC validateur demande une confirmation d'abandon pour le projet lauréat
        Alors le DGEC validateur devrait être informé que "La confirmation de l'abandon a déjà été demandée"

    Scénario: Impossible de demande une confirmation d'abandon d'un projet lauréat si l'abandon a déjà été confirmé
        Etant donné un abandon confirmé pour le projet lauréat
        Quand le DGEC validateur demande une confirmation d'abandon pour le projet lauréat
        Alors le DGEC validateur devrait être informé que "L'abandon a déjà été confirmé"

    Scénario: Impossible de demande une confirmation d'abandon d'un projet lauréat si aucun abandon n'a été demandé
        Quand le DGEC validateur demande une confirmation d'abandon pour le projet lauréat
        Alors le DGEC validateur devrait être informé que "Aucun abandon n'est en cours"
