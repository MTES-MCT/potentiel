# language: fr
Fonctionnalité: Rejeter l'abandon d'un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et le porteur "Marcel Patoulatchi" ayant accés au projet lauréat "Du boulodrome de Marseille"

    Scénario: Un DGEC validateur rejette l'abandon d'un projet lauréat
        Etant donné une demande d'abandon en cours pour le projet lauréat
        Quand le DGEC validateur rejette l'abandon pour le projet lauréat
        Alors l'abandon du projet lauréat devrait être rejeté

    Scénario: Un DGEC validateur rejette l'abandon en instruction d'un projet lauréat
        Etant donné une demande d'abandon en instruction pour le projet lauréat
        Quand le DGEC validateur rejette l'abandon pour le projet lauréat
        Alors l'abandon du projet lauréat devrait être rejeté

    Scénario: Impossible de rejetter l'abandon d'un projet lauréat si l'abandon a déjà été accordé
        Etant donné un abandon accordé pour le projet lauréat
        Quand le DGEC validateur rejette l'abandon pour le projet lauréat
        Alors le DGEC validateur devrait être informé que "L'abandon a déjà été accordé"

    Scénario: Impossible de rejetter l'abandon d'un projet lauréat si aucun abandon n'a été demandé
        Quand le DGEC validateur rejette l'abandon pour le projet lauréat
        Alors le DGEC validateur devrait être informé que "Aucun abandon n'est en cours"
