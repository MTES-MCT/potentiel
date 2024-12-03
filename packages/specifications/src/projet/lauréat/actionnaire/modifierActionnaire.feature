# language: fr
Fonctionnalité: Modifier l'actionnaire d'un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et le porteur "Marcel Patoulatchi" ayant accés au projet lauréat "Du boulodrome de Marseille"
        Et la dreal "DREAL" associée à la région du projet

    # violette
    # traiter la partie notification
    Scénario: Modifier l'actionnaire d'un projet lauréat
        Quand le DGEC validateur modifie l'actionnaire pour le projet lauréat
        Alors l'actionnaire du projet lauréat devrait être mis à jour
        Quand la Dreal modifie l'actionnaire pour le projet lauréat
        Alors l'actionnaire du projet lauréat devrait être mis à jour
        Quand le porteur modifie l'actionnaire pour le projet lauréat
        Alors l'actionnaire du projet lauréat devrait être mis à jour

    Scénario: Impossible de modifier le représentant légal d'un projet lauréat inexistant
        Quand le DGEC validateur modifie le nom et le type du représentant légal pour le projet lauréat
        Alors l'utilisateur devrait être informé que "Aucun représentant légal n'est associé à ce projet"

    Scénario: Impossible de modifier le représentant légal avec une valeur identique
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Quand le DGEC validateur modifie le nom et le type du représentant légal avec les mêmes valeurs pour le projet lauréat
        Alors l'utilisateur devrait être informé que "Le représentant légal modifié est identique à celui associé au projet"

    @NotImplemented
    Scénario: Modifier l'actionnaire d'un projet lauréat alors qu'une modification d'actionnaire est en cours
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et le représentant légal "Marcel Patoulatchi" associé au projet lauréat
        Et une demande de changement de représentant légal en cours pour le projet lauréat
        Quand le représentant légal est corrigé pour le projet lauréat
        Alors le représentant légal du projet lauréat devrait être mis à jour
