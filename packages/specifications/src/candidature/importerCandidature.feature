# language: fr
Fonctionnalité: Importer une candidature

    Plan du scénario: Importer une candidature
        Quand un administrateur importe la candidature "Du boulodrome de Marseille" avec:
            | statut | <Statut> |
        Alors la candidature "Du boulodrome de Marseille" devrait être consultable dans la liste des candidatures avec le statut "<Statut>"

        Exemples:
            | Statut  |
            | classé  |
            | éliminé |

    Scénario: Impossible d'importer 2 fois la même candidature
        Étant donné la candidature "Du boulodrome de Marseille"
        Quand un administrateur importe la candidature "Du boulodrome de Marseille" avec:
            | statut | éliminé |
        Alors l'administrateur devrait être informé que "Il est impossible d'importer 2 fois la même candidature"

    Scénario: Impossible d'importer un AO inexistant
        Quand un administrateur importe la candidature "Du boulodrome de Marseille" avec:
            | statut        | classé     |
            | appel d'offre | inexistant |
        Alors l'administrateur devrait être informé que "L'appel d'offre spécifié n'existe pas"

    Scénario: Impossible d'importer une période d'AO inexistante
        Quand un administrateur importe la candidature "Du boulodrome de Marseille" avec:
            | statut  | classé |
            | période | 812    |
        Alors l'administrateur devrait être informé que "La période d'appel d'offre spécifiée n'existe pas"

    Scénario: Impossible d'importer une famille d'AO inexistante
        Quand un administrateur importe la candidature "Du boulodrome de Marseille" avec:
            | statut  | classé |
            | famille | 812    |
        Alors l'administrateur devrait être informé que "La famille de période d'appel d'offre spécifiée n'existe pas"
