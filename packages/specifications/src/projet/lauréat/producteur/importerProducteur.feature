# language: fr
Fonctionnalité: Importer le producteur lors de la désignation d'une candidature lauréate

    @NotImplemented
    Scénario: Importer le producteur lors de la désignation d'une candidature lauréate
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Alors le producteur du projet lauréat devrait être consultable

    @NotImplemented
    Scénario: Impossible d'importer le producteur pour un projet éliminé
        Etant donné le projet éliminé "Du boulodrome de Marseille"
        Quand le producteur est importé pour le projet
        Alors l'utilisateur devrait être informé que "Le projet lauréat n'existe pas"

    @NotImplemented
    Scénario: Impossible d'importer le producteur pour une candidature lauréate non désignée
        Etant donné la candidature lauréate "Du boulodrome de Marseille"
        Quand le producteur est importé pour le projet
        Alors l'utilisateur devrait être informé que "Le projet lauréat n'existe pas"

    @NotImplemented
    Scénario: Impossible d'importer le producteur pour une candidature éliminée non désignée
        Etant donné la candidature éliminée "Du boulodrome de Marseille"
        Quand le producteur est importé pour le projet
        Alors l'utilisateur devrait être informé que "Le projet lauréat n'existe pas"

    @NotImplemented
    Scénario: Impossible d'importer le producteur si celui-ci a déjà été importé
        Etant donné la candidature lauréate notifiée "Du boulodrome de Marseille"
        Quand le producteur est importé pour le projet
        Alors l'utilisateur devrait être informé que "Le producteur a déjà été importé"
