# language: fr
@achèvement
@calculer-date-achèvement-prévisionnel
Fonctionnalité: Calculer la date d'achèvement prévisionnel

    Plan du scénario: Calculer la date d'achèvement prévisionnel lorsqu'un projet lauréat est notifié
        Etant donné la candidature lauréate "Du boulodrome de Marseille" avec :
            | appel d'offre        | <appel d'offre>        |
            | délai de réalisation | <délai de réalisation> |
        Quand le DGEC validateur notifie la candidature lauréate le "<date notification>"
        Alors la date d'achèvement prévisionnel du projet lauréat devrait être au "<date achèvement prévisionnel attendue>"

        Exemples:
            | appel d'offre   | délai de réalisation | date notification | date achèvement prévisionnel attendue |
            | PPE2 - Bâtiment | 30                   | 2021-01-31        | 2023-07-30                            |
            | PPE2 - Bâtiment | 30                   | 2024-10-05        | 2027-04-04                            |
            | PPE2 - Eolien   | 36                   | 2024-10-05        | 2027-10-04                            |

    Plan du scénario: Calculer la date d'achèvement prévisionnel lorsqu'un projet lauréat ayant un délai de réalisation par technologie est notifié
        Etant donné la candidature lauréate "Du boulodrome de Marseille" avec :
            | appel d'offre | <appel d'offre>         |
            | technologie   | <technologie du projet> |
        Quand le DGEC validateur notifie la candidature lauréate le "<date notification>"
        Alors la date d'achèvement prévisionnel du projet lauréat devrait être au "<date achèvement prévisionnel attendue>"

        Exemples:
            | appel d'offre | technologie du projet | date notification | date achèvement prévisionnel attendue |
            | PPE2 - Neutre | pv                    | 2024-10-05        | 2027-04-04                            |
            | PPE2 - Neutre | eolien                | 2024-10-05        | 2027-10-04                            |
            | PPE2 - Neutre | hydraulique           | 2024-10-05        | 2027-10-04                            |

    Plan du scénario: Appliquer le délai du CDC 2022 lorsqu'un projet lauréat change son cahier des charges pour celui paru le 30/08/2022
        Etant donné le projet lauréat "Du boulodrome de Bordeaux" avec :
            | appel d'offre     | PPE2 - Bâtiment |
            | période           | 1               |
            | date notification | 2019-10-30      |
        Et une date d'achèvement prévisionnel pour le projet lauréat au "2020-01-01"
        Et une demande complète de raccordement pour le projet lauréat
        Et une date de mise en service au "<Date de mise en service>" pour le dossier de raccordement du projet lauréat
        Quand le porteur choisit le cahier des charges "modifié paru le 30/08/2022"
        Alors la date d'achèvement prévisionnel du projet lauréat devrait être au "2021-07-01"

        Exemples:
            | Date de mise en service |
            | 2022-09-01              |
            | 2023-09-10              |
            | 2024-12-31              |

    Scénario: Ne pas appliquer le délai du CDC 2022 lorsqu'un projet lauréat change son cahier des charges pour celui paru le 30/08/2022
        Etant donné le projet lauréat "Du boulodrome de Bordeaux" avec :
            | appel d'offre     | PPE2 - Bâtiment |
            | période           | 1               |
            | date notification | 2019-10-30      |
        Et une date d'achèvement prévisionnel pour le projet lauréat au "2020-01-01"
        Et une demande complète de raccordement pour le projet lauréat
        Et une date de mise en service au "2025-06-10" pour le dossier de raccordement du projet lauréat
        Quand le porteur choisit le cahier des charges "modifié paru le 30/08/2022"
        Alors la date d'achèvement prévisionnel du projet lauréat devrait être au "2020-01-01"

    Scénario: Retirer le délai du CDC 2022 lorsqu'un projet lauréat passe d'un cahier des charges paru le 30/08/2022 à un CDC initial
        Etant donné le projet lauréat "Du boulodrome de Bordeaux" avec :
            | appel d'offre     | PPE2 - Bâtiment |
            | période           | 1               |
            | date notification | 2019-10-30      |
        Et une date d'achèvement prévisionnel pour le projet lauréat au "2020-01-01"
        Et une demande complète de raccordement pour le projet lauréat
        Et une date de mise en service au "2023-06-10" pour le dossier de raccordement du projet lauréat
        Et le cahier des charges "modifié paru le 30/08/2022" choisi pour le projet lauréat
        Quand le porteur choisit le cahier des charges "initial"
        Alors la date d'achèvement prévisionnel du projet lauréat devrait être au "2020-01-01"

    Scénario: Appliquer le délai du CDC 2022 lorsqu'un projet lauréat a une date de mise en service transmise dans l'intervalle prévu par le CDC
        Etant donné le gestionnaire de réseau "Enedis"
        Et le projet lauréat "Du boulodrome de Bordeaux" avec :
            | appel d'offre     | PPE2 - Bâtiment |
            | période           | 1               |
            | date notification | 2019-10-30      |
        Et une date d'achèvement prévisionnel pour le projet lauréat au "2020-01-01"
        Et le cahier des charges "modifié paru le 30/08/2022" choisi pour le projet lauréat
        Et le gestionnaire de réseau "Enedis" attribué au raccordement du projet lauréat
        Et une demande complète de raccordement pour le projet lauréat
        Quand le gestionnaire de réseau transmet la date de mise en service pour le dossier de raccordement du projet lauréat avec :
            | La date de mise en service | 2023-09-10 |
        Alors la date d'achèvement prévisionnel du projet lauréat devrait être au "2021-07-01"

    Scénario: Ne pas appliquer le délai du CDC 2022 lorsqu'un projet lauréat a une date de mise en service transmise en dehors de l'intervalle prévu par le CDC
        Etant donné le gestionnaire de réseau "Enedis"
        Et le projet lauréat "Du boulodrome de Bordeaux" avec :
            | appel d'offre     | PPE2 - Bâtiment |
            | période           | 1               |
            | date notification | 2019-10-30      |
        Et une date d'achèvement prévisionnel pour le projet lauréat au "2020-01-01"
        Et le cahier des charges "modifié paru le 30/08/2022" choisi pour le projet lauréat
        Et le gestionnaire de réseau "Enedis" attribué au raccordement du projet lauréat
        Et une demande complète de raccordement pour le projet lauréat
        Quand le gestionnaire de réseau transmet la date de mise en service pour le dossier de raccordement du projet lauréat avec :
            | La date de mise en service | 2025-06-10 |
        Alors la date d'achèvement prévisionnel du projet lauréat devrait être au "2020-01-01"
