# language: fr
Fonctionnalité: Supprimer le raccordement d'un projet

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et le porteur "Barbara Gordon" ayant accés au projet lauréat "Du boulodrome de Marseille"

    Scénario: Le système supprime le raccordement d'un projet si celui-ci a un abandon accordé
        Etant donné un gestionnaire de réseau
            | Code EIC       | 17X0000009352859       |
            | Raison sociale | Arc Energies Maurienne |
        Et le gestionnaire de réseau "Arc Energies Maurienne" attribué au raccordement du projet lauréat "Du boulodrome de Marseille"
        Et une demande complète de raccordement pour le projet lauréat "Du boulodrome de Marseille" transmise auprès du gestionnaire de réseau "Arc Energies Maurienne" avec :
            | La date de qualification                | 2022-10-28         |
            | La référence du dossier de raccordement | OUE-RP-2022-000033 |
            | Le format de l'accusé de réception      | application/pdf    |
            | Le contenu de l'accusé de réception     | contenu            |
        Et une proposition technique et financière pour le dossier ayant comme référence "OUE-RP-2022-000033" du raccordement pour le projet lauréat "Du boulodrome de Marseille" avec :
            | La date de signature                                | 2023-01-10      |
            | Le format de la proposition technique et financière | application/pdf |
            | Le contenu de proposition technique et financière   | contenu         |
        Et une date de mise en service "2024-01-01" pour le dossier ayant comme référence "OUE-RP-2022-000033" du raccordement pour le projet lauréat "Du boulodrome de Marseille"
        Et une demande d'abandon en cours pour le projet lauréat
        Quand le DGEC validateur accorde l'abandon pour le projet lauréat
        Alors le dossier ayant comme référence "OUE-RP-2022-000033" ne devrait plus être consultable dans le raccordement du projet lauréat "Du boulodrome de Marseille"

    Scénario: Le système supprime les tâches de raccordement d'un projet si celui-ci a un abandon accordé
        Etant donné le gestionnaire de réseau inconnu attribué au raccordement du projet lauréat "Du boulodrome de Marseille"
        Et une demande d'abandon en cours pour le projet lauréat
        Quand le DGEC validateur accorde l'abandon pour le projet lauréat
        Alors une tâche indiquant de "mettre à jour le gestionnaire de réseau" n'est plus consultable dans la liste des tâches du porteur pour le projet
