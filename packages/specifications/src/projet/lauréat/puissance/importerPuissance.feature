# language: fr
Fonctionnalité: Importer la puissance lors de la désignation d'une candidature lauréate

    Scénario: Importer la puissance lors de la désignation d'une candidature lauréate
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Alors la puissance du projet lauréat devrait être consultable

    Scénario: Impossible d'importer la puissance pour un projet éliminé
        Etant donné le projet éliminé "Du boulodrome de Marseille"
        Quand la puissance est importée pour le projet
        Alors l'utilisateur devrait être informé que "Le projet lauréat n'existe pas"

    Scénario: Impossible d'importer la puissance pour une candidature lauréate non désignée
        Etant donné la candidature lauréate "Du boulodrome de Marseille"
        Quand la puissance est importée pour le projet
        Alors l'utilisateur devrait être informé que "Le projet lauréat n'existe pas"

    Scénario: Impossible d'importer la puissance pour une candidature éliminée non désignée
        Etant donné la candidature éliminée "Du boulodrome de Marseille"
        Quand la puissance est importée pour le projet
        Alors l'utilisateur devrait être informé que "Le projet lauréat n'existe pas"

    Scénario: Impossible d'importer la puissance si celle-ci a déjà été importé
        Etant donné la candidature lauréate notifiée "Du boulodrome de Marseille"
        Quand la puissance est importée pour le projet
        Alors l'utilisateur devrait être informé que "la puissance a déjà été importée"
