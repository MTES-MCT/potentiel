# language: fr
Fonctionnalité: Supprimer un dossier du raccordement d'un projet

    Contexte:
        Etant donné le gestionnaire de réseau "Enedis"
        Et le projet lauréat "Du boulodrome de Marseille"
        Et une demande complète de raccordement pour le projet lauréat
        Et une proposition technique et financière pour le dossier de raccordement du projet lauréat

    Scénario: Un porteur supprime un dossier du raccordement d'un projet
        Quand le porteur supprime le dossier de raccordement pour le projet lauréat
        Alors le dossier ne devrait plus être consultable dans la liste des dossiers du raccordement pour le projet

    Scénario: Le système supprime la tâche liée à la référence d'un dossier de raccordement si celui-ci est supprimé
        Etant donné une tâche indiquant de "transmettre une référence de raccordement" pour le projet lauréat
        Quand le porteur supprime le dossier de raccordement pour le projet lauréat
        Alors une tâche indiquant de "transmettre une référence de raccordement" n'est plus consultable dans la liste des tâches du porteur pour le projet

    Scénario: Le système supprime la tâches liée à l'accusé de réception d'un dossier de raccordement si celui-ci est supprimé
        Etant donné une tâche indiquant de "renseigner l'accusé de réception de la demande complète de raccordement" pour le projet lauréat
        Quand le porteur supprime le dossier de raccordement pour le projet lauréat
        Alors une tâche indiquant de "renseigner l'accusé de réception de la demande complète de raccordement" n'est plus consultable dans la liste des tâches du porteur pour le projet

    Scénario: Impossible de supprimer un dossier non référencé dans le raccordement du projet
        Quand le porteur supprime le dossier de raccordement pour le projet lauréat avec pour référence "OUE-RP-2022-000033"
        Alors le porteur devrait être informé que "Le dossier n'est pas référencé dans le raccordement de ce projet"

    Scénario: Impossible de supprimer un dossier ayant déjà une date de mise en service
        Etant donné une date de mise en service pour le dossier de raccordement du projet lauréat
        Quand le porteur supprime le dossier de raccordement pour le projet lauréat
        Alors le porteur devrait être informé que "Un dossier avec une date de mise en service ne peut pas être supprimé"
