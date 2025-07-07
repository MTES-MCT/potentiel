# language: fr
@select
Fonctionnalité: Calculer la date prévisionnelle d'achèvement

    Scénario: Calculer la date prévisionnelle d'achèvement lorsqu'un projet lauréat est notifié
        Etant donné la candidature lauréate "Du boulodrome de Marseille" avec :
            | appel d'offre        | PPE2 - Bâtiment |
            | période              | 1               |
            | famille              |                 |
            | délai de réalisation | 30              |
        Quand le DGEC validateur notifie la candidature lauréate le "30/10/2024"
        Alors la date prévisionnelle d'achèvement du projet devrait être "30/04/2027"
