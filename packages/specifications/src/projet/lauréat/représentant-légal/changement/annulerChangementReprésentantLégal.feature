# language: fr
Fonctionnalité: Annuler la demande de changement de représentant légal d'un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et le porteur "Marcel Patoulatchi" ayant accés au projet lauréat "Du boulodrome de Marseille"
        Et la dreal "Dreal du sud-ouest" associée à la région du projet

    @select
    Scénario: Un porteur annule la demande de changement de représentant légal d'un projet lauréat
        Etant donné une demande de changement de représentant légal en cours pour le projet lauréat
        Quand le porteur annule la demande de changement de représentant légal pour le projet lauréat
        Alors la demande de changement de représentant légal du projet lauréat ne devrait plus exister

    @NotImplemented
    Scénario: Impossible d'annuler la demande de changement de représentant légal d'un projet lauréat si aucun changement n'a été demandé
        Quand le porteur annule la demande de changement de représentant légal pour le projet lauréat
        Alors le porteur devrait être informé que "Aucun changement de représentant légal n'est en cours"

    @NotImplemented
    Scénario: Impossible d'annuler la demande de changement de représentant légal d'un projet lauréat si il a déjà été accordé
        Etant donné un abandon accordé pour le projet lauréat
        Quand le porteur annule la demande de changement de représentant légal pour le projet lauréat
        Alors le porteur devrait être informé que "Le changement de représentant légal a déjà été accordé"

    @NotImplemented
    Scénario: Impossible d'annuler la demande de changement de représentant légal d'un projet lauréat si il a déjà été rejeté
        Etant donné un abandon rejeté pour le projet lauréat
        Quand le porteur annule la demande de changement de représentant légal pour le projet lauréat
        Alors le porteur devrait être informé que "Le changement de représentant légal a déjà été rejeté"
