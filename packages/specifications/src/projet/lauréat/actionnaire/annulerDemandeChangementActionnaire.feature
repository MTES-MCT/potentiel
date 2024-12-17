# language: fr
Fonctionnalité: Demander le changement de l'actionnaire d'un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et le porteur "Marcel Patoulatchi" ayant accés au projet lauréat "Du boulodrome de Marseille"
        Et la dreal "DREAL" associée à la région du projet

    Scénario: Annuler la demande de changement de l'actionnaire d'un projet lauréat
        Etant donné une demande de changement de l'actionnaire en cours pour le projet lauréat
        Quand le porteur annule la demande de changement de l'actionnaire pour le projet lauréat
        Alors la demande de changement de l'actionnaire ne devrait plus être consultable

    Scénario: Impossible d'annuler la demande de changement de l'actionnaire si la demande est inexistante
        Quand le porteur annule la demande de changement de l'actionnaire pour le projet lauréat
        Alors l'utilisateur devrait être informé que "Aucune demande de changement d'actionnaire n'est en cours"

    @NotImplemented
    Scénario: Impossible d'annuler la demande de changement de l'actionnaire si la demande est acceptée
        Etant donné une demande de changement de l'actionnaire en cours pour le projet lauréat
        Quand le porteur annule la demande de changement de l'actionnaire pour le projet lauréat
        Alors l'utilisateur devrait être informé que "La demande de changement d'actionnaire a déjà été acceptée"

    @NotImplemented
    Scénario: Impossible d'annuler la demande de changement de l'actionnaire si la demande est rejetée
        Etant donné une demande de changement de l'actionnaire en cours pour le projet lauréat
        Quand le porteur annule la demande de changement de l'actionnaire pour le projet lauréat
        Alors l'utilisateur devrait être informé que "La demande de changement d'actionnaire a déjà été rejetée"
