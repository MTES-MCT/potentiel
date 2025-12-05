# language: fr
@représentant-légal
Fonctionnalité: Supprimer la demande de changement de représentant légal

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et la dreal "Dreal du sud-ouest" associée à la région du projet
        Et un cahier des charges permettant la modification du projet

    Scénario: Le système supprime la demande de changement de représentant légal ainsi que la tâche planifiée d'instruction automatique d'un projet si celui-ci est abandonné
        Etant donné une demande de changement de représentant légal en cours pour le projet lauréat
        Et une demande d'abandon en cours pour le projet lauréat
        Quand le DGEC validateur accorde la demande d'abandon pour le projet lauréat
        Alors la demande de changement de représentant légal du projet lauréat ne devrait plus être consultable
        Et il n'y a pas de tâche "gestion automatique de la demande de changement de représentant légal" planifiée pour le projet lauréat
        Et il n'y a pas de tâche "rappel d'instruction de la demande de changement de représentant légal à deux mois" planifiée pour le projet lauréat
