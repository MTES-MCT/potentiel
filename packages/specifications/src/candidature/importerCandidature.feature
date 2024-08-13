# language: fr
@select
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
