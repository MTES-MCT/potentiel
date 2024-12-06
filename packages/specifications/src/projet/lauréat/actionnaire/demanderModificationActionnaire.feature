# language: fr
Fonctionnalité: Demander la modification de l'actionnaire d'un projet lauréat

    Contexte: Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et le porteur "Marcel Patoulatchi" ayant accés au projet lauréat "Du boulodrome de Marseille"
        Et la dreal "DREAL" associée à la région du projet

    @select
    Scénario: Demander la modification de l'actionnaire d'un projet lauréat
        Quand le porteur demande la modification de l'actionnaire pour le projet lauréat
        Alors la demande de modification de l'actionnaire devrait être consultable

    @select
    Scénario: Impossible de demander la modification de l'actionnaire  si l'actionnaire est inexistant
        Quand le DGEC validateur modifie l'actionnaire pour le projet lauréat
        Alors l'utilisateur devrait être informé que "L'actionnaire n'existe pas"

    @select
    Scénario: Impossible de demander la modification de l'actionnaire avec une valeur identique
        Quand le DGEC validateur modifie l'actionnaire pour le projet lauréat
        Alors l'utilisateur devrait être informé que "Le nouvel actionnaire est identique à celui associé au projet"

    @select
    Scénario: Impossible de demander la modification de l'actionnaire si une demande existe déjà
        Quand le DGEC validateur modifie l'actionnaire pour le projet lauréat
        Alors l'utilisateur devrait être informé que "Une demande de modification d'actionnaire est déjà en cours"
