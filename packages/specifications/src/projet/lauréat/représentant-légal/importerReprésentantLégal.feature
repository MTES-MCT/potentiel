# language: fr
@select
Fonctionnalité: Importer le représentant légal lors de la désignation d'une candidature lauréate

    Scénario: Importer le représentant légal lors de la désignation d'une candidature lauréate
        Etant donné la candidature lauréate "Du boulodrome de Marseille"
        Quand le DGEC validateur notifie la candidature lauréate
        Alors le représentant légal du projet lauréat devrait être consultable

    Scénario: Impossible d'importer le représentant légal pour un projet éliminé
        Etant donné le projet éliminé "Du boulodrome de Marseille"
        Quand le représentant légal est importé pour le projet lauréat
        Alors l'utilisateur devrait être informé que "Le projet lauréat n'existe pas"

    Scénario: Impossible d'importer le représentant légal pour une candidature lauréate non désignée
        Etant donné la candidature lauréate "Du boulodrome de Marseille"
        Quand le représentant légal est importé pour le projet lauréat
        Alors l'utilisateur devrait être informé que "Le projet lauréat n'existe pas"

    Scénario: Impossible d'importer le représentant légal pour une candidature éliminée non désignée
        Etant donné la candidature éliminée "Du boulodrome de Marseille"
        Quand le représentant légal est importé pour le projet lauréat
        Alors l'utilisateur devrait être informé que "Le projet lauréat n'existe pas"

    Scénario: Impossible d'importer le représentant légal si celui-ci a déjà été importé
        Etant donné la candidature lauréate notifiée "Du boulodrome de Marseille"
        Quand le représentant légal est importé pour le projet lauréat
        Alors l'utilisateur devrait être informé que "Le représentant légal a déjà été importé"
