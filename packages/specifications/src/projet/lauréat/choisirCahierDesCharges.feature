# language: fr
@lauréat
@cahier-des-charges
Fonctionnalité: Choisir un cahier des charges

    Scénario: Choisir un cahier des charges modifié
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offres | PPE2 - Eolien |
            | période        | 1             |
        Quand le porteur choisit le cahier des charges "modifié paru le 30/08/2022"
        Alors le cahier des charges devrait être modifié
        Et un email a été envoyé au porteur avec :
            | sujet          | Potentiel - Du boulodrome de Marseille - Nouveau cahier des charges choisi |
            | url            | https://potentiel.beta.gouv.fr/laureats/.*                                 |
            | cdc_date       | 30/08/2022                                                                 |
            | cdc_alternatif |                                                                            |

    Scénario: Choisir le cahier des charges initial après avoir choisi un cahier des charges modifié
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offres | PPE2 - Eolien |
            | période        | 1             |
        Et le cahier des charges "modifié paru le 30/08/2022" choisi pour le projet lauréat
        Quand le porteur choisit le cahier des charges "initial"
        Alors le cahier des charges devrait être modifié
        Et un email a été envoyé au porteur avec :
            | sujet | Potentiel - Du boulodrome de Marseille - Nouveau cahier des charges choisi |
            | url   | https://potentiel.beta.gouv.fr/laureats/.*                                 |

    Scénario: Impossible de choisir un cahier des charges identique au cahier des charges actuel
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offres | PPE2 - Eolien |
            | période        | 1             |
        Et le cahier des charges "modifié paru le 30/08/2022" choisi pour le projet lauréat
        Quand le porteur choisit le cahier des charges "modifié paru le 30/08/2022"
        Alors l'utilisateur devrait être informé que "Ce cahier des charges est identique à l'actuel"

    Scénario: Impossible de choisir un cahier des charges modifié non disponible pour une période
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offres | PPE2 - Eolien |
            | période        | 9             |
        Quand le porteur choisit le cahier des charges "modifié paru le 30/08/2022"
        Alors l'utilisateur devrait être informé que "Ce cahier des charges n'est pas disponible pour cette période"

    Scénario: Impossible de revenir au cahier des charges initial après avoir choisi un cahier des charges modifié si l'appel d'offres ne le permet pas
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offres | CRE4 - Bâtiment |
            | période        | 13              |
        Et le cahier des charges "modifié paru le 30/08/2022" choisi pour le projet lauréat
        Quand le porteur choisit le cahier des charges "initial"
        Alors l'utilisateur devrait être informé que "Il est impossible de revenir au cahier de charges en vigueur à la candidature"

    Scénario: Impossible de choisir au cahier des charges modifié pour un projet abandonné
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offres | PPE2 - Eolien |
            | période        | 1             |
        Et une demande d'abandon accordée pour le projet lauréat
        Quand le porteur choisit le cahier des charges "modifié paru le 30/08/2022"
        Alors l'utilisateur devrait être informé que "Impossible de faire un changement pour un projet abandonné"

    Scénario: Impossible de choisir au cahier des charges modifié pour un projet achevé
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offres | PPE2 - Eolien |
            | période        | 1             |
        Et une attestation de conformité transmise pour le projet lauréat

        Quand le porteur choisit le cahier des charges "modifié paru le 30/08/2022"
        Alors l'utilisateur devrait être informé que "Impossible de faire un changement pour un projet achevé"

    Plan du Scénario: Choisir le cahier des charges du 30/08/2022 après mise en service du projet
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offres    | <appel d'offres>    |
            | période           | <période>           |
            | date notification | <date notification> |
        Et une demande complète de raccordement pour le projet lauréat
        Et une date de mise en service pour le dossier de raccordement du projet lauréat avec :
            | La date de mise en service | <date de mise en service> |
        Quand le porteur choisit le cahier des charges "30/08/2022"
        Alors le cahier des charges devrait être modifié
        Et la date d'achèvement prévisionnel du projet lauréat devrait être au "<date achèvement prévisionnel attendue>"

        Exemples:
            | appel d'offres  | période | date notification | date de mise en service | date achèvement prévisionnel attendue |
            ##
            ## Mise en service dans l'intervalle : délai appliqué
            ##
            # délai initial de 30 mois, plus 18 mois supplémentaires.
            | PPE2 - Bâtiment | 1       | 2021-01-31        | 2022-09-19              | 2025-01-30                            |
            | PPE2 - Bâtiment | 1       | 2024-09-05        | 2024-11-30              | 2028-09-04                            |
            # délai initial de 36 mois, plus 18 mois supplémentaires.
            | PPE2 - Eolien   | 1       | 2024-09-05        | 2024-09-29              | 2029-03-04                            |
            ##
            ## Mise en service hors de l'intervalle : délai non appliqué
            ##
            # délai initial de 30 mois
            | PPE2 - Bâtiment | 1       | 2021-01-31        | 2025-01-01              | 2023-07-30                            |
            | PPE2 - Bâtiment | 1       | 2024-09-05        | 2025-01-01              | 2027-03-04                            |
            # délai initial de 36 mois.
            | PPE2 - Eolien   | 1       | 2024-09-05        | 2024-12-01              | 2027-09-04                            |

    Scénario: Choisir le cahier des charges du 30/08/2022 pour un projet pas encore en service n'applique pas de délai
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offres    | PPE2 - Bâtiment |
            | période           | 1               |
            | date notification | 2021-01-31      |
        Quand le porteur choisit le cahier des charges "30/08/2022"
        Alors le cahier des charges devrait être modifié
        Et la date d'achèvement prévisionnel du projet lauréat devrait être au "2023-07-30"

    Scénario: Choisir le cahier des charges initial pour un projet ayant bénéficié du délai du cahier des charges du 30/08/2022 impacte la date d'achèvement
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offres    | PPE2 - Bâtiment |
            | période           | 1               |
            | date notification | 2021-01-31      |
        Et une demande complète de raccordement pour le projet lauréat
        Et une date de mise en service pour le dossier de raccordement du projet lauréat avec :
            | La date de mise en service | 2022-09-19 |
        Et le cahier des charges "30/08/2022" choisi pour le projet lauréat
        Quand le porteur choisit le cahier des charges "initial"
        Alors le cahier des charges devrait être modifié
        Et la date d'achèvement prévisionnel du projet lauréat devrait être au "2023-07-30"
