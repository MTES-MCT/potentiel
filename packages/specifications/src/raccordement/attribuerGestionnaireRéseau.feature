# language: fr
Fonctionnalité: Attribuer un gestionnaire de réseau au raccordement d'un projet

    Contexte:
        Etant donné le gestionnaire de réseau "EDF Corse"
        Et le gestionnaire de réseau "Arc Energies Maurienne"
        Et le gestionnaire de réseau "Enedis"
        Et le référentiel ORE
        Et le projet lauréat "Du boulodrome de Marseille"

    Scénario: Un gestionnaire de réseau est automatiquement attribué au raccordement d'un projet lauréat
        Alors le projet devrait avoir un raccordement attribué au gestionnaire de réseau

    Scénario: Un gestionnaire de réseau inconnu est automatiquement attribué au raccordement d'un projet lauréat si son GRD n'est pas trouvé
        Etant donné le projet lauréat "Boulodrome Sainte Livrade" avec :
            | commune     | N/A |
            | code postal | N/A |
        Et le porteur "Marcel Patoulatchi" ayant accés au projet lauréat "Boulodrome Sainte Livrade"
        # Quand le gestionnaire de réseau inconnu est attribué au raccordement du projet lauréat "Boulodrome Sainte Livrade"
        Alors le projet devrait avoir un raccordement attribué au gestionnaire de réseau inconnu
        Et une tâche indiquant de "mettre à jour le gestionnaire de réseau" est consultable dans la liste des tâches du porteur pour le projet
