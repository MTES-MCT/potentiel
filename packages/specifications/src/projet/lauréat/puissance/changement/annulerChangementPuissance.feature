# language: fr
Fonctionnalité: Annuler la demande changement de puissance d'un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et le porteur "Marcel Patoulatchi" ayant accés au projet lauréat "Du boulodrome de Marseille"
        Et la dreal "Dreal du sud" associée à la région du projet

    # ajouter notification DREAL
    Scénario: Annuler la demande de changement de puissance d'un projet lauréat
        Etant donné une demande de changement de puissance à la baisse pour le projet lauréat
        Quand le porteur annule la demande de changement de puissance pour le projet lauréat
        Alors la demande de changement de puissance ne devrait plus être consultable

    Scénario: Impossible d'annuler la demande de changement de puissance si la demande est inexistante
        Quand le porteur annule la demande de changement de puissance pour le projet lauréat
        Alors l'utilisateur devrait être informé que "Aucune demande de changement de puissance n'est en cours"

    Scénario: Impossible d'annuler la demande de changement de puissance si la demande est acceptée
        Etant donné une demande de changement de puissance à la baisse accordée pour le projet lauréat
        Quand le porteur annule la demande de changement de puissance pour le projet lauréat
        Alors l'utilisateur devrait être informé que "Aucune demande de changement de puissance n'est en cours"

    @NotImplemented
    Scénario: Impossible d'annuler la demande de changement de puissance si la demande est rejetée
        Etant donné une demande de changement de puissance rejetée pour le projet lauréat
        Quand le porteur annule la demande de changement de puissance pour le projet lauréat
        Alors l'utilisateur devrait être informé que "Aucune demande de changement de puissance n'est en cours"
