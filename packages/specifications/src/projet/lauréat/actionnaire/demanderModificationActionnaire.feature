# language: fr
Fonctionnalité: Demander la modification de l'actionnaire d'un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et le porteur "Marcel Patoulatchi" ayant accés au projet lauréat "Du boulodrome de Marseille"
        Et la dreal "DREAL" associée à la région du projet

    Scénario: Demander la modification de l'actionnaire d'un projet lauréat
        Quand le porteur demande la modification de l'actionnaire pour le projet lauréat
        Alors la demande de modification de l'actionnaire devrait être consultable

    Scénario: Impossible de demander la modification de l'actionnaire si l'actionnaire est inexistant
        Etant donné le projet éliminé "Du boulodrome de Lyon"
        Quand le porteur demande la modification de l'actionnaire pour le projet éliminé
        Alors l'utilisateur devrait être informé que "L'actionnaire n'existe pas"

    Scénario: Impossible de demander la modification de l'actionnaire avec une valeur identique
        Quand le porteur demande la modification de l'actionnaire avec la même valeur pour le projet lauréat
        Alors l'utilisateur devrait être informé que "Le nouvel actionnaire est identique à celui associé au projet"

    Scénario: Impossible de demander la modification de l'actionnaire si une demande existe déjà
        Etant donné une demande de modification de l'actionnaire en cours pour le projet lauréat
        Quand le porteur demande la modification de l'actionnaire pour le projet lauréat
        Alors l'utilisateur devrait être informé que "Le statut de la demande de modification est identique"
