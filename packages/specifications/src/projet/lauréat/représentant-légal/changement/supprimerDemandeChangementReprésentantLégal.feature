# language: fr
Fonctionnalité: Supprimer la demande de changement de représentant légal

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et le porteur "Marcel Patoulatchi" ayant accés au projet lauréat "Du boulodrome de Marseille"
        Et la dreal "Dreal du sud-ouest" associée à la région du projet

    @select
    Scénario: Le système supprime la demande de changement de représentant légal d'un projet si celui-ci est abandonné
        Etant donné une demande de changement de représentant légal en cours pour le projet lauréat
        Et une demande d'abandon en cours pour le projet lauréat
        Quand le DGEC validateur accorde l'abandon pour le projet lauréat
        Alors la demande de changement de représentant légal du projet lauréat ne devrait plus être consultable
        Et une tâche "gestion automatique de la demande de changement de représentant légal" n'est plus planifiée pour le projet "Du boulodrome de Marseille"
