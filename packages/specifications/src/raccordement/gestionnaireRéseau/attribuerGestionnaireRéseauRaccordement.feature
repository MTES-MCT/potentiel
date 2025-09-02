# language: fr
@raccordement
Fonctionnalité: Attribuer un gestionnaire de réseau au raccordement d'un projet

    Contexte:
        Etant donné le gestionnaire de réseau "EDF Corse"
        Et le gestionnaire de réseau "Arc Energies Maurienne"
        Et le gestionnaire de réseau "Enedis"
        Et le référentiel ORE

    Scénario: Un gestionnaire de réseau est automatiquement attribué au raccordement d'un projet lauréat
        Etant donné la candidature lauréate "Du boulodrome de Marseille"
        Quand le DGEC validateur notifie la candidature lauréate
        Alors le projet devrait avoir un raccordement attribué au gestionnaire de réseau
        Et une tâche indiquant de "transmettre une référence de raccordement" est consultable dans la liste des tâches du porteur pour le projet

    Scénario: Un gestionnaire de réseau inconnu est automatiquement attribué au raccordement d'un projet lauréat si son GRD n'est pas trouvé
        Etant donné la candidature lauréate "Boulodrome Sainte Livrade" avec :
            | commune     | N/A |
            | code postal | N/A |
        Quand le DGEC validateur notifie la candidature lauréate
        Alors le projet devrait avoir un raccordement attribué au gestionnaire de réseau inconnu
        Et une tâche indiquant de "mettre à jour le gestionnaire de réseau" est consultable dans la liste des tâches du porteur pour le projet

    Scénario: Le système attribue un gestionnaire de réseau non référencé
        Quand le système attribue un gestionnaire de réseau non référencé au projet
        Alors le système devrait être informé que "Le gestionnaire de réseau n'est pas référencé"
