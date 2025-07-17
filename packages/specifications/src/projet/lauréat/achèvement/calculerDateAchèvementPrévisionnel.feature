# language: fr
@achèvement
@date-prévisionnelle-achèvement
Fonctionnalité: Calculer la date d'achèvement prévisionnel

    Plan du scénario: Calculer la date d'achèvement prévisionnel lorsqu'un projet lauréat est notifié
        Etant donné la candidature lauréate "Du boulodrome de Marseille" avec :
            | appel d'offre        | <appel d'offre>        |
            | délai de réalisation | <délai de réalisation> |
        Quand le DGEC validateur notifie la candidature lauréate le "<date notification>"
        Alors la date d'achèvement prévisionnel du projet lauréat devrait être au "<date achèvement prévisionnel attendue>"

        Exemples:
            | appel d'offre   | délai de réalisation | date notification | date achèvement prévisionnel attendue |
            | PPE2 - Bâtiment | 30                   | 2021-01-31        | 2023-07-31                            |
            | PPE2 - Bâtiment | 30                   | 2024-10-05        | 2027-04-05                            |
            | PPE2 - Eolien   | 36                   | 2024-10-05        | 2027-10-05                            |

    Plan du scénario: Calculer la date d'achèvement prévisionnel lorsqu'un lauréat ayant un délai de réalisation par technologie est notifié
        Etant donné la candidature lauréate "Du boulodrome de Marseille" avec :
            | appel d'offre | <appel d'offre>         |
            | technologie   | <technologie du projet> |
        Quand le DGEC validateur notifie la candidature lauréate le "<date notification>"
        Alors la date d'achèvement prévisionnel du projet lauréat devrait être au "<date achèvement prévisionnel attendue>"

        Exemples:
            | appel d'offre | technologie du projet | date notification | date achèvement prévisionnel attendue |
            | PPE2 - Neutre | pv                    | 2024-10-05        | 2027-04-05                            |
            | PPE2 - Neutre | eolien                | 2024-10-05        | 2027-10-05                            |
            | PPE2 - Neutre | hydraulique           | 2024-10-05        | 2027-10-05                            |
