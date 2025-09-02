# language: fr
@raccordement
Fonctionnalité: Transmettre une demande complète de raccordement

    Contexte:
        Etant donné le gestionnaire de réseau "Enedis"
        Et le projet lauréat "Du boulodrome de Marseille"
        Et un cahier des charges permettant la modification du projet
        Et le gestionnaire de réseau "Enedis" attribué au raccordement du projet lauréat

    Scénario: Un porteur de projet transmet une demande complète de raccordement pour son projet
        Quand le porteur transmet une demande complète de raccordement pour le projet lauréat
        Alors le dossier est consultable dans la liste des dossiers de raccordement du projet lauréat
        Et la demande complète de raccordement devrait être consultable dans le dossier de raccordement du projet lauréat
        Et le projet devrait avoir un raccordement attribué au gestionnaire de réseau "Enedis"
        Et aucune tâche n'est consultable dans la liste des tâches du porteur pour le projet lauréat

    Scénario: Un porteur de projet transmet une demande complète de raccordement pour son projet achevé
        Etant donné une attestation de conformité transmise pour le projet lauréat
        Quand le porteur transmet une demande complète de raccordement pour le projet lauréat
        Alors le dossier est consultable dans la liste des dossiers de raccordement du projet lauréat
        Et la demande complète de raccordement devrait être consultable dans le dossier de raccordement du projet lauréat
        Et le projet devrait avoir un raccordement attribué au gestionnaire de réseau "Enedis"
        Et aucune tâche n'est consultable dans la liste des tâches du porteur pour le projet lauréat

    Scénario: Le système transmet une demande complète de raccordement sans accusé de réception pour un projet lauréat
        Quand le système transmet une demande complète de raccordement sans accusé de réception pour le projet lauréat
        Alors le dossier est consultable dans la liste des dossiers de raccordement du projet lauréat
        Et la demande complète de raccordement devrait être consultable dans le dossier de raccordement du projet lauréat
        Et le projet devrait avoir un raccordement attribué au gestionnaire de réseau "Enedis"
        Et une tâche indiquant de "renseigner l'accusé de réception de la demande complète de raccordement" est consultable dans la liste des tâches du porteur pour le projet

    Scénario: Un porteur de projet transmet plusieurs demandes complètes de raccordement pour son projet
        Quand le porteur transmet une demande complète de raccordement pour le projet lauréat
        Et le porteur transmet une demande complète de raccordement pour le projet lauréat
        Alors le projet lauréat devrait avoir 2 dossiers de raccordement

    Scénario: Un porteur de projet transmet plusieurs demandes complètes de raccordement ayant la même référence
        Etant donné une demande complète de raccordement pour le projet lauréat avec :
            | La référence du dossier de raccordement | OUE-RP-2022-000033 |
        Quand le porteur transmet une demande complète de raccordement pour le projet lauréat avec :
            | La référence du dossier de raccordement | OUE-RP-2022-000033 |
        Alors le porteur devrait être informé que "Il est impossible d'avoir plusieurs dossiers de raccordement avec la même référence pour un projet"

    Scénario: Impossible de transmettre une demande complète de raccordement avec une référence ne correspondant pas au format défini par le gestionnaire de réseau
        Etant donné un gestionnaire de réseau
            | Code EIC             | 17X0000009352859 |
            | Raison sociale       | RTE              |
            | Expression régulière | ^[a-zA-Z]{3}$    |
        Et le gestionnaire de réseau "RTE" attribué au raccordement du projet lauréat
        Quand le porteur transmet une demande complète de raccordement pour le projet lauréat avec :
            | La référence du dossier de raccordement | UneRéférenceAvecUnFormatInvalide |
        Alors le porteur devrait être informé que "Le format de la référence du dossier de raccordement est invalide"

    Scénario: Impossible de transmettre une demande complète de raccordement avec une date de qualification dans le futur
        Quand le porteur transmet une demande complète de raccordement pour le projet lauréat avec :
            | La date de qualification | 2999-12-31 |
        Alors le porteur devrait être informé que "La date ne peut pas être une date future"

    Scénario: Impossible de transmettre une demande complète de raccordement si le projet est abandonné
        Etant donné un abandon accordé pour le projet lauréat
        Quand le porteur transmet une demande complète de raccordement pour le projet lauréat
        Alors le porteur devrait être informé que "Impossible de faire un changement pour un projet abandonné"

    Scénario: Impossible de transmettre une demande complète de raccordement si le projet est en cours d'abandon
        Etant donné une demande d'abandon en cours pour le projet lauréat
        Quand le porteur transmet une demande complète de raccordement pour le projet lauréat
        Alors le porteur devrait être informé que "Impossible de faire un changement car une demande d'abandon est en cours pour le projet"

    Scénario: Impossible de transmettre une demande complète de raccordement si le projet est éliminé
        Etant donné le projet éliminé "MIOS"
        Quand le porteur transmet une demande complète de raccordement pour le projet éliminé
        Alors le porteur devrait être informé que "Le projet lauréat n'existe pas"
