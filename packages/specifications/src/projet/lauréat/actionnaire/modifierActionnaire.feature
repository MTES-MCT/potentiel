# language: fr
Fonctionnalité: Modifier l'actionnaire d'un projet lauréat

    Scénario: Modifier l'actionnaire d'un projet lauréat
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et le porteur "Marcel Patoulatchi" ayant accés au projet lauréat "Du boulodrome de Marseille"
        Et la dreal "DREAL" associée à la région du projet
        Quand le DGEC validateur modifie l'actionnaire pour le projet lauréat
        Alors l'actionnaire du projet lauréat devrait être mis à jour
        Quand la DREAL modifie l'actionnaire pour le projet lauréat
        Alors l'actionnaire du projet lauréat devrait être mis à jour
        Quand le porteur modifie l'actionnaire pour le projet lauréat
        Alors l'actionnaire du projet lauréat devrait être mis à jour

    Scénario: Impossible de modifier l'actionnaire si l'actionnaire est inexistant
        Quand le DGEC validateur modifie l'actionnaire pour le projet lauréat
        Alors l'utilisateur devrait être informé que "L'actionnaire n'existe pas"

    Scénario: Impossible de modifier le représentant légal avec une valeur identique
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Quand le DGEC validateur modifie l'actionnaire avec la même valeur pour le projet lauréat
        Alors l'utilisateur devrait être informé que "L'actionnaire modifié est identique à celui associé au projet"

    @NotImplemented
    Scénario: Modifier l'actionnaire d'un projet lauréat alors qu'une modification d'actionnaire est en cours

