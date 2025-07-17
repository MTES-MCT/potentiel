# language: fr
@achèvement
@calculer-date-prévisionnelle-achèvement
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

    Plan du scénario: Calculer la date d'achèvement prévisionnel lorsqu'un projet lauréat ayant un délai de réalisation par technologie est notifié
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

    Plan du scénario: Calculer la date d'achèvement prévisionnel lorsqu'un projet lauréat change son cahier des charges par le CDC du 30/08/2022
        Etant donné le projet lauréat "Du boulodrome de Bordeaux" avec :
            | appel d'offre | <appel d'offre> |
            | période       | <période>       |
        Et une date d'achèvement prévisionnel pour le projet lauréat au "<date achèvement prévisionnel actuelle>"
        Quand le porteur choisit le cahier des charges "30/08/2022"
        Alors la date d'achèvement prévisionnel du projet lauréat devrait être au "<date achèvement prévisionnel attendue>"

        Exemples:
            | appel d'offre   | période | date achèvement prévisionnel actuelle | date achèvement prévisionnel attendue |
            | PPE2 - Bâtiment | 1       | 2020-01-01                            | 2021-07-01                            |
