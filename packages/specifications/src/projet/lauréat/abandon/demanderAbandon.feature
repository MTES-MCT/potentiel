# language: fr
@abandon
Fonctionnalité: Demander l'abandon d'un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et un cahier des charges permettant la modification du projet

    Scénario: Un porteur demande l'abandon d'un projet lauréat
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offres | PPE2 - Sol |
            | période        | 8          |
        Et la dreal "Dreal du sud" associée à la région du projet
        Quand le porteur demande l'abandon pour le projet lauréat
        Alors l'abandon du projet lauréat devrait être demandé
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - Nouvelle demande d'abandon pour le projet Du boulodrome de Marseille .* |
            | nom_projet | Du boulodrome de Marseille                                                          |
            | url        | https://potentiel.beta.gouv.fr/laureats/.*/abandon                                  |
        Et un email a été envoyé à l'autorité instructrice avec :
            | sujet      | Potentiel - Nouvelle demande d'abandon pour le projet Du boulodrome de Marseille .* |
            | nom_projet | Du boulodrome de Marseille                                                          |
            | url        | https://potentiel.beta.gouv.fr/laureats/.*/abandon                                  |

    Scénario: Un porteur demande l'abandon d'un projet lauréat de l'appel d'offres Petit PV
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offres | PPE2 - Petit PV Bâtiment |
            | période        | 1                        |
        Et la dreal "Dreal du sud" associée à la région du projet
        Quand le porteur demande l'abandon pour le projet lauréat
        Alors l'abandon du projet lauréat devrait être demandé
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - Nouvelle demande d'abandon pour le projet Du boulodrome de Marseille .* |
            | nom_projet | Du boulodrome de Marseille                                                          |
        Et un email a été envoyé à l'autorité instructrice avec :
            | sujet      | Potentiel - Nouvelle demande d'abandon pour le projet Du boulodrome de Marseille .* |
            | nom_projet | Du boulodrome de Marseille                                                          |
        Et il n'y a pas de tâche "rappel échéance achèvement à trois mois" planifiée pour le projet lauréat
        Et il n'y a pas de tâche "rappel échéance achèvement à deux mois" planifiée pour le projet lauréat
        Et il n'y a pas de tâche "rappel échéance achèvement à un mois" planifiée pour le projet lauréat

    Scénario: Un porteur demande l'abandon d'un projet lauréat après un rejet
        Etant donné une demande d'abandon rejetée pour le projet lauréat
        Quand le porteur demande l'abandon pour le projet lauréat
        Alors l'abandon du projet lauréat devrait être de nouveau demandé

    Scénario: Impossible de demander l'abandon d'un projet si l'abandon est déjà en cours (demandé)
        Etant donné une demande d'abandon en cours pour le projet lauréat
        Quand le porteur demande l'abandon pour le projet lauréat
        Alors le porteur devrait être informé que "Une demande d'abandon est déjà en cours"

    Scénario: Impossible de demander l'abandon d'un projet si l'abandon est déjà en cours (en instruction)
        Etant donné une demande d'abandon en instruction pour le projet lauréat
        Quand le porteur demande l'abandon pour le projet lauréat
        Alors le porteur devrait être informé que "Une demande d'abandon est déjà en cours"

    Scénario: Impossible de demander l'abandon d'un projet si une demande d'abandon est déjà accordée
        Etant donné une demande d'abandon accordée pour le projet lauréat
        Quand le porteur demande l'abandon pour le projet lauréat
        Alors le porteur devrait être informé que "La demande d'abandon a déjà été accordée"

    Scénario: Impossible de demander l'abandon d'un projet achevé
        Etant donné une attestation de conformité transmise pour le projet lauréat
        Quand le porteur demande l'abandon pour le projet lauréat
        Alors le porteur devrait être informé que "Impossible de faire un changement pour un projet achevé"

    Scénario: Impossible de demander l'abandon d'un projet si le cahier des charges ne le permet pas
        Etant donné le projet lauréat "Du bouchon lyonnais" avec :
            | appel d'offres | CRE4 - Autoconsommation métropole |
            | période        | 10                                |
        Quand le porteur demande l'abandon pour le projet lauréat
        Alors le porteur devrait être informé que "Le cahier des charges de ce projet ne permet pas ce changement"
