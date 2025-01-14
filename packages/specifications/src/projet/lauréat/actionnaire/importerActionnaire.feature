# language: fr
Fonctionnalité: Importer l'actionnaire lors de la désignation d'une candidature lauréate

    Scénario: Importer l'actionnaire lors de la désignation d'une candidature lauréate
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Alors l'actionnaire du projet lauréat devrait être consultable

    Scénario: Importer l'actionnaire lors de la désignation d'une candidature lauréate avec une société mère vide
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | société mère |  |
        Alors l'actionnaire du projet lauréat devrait être consultable

    Scénario: Impossible d'importer l'actionnaire pour un projet éliminé
        Etant donné le projet éliminé "Du boulodrome de Marseille"
        Quand l'actionnaire est importé pour le projet
        Alors l'utilisateur devrait être informé que "Le projet lauréat n'existe pas"

    Scénario: Impossible d'importer l'actionnaire pour une candidature lauréate non désignée
        Etant donné la candidature lauréate "Du boulodrome de Marseille"
        Quand l'actionnaire est importé pour le projet
        Alors l'utilisateur devrait être informé que "Le projet lauréat n'existe pas"

    Scénario: Impossible d'importer l'actionnaire pour une candidature éliminée non désignée
        Etant donné la candidature éliminée "Du boulodrome de Marseille"
        Quand l'actionnaire est importé pour le projet
        Alors l'utilisateur devrait être informé que "Le projet lauréat n'existe pas"

    Scénario: Impossible d'importer l'actionnaire si celui-ci a déjà été importé
        Etant donné la candidature lauréate notifiée "Du boulodrome de Marseille"
        Quand l'actionnaire est importé pour le projet
        Alors l'utilisateur devrait être informé que "L'actionnaire a déjà été importé"
