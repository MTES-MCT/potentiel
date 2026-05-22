# language: fr
@raccordement
@statut-raccordement
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
        Alors aucun raccordement ni dossier de raccordement ne devrait être consultable pour le projet

    Scénario: Le système supprime les tâches de raccordement d'un projet en cas d'abandon accordé
        Etant donné le gestionnaire de réseau inconnu attribué au raccordement du projet lauréat
        Et une demande d'abandon en cours pour le projet lauréat
        Quand le DGEC validateur accorde la demande d'abandon pour le projet lauréat
        Alors il n'y a pas de tâche "relance transmission de la demande complète raccordement" planifiée pour le projet lauréat
        Et une tâche indiquant de "mettre à jour le gestionnaire de réseau" n'est plus consultable dans la liste des tâches du porteur pour le projet
        Et une tâche indiquant de "transmettre une référence de raccordement" n'est plus consultable dans la liste des tâches du porteur pour le projet
        Et une tâche indiquant de "renseigner l'accusé de réception de la demande complète de raccordement" n'est plus consultable dans la liste des tâches du porteur pour le projet

    Scénario: Le raccordement d'un projet signataire d'un PPA reste consultable en cas d'abandon accordé
        Etant donné une demande complète de raccordement pour le projet lauréat
        Et une demande d'abandon avec déclaration de PPA en cours pour le projet lauréat
        Quand le DGEC validateur accorde la demande d'abandon pour le projet lauréat
        Alors le dossier est consultable dans la liste des dossiers de raccordement du projet lauréat

    Scénario: Le raccordement d'un projet abandonné n'est plus consultable en cas d'annulation d'un état PPA
        Etant donné une demande complète de raccordement pour le projet lauréat
        Et une demande d'abandon accordée avec déclaration de PPA
        Quand un utilisateur "dgec" annule un état PPA pour le projet lauréat
        Alors aucun raccordement ni dossier de raccordement ne devrait être consultable pour le projet

    Scénario: L'annulation d'un état PPA pour un projet abandonné doit supprimer les tâches et tâches planifiées liées au raccordement
        Etant donné le projet lauréat "Du boulodrome de Pantin" avec :
            | appel d'offres | PPE2 - Petit PV Bâtiment |
            | période        | 1                        |
        Et une demande d'abandon accordée avec déclaration de PPA
        Quand un utilisateur "dgec" annule un état PPA pour le projet lauréat
        Et il n'y a pas de tâche "relance transmission de la demande complète raccordement" planifiée pour le projet lauréat
        Et une tâche indiquant de "mettre à jour le gestionnaire de réseau" n'est plus consultable dans la liste des tâches du porteur pour le projet
        Et une tâche indiquant de "transmettre une référence de raccordement" n'est plus consultable dans la liste des tâches du porteur pour le projet
        Et une tâche indiquant de "renseigner l'accusé de réception de la demande complète de raccordement" n'est plus consultable dans la liste des tâches du porteur pour le projet

    Scénario: L'annulation d'un état PPA pour un projet en cours d'abandon doit supprimer les tâches et tâches planifiées liées au raccordement
        Etant donné le projet lauréat "Du boulodrome de Pantin" avec :
            | appel d'offres | PPE2 - Petit PV Bâtiment |
            | période        | 1                        |
        Et une demande d'abandon avec déclaration de PPA en cours pour le projet lauréat
        Quand un utilisateur "dgec" annule un état PPA pour le projet lauréat
        Et il n'y a pas de tâche "relance transmission de la demande complète raccordement" planifiée pour le projet lauréat
        Et une tâche indiquant de "mettre à jour le gestionnaire de réseau" n'est plus consultable dans la liste des tâches du porteur pour le projet
        Et une tâche indiquant de "transmettre une référence de raccordement" n'est plus consultable dans la liste des tâches du porteur pour le projet
        Et une tâche indiquant de "renseigner l'accusé de réception de la demande complète de raccordement" n'est plus consultable dans la liste des tâches du porteur pour le projet