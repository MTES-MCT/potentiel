# language: fr
@achèvement
@date-prévisionnelle-achèvement
Fonctionnalité: Calculer la date prévisionnelle d'achèvement

    Scénario: Calculer la date prévisionnelle d'achèvement lorsqu'un projet lauréat est notifié
        Etant donné la candidature lauréate "Du boulodrome de Marseille" avec :
            | appel d'offre        | PPE2 - Bâtiment |
            | délai de réalisation | 30              |
        Quand le DGEC validateur notifie la candidature lauréate le "2024-10-30"
        Alors la date prévisionnelle d'achèvement du projet devrait être "2027-04-30"
