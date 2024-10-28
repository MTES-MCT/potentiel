# language: fr
Fonctionnalité: Corriger le changement de représentant légal d'un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et le porteur "Marcel Patoulatchi" ayant accés au projet lauréat "Du boulodrome de Marseille"
        Et le DGEC validateur "Robert Robichet"

    @NotImplemented
    Scénario: Un porteur corrige son changement de représentant légal
        Etant donné une demande de changement de représentant légal en cours pour le projet lauréat
        Quand le porteur corrige le changement de représentant légal pour le projet lauréat
        Alors la demande de changement de représentant légal du projet lauréat devrait être corrigé

    @NotImplemented
    Scénario: Impossible d'accorder le changement de représentant légal d'un projet lauréat si aucun changement n'a été demandé
        Quand le porteur corrige le changement de représentant légal pour le projet lauréat
        Alors le porteur devrait être informé que "Aucun changement de représentant légal n'est en cours"

    @NotImplemented
    Scénario: Impossible de corriger le changement de représentant légal d'un projet lauréat si le changement a déjà été accordé
        Etant donné une demande de changement de représentant légal acordée pour le projet lauréat
        Quand le porteur corrige le changement de représentant légal pour le projet lauréat
        Alors le porteur devrait être informé que "Le changement de représentant légal a déjà été accordé"

    @NotImplemented
    Scénario: Impossible de corriger le changement de représentant légal d'un projet lauréat si le changement a déjà été rejété
        Etant donné une demande de changement de représentant légal rejetée pour le projet lauréat
        Quand le porteur corrige le changement de représentant légal pour le projet lauréat
        Alors le porteur devrait être informé que "Le changement de représentant légal a déjà été rejeté"
