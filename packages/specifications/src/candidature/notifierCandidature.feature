# language: fr
Fonctionnalité: Notifier une candidature

    Scénario: Notifier une candidature classée
        Etant donné la candidature "Du boulodrome de Marseille" avec :
            | statut        | classé            |
            | appel d'offre | PPE2 - Eolien     |
            | période       | 1                 |
            | email contact | porteur@test.test |
        Quand un administrateur notifie la période de la candidature "Du boulodrome de Marseille" avec :
            | date notification | 2024-08-20 |
        Alors la candidature "Du boulodrome de Marseille" ne devrait plus être consultable dans la liste des candidatures
        Alors le projet "Du boulodrome de Marseille" devrait être consultable dans la liste des projets lauréats
        Et un email a été envoyé à "porteur@test.test" avec :
            | sujet           | Potentiel - Résultats de la première période de l'appel d'offres PPE2 - Eolien |
            | invitation_link | https://potentiel.beta.gouv.fr/projets.html                                    |

    Scénario: Notifier une candidature éliminée
        Etant donné la candidature "Du boulodrome de Marseille" avec :
            | statut        | éliminé           |
            | appel d'offre | PPE2 - Eolien     |
            | période       | 1                 |
            | email contact | porteur@test.test |
        Quand un administrateur notifie la période de la candidature "Du boulodrome de Marseille" avec :
            | date notification | 2024-08-20 |
        Alors la candidature "Du boulodrome de Marseille" ne devrait plus être consultable dans la liste des candidatures
        Et le projet "Du boulodrome de Marseille" devrait être consultable dans la liste des projets éliminés
        Et un email a été envoyé à "porteur@test.test" avec :
            | sujet           | Potentiel - Résultats de la première période de l'appel d'offres PPE2 - Eolien |
            | invitation_link | https://potentiel.beta.gouv.fr/projets.html                                    |

    Scénario: Impossible de notifier une candidature inexistante

