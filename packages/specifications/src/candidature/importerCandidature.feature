# language: fr
Fonctionnalité: Importer une candidature

    Scénario: Une candidature est importée en statut "classé"
        Quand la candidature "Du boulodrome de Marseille" est importée avec:
            | statut | classé |
        Alors la candidature "Du boulodrome de Marseille" devrait être consultable dans la liste des candidatures avec le statut "classé"

    Scénario: Une candidature est importée en statut "eliminé"
        Quand la candidature "Du boulodrome de Marseille" est importée avec:
            | statut | éliminé |
        Alors la candidature "Du boulodrome de Marseille" devrait être consultable dans la liste des candidatures avec le statut "éliminé"
