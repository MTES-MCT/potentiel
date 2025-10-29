# language: fr
@représentant-légal
Fonctionnalité: Enregistrer un changement de représentant légal

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offres | PPE2 - Petit PV Bâtiment |
            | période        | 1                        |
        Et un cahier des charges permettant la modification du projet
        Et la dreal "Dreal du sud" associée à la région du projet

    Scénario: Enregistrer un changement de représentant légal
        Quand le porteur enregistre un changement de représentant légal le "2024-10-24"
        Alors le changement enregistré du représentant légal du projet lauréat devrait être consultable
        Et le représentant légal du projet lauréat devrait être mis à jour
        Et un email a été envoyé à la dreal avec :
            | sujet      | Potentiel - Déclaration de changement de représentant légal pour le projet Du boulodrome de Marseille dans le département(.*) |
            | nom_projet | Du boulodrome de Marseille                                                                                                    |
            | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                                         |
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - Déclaration de changement de représentant légal pour le projet Du boulodrome de Marseille dans le département(.*) |
            | nom_projet | Du boulodrome de Marseille                                                                                                    |
            | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                                         |
        Et une tâche "supprimer automatiquement le document à trois mois" est planifiée à la date du "2025-01-24" pour le projet lauréat

    Scénario: Impossible d'enregistrer un changement de représentant légal si l'AO ne le permet pas
        Etant donné le projet lauréat "Du boulodrome de Lyon" avec :
            | appel d'offres | PPE2 - Bâtiment |
        Quand le porteur enregistre un changement de représentant légal
        Alors le porteur devrait être informé que "Le cahier des charges de ce projet ne permet pas ce changement"

    Scénario: Impossible d'enregistrer un changement de représentant légal sans modification
        Quand le porteur enregistre un changement de représentant légal avec les mêmes valeurs
        Alors le porteur devrait être informé que "Le représentant légal est identique à celui déjà associé au projet"

    Scénario: Impossible d'enregistrer un changement de représentant légal d'un projet lauréat abandonné
        Etant donné un abandon accordé pour le projet lauréat
        Quand le porteur enregistre un changement de représentant légal
        Alors le porteur devrait être informé que "Impossible de faire un changement pour un projet abandonné"

    Scénario: Impossible d'enregistrer un changement de représentant légal avec une demande d'abandon en cours
        Etant donné une demande d'abandon en cours pour le projet lauréat
        Quand le porteur enregistre un changement de représentant légal
        Alors le porteur devrait être informé que "Impossible de faire un changement car une demande d'abandon est en cours pour le projet"

    Scénario: Impossible d'enregistrer un changement de représentant légal si le projet est achevé
        Etant donné une attestation de conformité transmise pour le projet lauréat
        Quand le porteur enregistre un changement de représentant légal
        Alors le porteur devrait être informé que "Impossible de faire un changement pour un projet achevé"

    # règles métier à challenger
    @NotImplemented
    Scénario: Impossible d'enregistrer un changement de représentant légal d'un projet lauréat si son type est inconnu
        Quand le porteur enregistre un changement de représentant légal avec un type inconnu
        Alors le porteur devrait être informé que "Le représentant légal ne peut pas avoir de type inconnu"

    Scénario: Le document sensible est automatiquement supprimé 3 mois après la déclaration de changement de représentant légal
        Etant donné le projet lauréat "Du boulodrome de Lyon" avec :
            | appel d'offres | PPE2 - Petit PV Bâtiment |
            | période        | 1                        |
        Et un cahier des charges permettant la modification du projet
        Et un changement de représentant légal enregistré pour le projet lauréat
        Quand on exécute la tâche planifiée "supprimer automatiquement le document à trois mois" pour le projet lauréat
        Alors il n'y a pas de tâche "supprimer automatiquement le document à trois mois" planifiée pour le projet lauréat
        Et le document sensible fourni lors du changement de représentant légal devrait être remplacé

    Scénario: Le document sensible est automatiquement supprimé et une tâche planifiée est créée lorsqu'un nouveau changement de représentant légal est déclaré
        Etant donné le projet lauréat "Du boulodrome de Lyon" avec :
            | appel d'offres | PPE2 - Petit PV Bâtiment |
            | période        | 1                        |
        Et un cahier des charges permettant la modification du projet
        Et un changement de représentant légal enregistré pour le projet lauréat le "2024-09-24"
        Quand le porteur enregistre un changement de représentant légal le "2024-10-24"
        Alors une tâche "supprimer automatiquement le document à trois mois" est planifiée à la date du "2025-01-24" pour le projet lauréat
        Et le document sensible fourni lors du changement de représentant légal datant du "2024-09-24" devrait être remplacé
