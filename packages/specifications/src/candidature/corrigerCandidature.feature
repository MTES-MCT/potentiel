# language: fr
Fonctionnalité: Corriger une candidature

    Contexte:
        Etant donné la candidature "Du boulodrome de Marseille"

    Scénario: Corriger une candidature
        Quand un administrateur corrige la candidature "Du boulodrome de Marseille" avec :
            | technologie | pv |
        Alors la candidature "Du boulodrome de Marseille" devrait être consultable dans la liste des candidatures

    @select
    Scénario: Impossible de corriger une candidature inconnue
        Quand un administrateur corrige la candidature "D'une candidature non importée" avec :
            | numéro CRE  | 24     |
            | technologie | eolien |
        Alors l'administrateur devrait être informé que "La candidature n'existe pas"

    @NotImplemented
    Scénario: Impossible de corriger une candidature avec un AO inexistant
        Quand un administrateur corrige la candidature "Du boulodrome de Marseille" avec:
            | statut | classé |
        Alors l'administrateur devrait être informé que "L'appel d'offre spécifié n'existe pas"

    @NotImplemented
    Scénario: Impossible de corriger une candidature avec une période d'AO inexistante
        Quand un administrateur corrige la candidature "Du boulodrome de Marseille" avec:
            | statut | classé |
        Alors l'administrateur devrait être informé que "La période d'appel d'offre spécifiée n'existe pas"

    @NotImplemented
    Scénario: Impossible de corriger une candidature avec une famille d'AO inexistante
        Quand un administrateur corrige la candidature "Du boulodrome de Marseille" avec:
            | statut | classé |
        Alors l'administrateur devrait être informé que "La famille de période d'appel d'offre spécifiée n'existe pas"

    @NotImplemented
    Scénario: Impossible de corriger une candidature sans GF, pour un AO soumis aux GF
        Quand un administrateur corrige la candidature "Du boulodrome de Marseille" avec:
            | statut        | classé          |
            | appel d'offre | PPE2 - Bâtiment |
            | type GF       |                 |
        Alors l'administrateur devrait être informé que "Les garanties financières sont requises pour cet appel d'offre ou famille"

    @NotImplemented
    Scénario: Impossible de corriger une candidature d'une période d'AO "legacy"
        Quand un administrateur corrige la candidature "Du boulodrome de Marseille" avec:
            | statut        | classé                      |
            | appel d'offre | CRE4 - Autoconsommation ZNI |
            | période       | 1                           |
        Alors l'administrateur devrait être informé que "Cette période est obsolète et ne peut être corrigée"
