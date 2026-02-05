# language: fr
@raccordement
@dossier-raccordement
Fonctionnalité: Supprimer un dossier du raccordement d'un projet

    Contexte:
        Etant donné le gestionnaire de réseau "Enedis"
        Et le projet lauréat "Du boulodrome de Marseille"
        Et une demande complète de raccordement pour le projet lauréat
        Et une proposition technique et financière pour le projet lauréat

    Scénario: Un porteur supprime un dossier du raccordement d'un projet avec plusieurs dossiers
        # Ajout d'un deuxième dossier pour s'assurer qu'il en reste un après suppression
        Etant donné une demande complète de raccordement pour le projet lauréat
        Quand le porteur supprime le dossier de raccordement pour le projet lauréat
        Alors le dossier ne devrait plus être consultable dans la liste des dossiers du raccordement pour le projet
        Et une tâche indiquant de "transmettre une référence de raccordement" n'est plus consultable dans la liste des tâches du porteur pour le projet

    Scénario: Un administrateur supprime un dossier du raccordement ayant une date de mise en service
        Etant donné une date de mise en service pour le dossier de raccordement du projet lauréat
        Quand l'administrateur supprime le dossier de raccordement pour le projet lauréat
        Alors le dossier ne devrait plus être consultable dans la liste des dossiers du raccordement pour le projet

    Scénario: Un administrateur supprime un dossier du raccordement pour un projet achevé
        Etant donné une attestation de conformité transmise pour le projet lauréat
        Quand l'administrateur supprime le dossier de raccordement pour le projet lauréat
        Alors le dossier ne devrait plus être consultable dans la liste des dossiers du raccordement pour le projet

    Scénario: Un porteur supprime le dernier dossier du raccordement d'un projet
        Quand le porteur supprime le dossier de raccordement pour le projet lauréat
        Alors le dossier ne devrait plus être consultable dans la liste des dossiers du raccordement pour le projet
        Et une tâche indiquant de "transmettre une référence de raccordement" est consultable dans la liste des tâches du porteur pour le projet

    Scénario: Le système supprime la tâche liée à l'accusé de réception d'un dossier de raccordement si celui-ci est supprimé
        Etant donné une demande complète de raccordement sans accusé de réception pour le projet lauréat
        Quand le porteur supprime le dossier de raccordement pour le projet lauréat
        Alors une tâche indiquant de "renseigner l'accusé de réception de la demande complète de raccordement" n'est plus consultable dans la liste des tâches du porteur pour le projet

    Scénario: Le système ne supprime pas la tâche liée à l'accusé de réception d'un dossier de raccordement si un autre dossier est supprimé
        Etant donné le projet lauréat "Du boulodrome de Lyon"
        Et une demande complète de raccordement sans accusé de réception pour le projet lauréat
        Et une demande complète de raccordement pour le projet lauréat
        Quand le porteur supprime le dossier de raccordement pour le projet lauréat
        Alors une tâche indiquant de "renseigner l'accusé de réception de la demande complète de raccordement" est consultable dans la liste des tâches du porteur pour le projet

    Scénario: Impossible de supprimer un dossier non référencé dans le raccordement du projet
        Quand le porteur supprime un dossier de raccordement non référencé pour le projet lauréat
        Alors le porteur devrait être informé que "Le dossier n'est pas référencé dans le raccordement de ce projet"

    Scénario: Impossible pour un porteur de projet de supprimer un dossier ayant déjà une date de mise en service
        Etant donné une date de mise en service pour le dossier de raccordement du projet lauréat
        Quand le porteur supprime le dossier de raccordement pour le projet lauréat
        Alors le porteur devrait être informé que "Un dossier avec une date de mise en service ne peut pas être supprimé"

    Scénario: Impossible pour un porteur de projet de supprimer un dossier lorsque le projet est achevé
        Etant donné une attestation de conformité transmise pour le projet lauréat
        Quand le porteur supprime le dossier de raccordement pour le projet lauréat
        Alors le porteur devrait être informé que "Impossible de faire un changement pour un projet achevé"
