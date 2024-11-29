# language: fr
Fonctionnalité: Demander le changement de représentant légal d'un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et le porteur "Marcel Patoulatchi" ayant accés au projet lauréat "Du boulodrome de Marseille"

    Scénario: Un porteur demande le changement de réprésentant légal d'un projet lauréat
        Quand le porteur demande le changement de réprésentant pour le projet lauréat
        Alors une demande de changement de représentant légal du projet lauréat devrait être consultable

    @select
    Scénario: Impossible de demander le changement de représentant légal d'un projet lauréat si le changement est déjà en cours
        Etant donné une demande de changement de représentant légal en cours pour le projet lauréat
        Quand le porteur demande le changement de représentant légal pour le projet lauréat
        Alors le porteur devrait être informé que "Une demande de changement de représentant légal est déjà en cours"

    # À valider
    @NotImplemented
    Scénario: Impossible de demander le changement de représentant légal d'un projet lauréat si il est le même que l'actuel
        Etant donné une demande de changement de représentant légal en cours pour le projet lauréat
        Quand le porteur demande le changement de représentant légal pour le projet lauréat avec le même représentant légal
        Alors le porteur devrait être informé que "Ce représentant légal est déjà associé au projet"
