# language: fr
Fonctionnalité: Accorder le changement d'actionnaire d'un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et le porteur "Marcel Patoulatchi" ayant accés au projet lauréat "Du boulodrome de Marseille"
        Et la dreal "Dreal du sud" associée à la région du projet

    Scénario: la DREAL associée au projet accorde le changement d'actionnaire d'un projet lauréat
        Etant donné une demande de changement d'actionnaire en cours pour le projet lauréat
        Quand la DREAL associée au projet accorde le changement d'actionnaire pour le projet lauréat
        Alors l'actionnaire du projet lauréat devrait être mis à jour
        Et le changement d'actionnaire du projet lauréat devrait être accordé

    Scénario: Impossible d'accorder le changement d'actionnaire d'un projet lauréat si aucune demande n'est en cours
        Quand la DREAL associée au projet accorde le changement d'actionnaire pour le projet lauréat
        Alors la dreal devrait être informé que "Aucune demande de changement d'actionnaire n'est en cours"

    Scénario: Impossible d'accorder le changement d'actionnaire d'un projet lauréat si la demande a déjà été accordée
        Etant donné un changement d'actionnaire accordé pour le projet lauréat
        Quand la DREAL associée au projet accorde le changement d'actionnaire pour le projet lauréat
        Alors l'utilisateur devrait être informé que "La demande de changement d'actionnaire a déjà été accordée"

    @NotImplemented
    Scénario: Impossible d'accorder le changement d'actionnaire d'un projet lauréat si la demande a déjà été rejetée
        Etant donné un changement d'actionnaire rejeté pour le projet lauréat
        Quand la DREAL associée au projet accorde le changement d'actionnaire pour le projet lauréat
        Alors la dreal devrait être informée que "La demande de changement d'actionnaire a déjà été rejetée"

    @NotImplemented
    Scénario: Impossible d'accorder le changement d'actionnaire d'un projet lauréat si la demande a déjà été annulée
        Etant donné un changement d'actionnaire annulé pour le projet lauréat
        Quand la DREAL associée au projet accorde le changement d'actionnaire pour le projet lauréat
        Alors la dreal devrait être informé que "La demande de changement d'actionnaire a déjà été annulée"
