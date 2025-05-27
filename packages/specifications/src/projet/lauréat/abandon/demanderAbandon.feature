# language: fr
Fonctionnalité: Demander l'abandon d'un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et un cahier des charges modificatif choisi

    Scénario: Un porteur demande l'abandon d'un projet lauréat
        Quand le porteur demande l'abandon pour le projet lauréat
        Alors l'abandon du projet lauréat devrait être demandé

    Scénario: Un porteur demande l'abandon d'un projet lauréat après un rejet
        Etant donné un abandon rejeté pour le projet lauréat
        Quand le porteur demande l'abandon pour le projet lauréat
        Alors l'abandon du projet lauréat devrait être de nouveau demandé

    Scénario: Impossible de demander l'abandon d'un projet si l'abandon est déjà en cours (demandé)
        Etant donné une demande d'abandon en cours pour le projet lauréat
        Quand le porteur demande l'abandon pour le projet lauréat
        Alors le porteur devrait être informé que "Une demande d'abandon est déjà en cours"

    Scénario: Impossible de demander l'abandon d'un projet si l'abandon est déjà en cours (en instruction)
        Etant donné une demande d'abandon en instruction pour le projet lauréat
        Quand le porteur demande l'abandon pour le projet lauréat
        Alors le porteur devrait être informé que "Une demande d'abandon est déjà en cours"

    Scénario: Impossible de demander l'abandon d'un projet si l'abandon est accordé
        Etant donné un abandon accordé pour le projet lauréat
        Quand le porteur demande l'abandon pour le projet lauréat
        Alors le porteur devrait être informé que "L'abandon a déjà été accordé"

    Scénario: Impossible de demander l'abandon d'un projet achevé
        Etant donné une attestation de conformité transmise pour le projet lauréat
        Quand le porteur demande l'abandon pour le projet lauréat
        Alors le porteur devrait être informé que "Impossible de demander l'abandon d'un projet achevé"
