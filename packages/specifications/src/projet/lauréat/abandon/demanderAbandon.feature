# language: fr
@abandon
@demander-abandon
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
            | sujet      | Potentiel - Du boulodrome de Marseille - Nouvelle demande d'abandon |
            | nom_projet | Du boulodrome de Marseille                                          |
            | url        | https://potentiel.beta.gouv.fr/laureats/.*/abandon                  |
        Et un email a été envoyé à l'autorité instructrice avec :
            | sujet      | Potentiel - Du boulodrome de Marseille - Nouvelle demande d'abandon |
            | nom_projet | Du boulodrome de Marseille                                          |
            | url        | https://potentiel.beta.gouv.fr/laureats/.*/abandon                  | 

    Scénario: La demande d'abandon supprime les tâches et tâches planifiées liées au raccordement d'un projet lauréat
        Etant donné le projet lauréat "Du boulodrome de Paris" avec :
            | appel d'offres | PPE2 - Petit PV Bâtiment |
            | période        | 1                        |
        Quand le porteur demande l'abandon pour le projet lauréat
       Alors il n'y a pas de tâche "relance transmission de la demande complète raccordement" planifiée pour le projet lauréat
        Et une tâche indiquant de "mettre à jour le gestionnaire de réseau" n'est plus consultable dans la liste des tâches du porteur pour le projet
        Et une tâche indiquant de "transmettre une référence de raccordement" n'est plus consultable dans la liste des tâches du porteur pour le projet
        Et une tâche indiquant de "renseigner l'accusé de réception de la demande complète de raccordement" n'est plus consultable dans la liste des tâches du porteur pour le projet 

    Scénario: Un porteur demande l'abandon d'un projet lauréat de l'appel d'offres Petit PV
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offres | PPE2 - Petit PV Bâtiment |
            | période        | 1                        |
        Et la dreal "Dreal du sud" associée à la région du projet
        Quand le porteur demande l'abandon pour le projet lauréat
        Alors l'abandon du projet lauréat devrait être demandé
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - Du boulodrome de Marseille - Nouvelle demande d'abandon |
            | nom_projet | Du boulodrome de Marseille                                          |
        Et un email a été envoyé à l'autorité instructrice avec :
            | sujet      | Potentiel - Du boulodrome de Marseille - Nouvelle demande d'abandon |
            | nom_projet | Du boulodrome de Marseille                                          |
        Et il n'y a pas de tâche "rappel échéance achèvement à trois mois" planifiée pour le projet lauréat
        Et il n'y a pas de tâche "rappel échéance achèvement à deux mois" planifiée pour le projet lauréat
        Et il n'y a pas de tâche "rappel échéance achèvement à un mois" planifiée pour le projet lauréat

    Scénario: Un porteur demande l'abandon d'un projet lauréat en signalant un PPA
        Etant donné le projet lauréat "Du boulodrome de Rome" avec :
            | appel d'offres | PPE2 - Sol |
            | période        | 8          |
        Et la dreal "Dreal italienne" associée à la région du projet
        Quand le porteur demande l'abandon pour le projet lauréat en signalant un PPA
        Alors l'abandon du projet lauréat devrait être demandé
        Et l'état PPA devrait être consultable pour le projet lauréat
        Et un email a été envoyé à la dgec avec :
            | sujet | Potentiel - Du boulodrome de Rome - Signalement PPA |
            | url   | https://potentiel.beta.gouv.fr/laureats/.*          |
        Et un email a été envoyé à la dreal avec :
            | sujet | Potentiel - Du boulodrome de Rome - Signalement PPA |
            | url   | https://potentiel.beta.gouv.fr/laureats/.*          |

    Scénario: La demande d'abandon avec signalement d'un PPA ne supprime pas les tâches et tâches planifiées liées au raccordement d'un projet lauréat
        Etant donné le projet lauréat "Du boulodrome de Paris" avec :
            | appel d'offres | PPE2 - Petit PV Bâtiment |
            | période        | 1                        |
        Quand le porteur demande l'abandon pour le projet lauréat en signalant un PPA
        Alors une tâche "relance transmission de la demande complète raccordement" est planifiée pour le projet lauréat
        Et une tâche indiquant de "mettre à jour le gestionnaire de réseau" est consultable dans la liste des tâches du porteur pour le projet
        Et une tâche indiquant de "transmettre une référence de raccordement" est consultable dans la liste des tâches du porteur pour le projet     

    Scénario: La demande d'abandon après signalement d'un PPA ne supprime pas les tâches et tâches planifiées liées au raccordement d'un projet lauréat
        Etant donné le projet lauréat "Du boulodrome de Paris" avec :
            | appel d'offres | PPE2 - Petit PV Bâtiment |
            | période        | 1                        |
        Et le signalement par l'administration d'un PPA pour le projet lauréat   
        Quand le porteur demande l'abandon pour le projet lauréat
        Alors une tâche "relance transmission de la demande complète raccordement" est planifiée pour le projet lauréat
        Et une tâche indiquant de "mettre à jour le gestionnaire de réseau" est consultable dans la liste des tâches du porteur pour le projet
        Et une tâche indiquant de "transmettre une référence de raccordement" est consultable dans la liste des tâches du porteur pour le projet      

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
        Etant donné une attestation de conformité et un rapport associé transmis pour le projet lauréat
        Quand le porteur demande l'abandon pour le projet lauréat
        Alors le porteur devrait être informé que "Impossible de faire un changement pour un projet achevé"

    Scénario: Impossible de demander l'abandon d'un projet si le cahier des charges ne le permet pas
        Etant donné le projet lauréat "Du bouchon lyonnais" avec :
            | appel d'offres | CRE4 - Autoconsommation métropole |
            | période        | 10                                |
        Quand le porteur demande l'abandon pour le projet lauréat
        Alors le porteur devrait être informé que "Le cahier des charges de ce projet ne permet pas ce changement"
