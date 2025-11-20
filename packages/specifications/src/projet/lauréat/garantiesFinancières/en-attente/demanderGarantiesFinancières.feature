# language: fr
@garanties-financières
Fonctionnalité: Demande des garanties financières

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et la dreal "Dreal du sud" associée à la région du projet
        Et un cahier des charges permettant la modification du projet

    Scénario: Relancer tous les mois le PP et la DREAL avec des garanties financières en attente
        Etant donné une tâche planifiée pour le projet lauréat avec :
            | type             | rappel des garanties financières à transmettre |
            | date d'exécution | 2024-08-17                                     |
        Quand on exécute la tâche planifiée "rappel des garanties financières à transmettre" pour le projet lauréat à la date du "2024-08-17"
        Alors un email a été envoyé au porteur avec :
            | sujet      | Potentiel - Garanties financières en attente pour le projet Du boulodrome de Marseille dans le département(.*) |
            | nom_projet | Du boulodrome de Marseille                                                                                     |
            | url        | https://potentiel.beta.gouv.fr/laureats/(.*)/garanties-financieres/depot:soumettre                             |
        Et un email a été envoyé à la dreal avec :
            | sujet      | Potentiel - Garanties financières en attente pour le projet Du boulodrome de Marseille dans le département(.*) |
            | nom_projet | Du boulodrome de Marseille                                                                                     |
            | url        | https://potentiel.beta.gouv.fr/projets/.*                                                                      |
        Et une tâche "rappel des garanties financières à transmettre" est planifiée à la date du "2024-09-17" pour le projet lauréat
