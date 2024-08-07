# language: fr
Fonctionnalité: Instruire une candidature

    @NotImplemented
    Scénario: Une candidature est instruite
        Quand la candidature "Du boulodrome de Marseille" est instruite avec:
            | statut | classé |
        Alors la candidature "Du boulodrome de Marseille" devrait être consultable dans la liste des candidatures
