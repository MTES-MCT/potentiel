# language: fr
Fonctionnalité: Importée une candidature

    @select
    Scénario: Une candidature est importée en statut "classé"
        Quand la candidature "Du boulodrome de Marseille" est importée avec:
            | statut | classé |
        Alors la candidature "Du boulodrome de Marseille" devrait être consultable dans la liste des candidatures

    @NotImplemented
    Scénario: Une candidature est importée en statut "eliminé"
        Quand la candidature "Du boulodrome de Marseille" est importée avec:
            | statut | classé |
        Alors la candidature "Du boulodrome de Marseille" devrait être consultable dans la liste des candidatures


# @NotImplemented
# Scénario: Une candidature classée est notifiée
#     Étant donnée une candidature "Du boulodrome de Marseille"
#     Quand la candidature "Du boulodrome de Marseille" est instruite avec:
#         | statut | classé |
#     Alors la candidature "Du boulodrome de Marseille" devrait être consultable dans la liste des candidatures