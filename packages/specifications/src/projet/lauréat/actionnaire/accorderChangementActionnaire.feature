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
        Et la demande de changement de l'actionnaire devrait être consultable

    Scénario: Impossible d'accorder le changement d'actionnaire d'un projet lauréat si aucune demande n'est en cours
        Quand la DREAL associée au projet accorde le changement d'actionnaire pour le projet lauréat
        Alors l'utilisateur DREAL devrait être informé que "Aucune demande de changement d'actionnaire n'est en cours"

    Scénario: Impossible d'accorder le changement d'actionnaire d'un projet lauréat si la demande a déjà été accordée
        Etant donné une demande de changement d'actionnaire accordée pour le projet lauréat
        Quand la DREAL associée au projet accorde le changement d'actionnaire pour le projet lauréat
        Alors l'utilisateur DREAL devrait être informé que "La demande de changement d'actionnaire a déjà été accordée"

    Scénario: Impossible d'accorder le changement d'actionnaire d'un projet lauréat si la demande a déjà été annulée
        Etant donné une demande de changement d'actionnaire annulée pour le projet lauréat
        Quand la DREAL associée au projet accorde le changement d'actionnaire pour le projet lauréat
        Alors l'utilisateur DREAL devrait être informé que "Aucune demande de changement d'actionnaire n'est en cours"

    Scénario: Impossible d'accorder le changement d'actionnaire d'un projet lauréat si la demande a déjà été rejetée
        Etant donné une demande de changement d'actionnaire rejetée pour le projet lauréat
        Quand la DREAL associée au projet accorde le changement d'actionnaire pour le projet lauréat
        Alors l'utilisateur DREAL devrait être informé que "Aucune demande de changement d'actionnaire n'est en cours"
