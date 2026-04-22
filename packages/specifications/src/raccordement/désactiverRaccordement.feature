# language: fr
@raccordement
Fonctionnalité: Supprimer le raccordement d'un projet

    Contexte:
        Etant donné le gestionnaire de réseau "Arc Energies Maurienne"
        Et le référentiel ORE
        Et le projet lauréat "Du boulodrome de Marseille"
        Et un cahier des charges permettant la modification du projet

    Scénario: Le raccordement d'un projet n'est plus consultable en cas d'abandon accordé
        Etant donné une demande complète de raccordement pour le projet lauréat
        Et une proposition technique et financière pour le projet lauréat
        Et une date de mise en service pour le dossier de raccordement du projet lauréat
        Et une demande d'abandon en cours pour le projet lauréat
        Quand le DGEC validateur accorde la demande d'abandon pour le projet lauréat
        Alors le dossier de raccordement ne devrait plus être consultable dans le raccordement du projet lauréat
        Et le dossier de raccordement ne devrait plus être consultable dans la liste des dossiers de raccordement

    Scénario: Le système supprime les tâches de raccordement d'un projet en cas d'abandon accordé
        Etant donné le gestionnaire de réseau inconnu attribué au raccordement du projet lauréat
        Et une demande d'abandon en cours pour le projet lauréat
        Quand le DGEC validateur accorde la demande d'abandon pour le projet lauréat
        Et il n'y a pas de tâche "relance transmission de la demande complète raccordement" planifiée pour le projet lauréat
        Et une tâche indiquant de "transmettre une référence de raccordement" n'est plus consultable dans la liste des tâches du porteur pour le projet
        Alors une tâche indiquant de "mettre à jour le gestionnaire de réseau" n'est plus consultable dans la liste des tâches du porteur pour le projet
