# language: fr
Fonctionnalité: Accorder l'abandon d'un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et le porteur "Marcel Patoulatchi" ayant accés au projet lauréat "Du boulodrome de Marseille"

    Scénario: Un DGEC validateur accorde l'abandon d'un projet lauréat
        Etant donné une demande d'abandon en cours pour le projet lauréat
        Quand le DGEC validateur accorde l'abandon pour le projet lauréat
        Alors l'abandon du projet lauréat devrait être accordé

    Scénario: Le porteur reçoit une demande de preuve de recandidature quand l'abandon avec recandidature d'un projet lauréat a été accordé
        Etant donné une demande d'abandon en cours avec recandidature pour le projet lauréat
        Quand le DGEC validateur accorde l'abandon pour le projet lauréat
        Alors la preuve de recandidature a été demandée au porteur du projet lauréat
        Et une tâche indiquant de "transmettre la preuve de recandidature" est consultable dans la liste des tâches du porteur pour le projet

    Scénario: Impossible d'accorder l'abandon d'un projet lauréat si l'abandon a déjà été accordé
        Etant donné un abandon accordé pour le projet lauréat
        Quand le DGEC validateur accorde l'abandon pour le projet lauréat
        Alors le DGEC validateur devrait être informé que "L'abandon a déjà été accordé"

    Scénario: Impossible d'accorder l'abandon d'un projet lauréat si l'abandon a déjà été rejeté
        Etant donné un abandon rejeté pour le projet lauréat
        Quand le DGEC validateur accorde l'abandon pour le projet lauréat
        Alors le DGEC validateur devrait être informé que "L'abandon a déjà été rejeté"

    Scénario: Impossible d'accorder l'abandon d'un projet lauréat si aucun abandon n'a été demandé
        Quand le DGEC validateur accorde l'abandon pour le projet lauréat
        Alors le DGEC validateur devrait être informé que "Aucun abandon n'est en cours"
