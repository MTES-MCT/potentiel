# language: fr
Fonctionnalité: Corriger le représentant légal d'un projet lauréat

    Contexte:
        Etant donné l'admin "Robert Robichet"

    Scénario: Corriger le représentant légal d'un projet lauréat
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Quand le nom du représentant légal du projet lauréat est corrigé
        Alors le nom du représentant légal du projet lauréat devrait être mis à jour

    Scénario: Impossible de corriger le représentant légal d'un projet lauréat inexistant
        Quand le nom du représentant légal du projet lauréat est corrigé
        Alors l'utilisateur devrait être informé que "Aucun représentant légal n'est associé à ce projet"

    Scénario: Impossible de corriger le représentant légal avec une valeur identique
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Quand le nom du représentant légal du projet lauréat est corrigé avec la même valeur
        Alors l'utilisateur devrait être informé que "Le représentant légal est déjà associé à ce projet"

    @NotImplemented
    Scénario: Corriger le représentant légal d'un projet lauréat alors qu'un changement de représentant légal est en cours
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et le représentant légal "Marcel Patoulatchi" associé au projet lauréat
        Et une demande de changement de représentant légal en cours pour le projet lauréat
        Quand le représentant légal est corrigé pour le projet lauréat
        Alors le représentant légal du projet lauréat devrait être mis à jour

    # À discuter si nécessaire
    @NotImplemented
    Scénario: Impossible de corriger le représentant légal si un changement de représentant légal a été accordé
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et une demande de changement de représentant légal accordée pour le projet lauréat
        Quand le représentant légal est corrigé pour le projet lauréat
        Alors l'utilisateur devrait être informé que "Le représentant légal n'a pas pu être corrigé car un changement de représentant légal a déjà été accordé"
