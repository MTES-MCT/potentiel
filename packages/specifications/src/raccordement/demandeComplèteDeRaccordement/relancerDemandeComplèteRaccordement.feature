# language: fr
@raccordement
Fonctionnalité: Relance pour demande complète de raccordement attendue

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offres | PPE2 - Petit PV Bâtiment |
            | période        | 1                        |

    Scénario: Relancer les porteurs pour demander l'ajout dans Potentiel de la demande complète de raccordement du projet
        Etant donné une tâche planifiée pour le projet lauréat avec :
            | type             | relance demande complète raccordement |
            | date d'exécution | 2025-01-11                            |
        Quand on exécute la tâche planifiée "relance demande complète raccordement" pour le projet lauréat à la date du "2025-11-01"
        Alors un email a été envoyé au porteur avec :
            | sujet      | Potentiel - Attente de transmission de la DCR pour le projet Du boulodrome de Marseille              |
            | nom_projet | Du boulodrome de Marseille                                                                           |
            | url        | https://potentiel.beta.gouv.fr/laureats/(.*)/raccordements/demande-complete-raccordement:transmettre |
        Et une tâche "relance demande complète raccordement" est planifiée à la date du "2025-12-01" pour le projet lauréat
