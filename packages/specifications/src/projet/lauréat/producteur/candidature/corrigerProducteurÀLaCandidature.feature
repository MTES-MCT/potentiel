# language: fr
Fonctionnalité: Corriger le producteur d'une candidature

    @NotImplemented
    Scénario: Corriger le producteur d'une candidature lauréate non notifiée
        Etant donné la candidature lauréate "Du boulodrome de Marseille"
        Quand l'administrateur corrige le producteur de la candidature lauréate
        Alors la candidature devrait être consultable

    @NotImplemented
    Scénario: Corriger le producteur d'une candidature éliminée non notifiée
        Etant donné la candidature éliminée "Du boulodrome de Marseille"
        Quand l'administrateur corrige le producteur de la candidature éliminée
        Alors la candidature devrait être consultable

    @NotImplemented
    Scénario: Impossible de corriger le producteur d'une candidature inexistante
        Quand l'administrateur corrige le producteur de la candidature éliminée
        Alors l'utilisateur devrait être informé que "La candidature n'existe pas"
