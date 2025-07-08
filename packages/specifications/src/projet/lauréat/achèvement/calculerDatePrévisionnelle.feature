# language: fr
@achèvement
@date-prévisionnelle-achèvement
Fonctionnalité: Calculer la date prévisionnelle d'achèvement

    Plan du scénario: Calculer la date prévisionnelle d'achèvement lorsqu'un projet lauréat est notifié
        Etant donné la candidature lauréate "Du boulodrome de Marseille" avec :
            | appel d'offre        | PPE2 - Bâtiment |
            | délai de réalisation | 30              |
        Quand le DGEC validateur notifie la candidature lauréate le "<date notification>"
        Alors la date prévisionnelle d'achèvement du projet devrait être "<date prévisionnelle attendue>"

        Exemples:
            | date notification | date prévisionnelle attendue |
            | 2021-01-31        | 2023-07-31                   |
            | 2024-10-05        | 2027-04-05                   |
