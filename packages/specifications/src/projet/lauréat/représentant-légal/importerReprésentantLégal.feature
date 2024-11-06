# language: fr
Fonctionnalité: Importer le représentant légal d'un projet lauréat

    @NotImplemented
    Scénario: Importer le représentant légal lors de la désignation d'un projet lauréat
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Quand le représentant légal est importé pour le projet lauréat
        Alors le représentant légal du projet lauréat devrait être mis à jour

    # À discuter si nécessaire
    @NotImplemented
    Scénario: Impossible d'importer le représentant légal d'un projet lauréat existant
        Quand le représentant légal est importé pour le projet lauréat
        Alors l'utilisateur devrait être informé que "Le représentant légal n'a pas pu être importé car le projet n'existe pas"
