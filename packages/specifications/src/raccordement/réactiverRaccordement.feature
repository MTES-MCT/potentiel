# language: fr
@raccordement
@statut-raccordement
Fonctionnalité: Réactiver le raccordement d'un projet

    Contexte:
        Etant donné le gestionnaire de réseau "Enedis"
        Et le projet lauréat "Du boulodrome de Marseille"
        Et un cahier des charges permettant la modification du projet
        Et le gestionnaire de réseau "Enedis" attribué au raccordement du projet lauréat

    Scénario: Le signalement d'un PPA doit réactiver un raccordement désactivé par un abandon
        Etant donné une demande complète de raccordement pour le projet lauréat
        Et une demande d'abandon accordée pour le projet lauréat
        Quand un utilisateur "dgec" signale un état PPA pour le projet lauréat
        Et le dossier est consultable dans la liste des dossiers de raccordement du projet lauréat
        Et la demande complète de raccordement devrait être consultable dans le dossier de raccordement du projet lauréat   

    Scénario: Le signalement d'un PPA pour un projet en cours d'abandon doit rétablir les tâches et tâches planifiées liées au raccordement
        Etant donné le projet lauréat "Du boulodrome de Pantin" avec :
            | appel d'offres | PPE2 - Petit PV Bâtiment |
            | période        | 1                        |
        Et une demande d'abandon en cours pour le projet lauréat
        Quand un utilisateur "dgec" signale un état PPA pour le projet lauréat
        Et une tâche "relance transmission de la demande complète raccordement" est planifiée pour le projet lauréat
        Et une tâche indiquant de "mettre à jour le gestionnaire de réseau" est consultable dans la liste des tâches du porteur pour le projet
        Et une tâche indiquant de "transmettre une référence de raccordement" est consultable dans la liste des tâches du porteur pour le projet

    Scénario: Le signalement d'un PPA pour un projet abandonné doit rétablir les tâches et tâches planifiées liées au raccordement
        Etant donné le projet lauréat "Du boulodrome de Pantin" avec :
            | appel d'offres | PPE2 - Petit PV Bâtiment |
            | période        | 1                        |
        Et une demande d'abandon accordée pour le projet lauréat
        Quand un utilisateur "dgec" signale un état PPA pour le projet lauréat
        Et une tâche "relance transmission de la demande complète raccordement" est planifiée pour le projet lauréat
        Et une tâche indiquant de "mettre à jour le gestionnaire de réseau" est consultable dans la liste des tâches du porteur pour le projet
        Et une tâche indiquant de "transmettre une référence de raccordement" est consultable dans la liste des tâches du porteur pour le projet        