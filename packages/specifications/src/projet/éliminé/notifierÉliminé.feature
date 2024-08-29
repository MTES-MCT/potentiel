# language: fr
Fonctionnalité: Notifier un projet éliminé

    Scénario: Notifier une candidature éliminée
        Etant donné la candidature "Du boulodrome de Marseille" avec :
            | statut        | éliminé           |
            | appel d'offre | PPE2 - Eolien     |
            | période       | 1                 |
            | email contact | porteur@test.test |
        Quand le DGEC validateur notifie comme éliminée la candidature "Du boulodrome de Marseille" avec :
            | date notification | 2024-08-20 |
        Alors le projet éliminé "Du boulodrome de Marseille" devrait être consultable
        Et un email a été envoyé à "porteur@test.test" avec :
            | sujet           | Résultats de la première période de l'appel d'offres PPE2 - Eolien |
            | invitation_link | https://potentiel.beta.gouv.fr/projets.html                        |
