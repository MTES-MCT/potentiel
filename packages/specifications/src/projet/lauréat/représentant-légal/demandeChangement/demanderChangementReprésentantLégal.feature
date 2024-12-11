# language: fr
Fonctionnalité: Demander le changement de représentant légal d'un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et le porteur "Marcel Patoulatchi" ayant accés au projet lauréat "Du boulodrome de Marseille"

    Scénario: Un porteur demande le changement de réprésentant légal d'un projet lauréat
        Quand le porteur demande le changement de réprésentant pour le projet lauréat
        Alors une demande de changement de représentant légal du projet lauréat devrait être consultable

    Scénario: Impossible de demander le changement de représentant légal d'un projet lauréat si le changement est déjà en cours
        Etant donné une demande de changement de représentant légal en cours pour le projet lauréat
        Quand le porteur demande le changement de réprésentant pour le projet lauréat
        Alors le porteur devrait être informé que "Une demande de changement de représentant légal est déjà en cours"

    Scénario: Impossible de demander le changement de représentant légal d'un projet lauréat s'il est le même que l'actuel
        Quand le porteur demande le changement de réprésentant pour le projet lauréat avec les mêmes valeurs
        Alors le porteur devrait être informé que "Le représentant légal est identique à celui déjà associé au projet"

    Scénario: Impossible de demander le changement de représentant légal d'un projet lauréat si son type est inconnu
        Quand le porteur demande le changement de réprésentant pour le projet lauréat avec un type inconnu
        Alors le porteur devrait être informé que "Le représentant légal ne peut pas avoir de type inconnu"

    Scénario: Impossible de demander le changement de représentant légal sans pièce justificative
        Quand le porteur demande le changement de réprésentant pour le projet lauréat sans pièce justificative
        Alors le porteur devrait être informé que "Les pièces justificatives sont obligatoires"

    @NotImplemented
    Scénario: Impossible de demander le changement de représentant légal d'un projet lauréat abandonné
        Quand le porteur demande le changement de réprésentant pour le projet lauréat sans pièce justificative
        Alors le porteur devrait être informé que "Impossible de demander le changement de réprésentant légal pour un projet abandonné"

    @NotImplemented
    Scénario: Impossible de demander le changement de représentant légal avec une demande d'abandon en cours
        Etant donné une demande d'abandon en cours pour le projet lauréat
        Quand le porteur demande le changement de réprésentant pour le projet lauréat sans pièce justificative
        Alors le porteur devrait être informé que "Impossible de demander le changement de réprésentant légal car une demande d'abandon est en cours pour le projet"

    @NotImplemented
    Scénario: Impossible de demander le changement de représentant légal si le projet est déjà en service
        Quand le porteur demande le changement de réprésentant pour le projet lauréat sans pièce justificative

    @NotImplemented
    Scénario: Impossible de demander le changement de représentant légal si le projet est achevé (= attestation de conformité délivrée)

