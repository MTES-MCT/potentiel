# language: fr
@raccordement
@gestionnaire-réseau-raccordement
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

    Scénario: Un gestionnaire de réseau est automatiquement attribué au raccordement d'un projet lauréat dont l'appel d'offres requière l'ajout du raccordement dans Potentiel
        Etant donné la candidature lauréate "Du boulodrome de Marseille" avec :
            | appel d'offres | PPE2 - Petit PV Bâtiment |
            | période        | 1                        |
        Quand le DGEC validateur notifie la candidature lauréate
        Alors le projet devrait avoir un raccordement attribué au gestionnaire de réseau
        Et une tâche indiquant de "transmettre une référence de raccordement" est consultable dans la liste des tâches du porteur pour le projet
        Et une tâche "relance demande complète raccordement" est planifiée pour le projet lauréat

    Scénario: Relancer les porteurs pour demander l'ajout dans Potentiel de la demande complète de raccordement du projet
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offres | PPE2 - Petit PV Bâtiment |
            | période        | 1                        |
        Etant donné une tâche planifiée pour le projet lauréat avec :
            | type             | relance demande complète raccordement |
            | date d'exécution | 2025-01-11                            |
        Quand on exécute la tâche planifiée "relance demande complète raccordement" pour le projet lauréat à la date du "2025-11-01"
        Alors un email a été envoyé au porteur avec :
            | sujet      | Potentiel - Attente de transmission de la DCR pour le projet Du boulodrome de Marseille              |
            | nom_projet | Du boulodrome de Marseille                                                                           |
            | url        | https://potentiel.beta.gouv.fr/laureats/(.*)/raccordements/demande-complete-raccordement:transmettre |
        Et une tâche "relance demande complète raccordement" est planifiée à la date du "2025-12-01" pour le projet lauréat
