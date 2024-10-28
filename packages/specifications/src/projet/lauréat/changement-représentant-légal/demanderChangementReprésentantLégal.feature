# language: fr
Fonctionnalité: Demander le changement de représentant légal d'un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et le porteur "Marcel Patoulatchi" ayant accés au projet lauréat "Du boulodrome de Marseille"
        Et le DGEC validateur "Robert Robichet"
        Et la DREAL associée au projet lauréat

    @NotImplemented
    Scénario: Un porteur demande le changement de réprésentant légal d'un projet lauréat
        Quand le porteur demande le changement de réprésentant pour le projet lauréat
        Alors le changement de représentant légal du projet lauréat devrait être demandé

    @NotImplemented
    Scénario: Impossible de demander le changement de représentant légal d'un projet lauréat si le changement est déjà en cours
        Etant donné une demande de changement de représentant légal en cours pour le projet lauréat
        Quand le porteur demande le changement de représentant légal pour le projet lauréat
        Alors le porteur devrait être informé que "Une demande de changement de représentant légal est déjà en cours"

    @NotImplemented
    Scénario: Impossible de demander le changement de représentant légal d'un projet éliminé
        Etant donné le projet éliminé "Centrale PV"
        Et le porteur "Marcel Patoulatchi" ayant accés au projet lauréat "Centrale PV"
        Quand le porteur demande le changement de représentant légal pour le projet éliminé
        Alors le porteur devrait être informé que "Il est impossible de changer le représentant légal d'un projet éliminé"
