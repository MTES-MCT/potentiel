# language: fr
Fonctionnalité: Corriger une candidature

    Contexte:
        Etant donné la candidature "Du boulodrome de Marseille"

    @NotImplemented
    Scénario: Corriger une candidature
        Etant donné la candidature "Du boulodrome de Marseille"
        Quand un administrateur corrige la candidature "Du boulodrome de Marseille" avec :
            | statut | <Statut> |
        Alors la candidature corrigée "Du boulodrome de Marseille" devrait être consultable dans la liste des candidatures avec le statut "<Statut>" avec :
            | statut | <Statut> |

    @NotImplemented
    Scénario: Impossible de corriger une candidature inexistante
        Quand un administrateur corrige la candidature "Du boulodrome de Marseille 2" avec :
            | statut | éliminé |
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
