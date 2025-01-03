# language: fr
Fonctionnalité: Demander le changement de l'actionnaire d'un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et le porteur "Marcel Patoulatchi" ayant accés au projet lauréat "Du boulodrome de Marseille"
        Et la dreal "DREAL" associée à la région du projet

    # TODO: ajouter la notification DREAL
    Scénario: Demander le changement de l'actionnaire d'un projet lauréat
        Quand le porteur demande le changement de l'actionnaire pour le projet lauréat
        Alors la demande de changement de l'actionnaire devrait être consultable

    Scénario: Demander le changement de l'actionnaire d'un projet lauréat si une demande a déjà été rejetée
        Etant donné une demande de changement d'actionnaire rejetée pour le projet lauréat
        Quand le porteur demande le changement de l'actionnaire pour le projet lauréat
        Alors la nouvelle demande de changement de l'actionnaire devrait être consultable

    Scénario: Demander le changement de l'actionnaire d'un projet lauréat si une demande a déjà été annulée
        Etant donné une demande de changement d'actionnaire annulée pour le projet lauréat
        Quand le porteur demande le changement de l'actionnaire pour le projet lauréat
        Alors la nouvelle demande de changement de l'actionnaire devrait être consultable

    Scénario: Demander le changement de l'actionnaire d'un projet lauréat si une demande a déjà été accordée
        Etant donné une demande de changement d'actionnaire accordée pour le projet lauréat
        Quand le porteur demande le changement de l'actionnaire pour le projet lauréat
        Alors la nouvelle demande de changement de l'actionnaire devrait être consultable

    Scénario: Impossible de demander le changement de l'actionnaire si l'actionnaire est inexistant
        Etant donné le projet éliminé "Du boulodrome de Lyon"
        Quand le porteur demande le changement de l'actionnaire pour le projet éliminé
        Alors l'utilisateur devrait être informé que "L'actionnaire n'existe pas"

    Scénario: Impossible de demander le changement de l'actionnaire avec une valeur identique
        Quand le porteur demande le changement de l'actionnaire avec la même valeur pour le projet lauréat
        Alors l'utilisateur devrait être informé que "Le nouvel actionnaire est identique à celui associé au projet"

    Scénario: Impossible de demander le changement de l'actionnaire si une demande existe déjà
        Etant donné une demande de changement d'actionnaire en cours pour le projet lauréat
        Quand le porteur demande le changement de l'actionnaire pour le projet lauréat
        Alors l'utilisateur devrait être informé que "Une demande de changement est déjà en cours"
