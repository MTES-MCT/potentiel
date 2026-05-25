# language: fr
@abandon
@annuler-abandon
Fonctionnalité: Annuler la demande d'abandon d'un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et un cahier des charges permettant la modification du projet

    Scénario: Un porteur annule la demande d'abandon d'un projet lauréat
        Etant donné la dreal "Dreal du sud" associée à la région du projet
        Et une demande d'abandon en cours pour le projet lauréat
        Quand le porteur annule la demande d'abandon pour le projet lauréat
        Et la demande d'abandon du projet lauréat devrait être annulée
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - Du boulodrome de Marseille - Demande d'abandon annulée |
            | nom_projet | Du boulodrome de Marseille                                         |
            | url        | https://potentiel.beta.gouv.fr/laureats/.*/abandon                 |
        Et un email a été envoyé à l'autorité instructrice avec :
            | sujet      | Potentiel - Du boulodrome de Marseille - Demande d'abandon annulée |
            | nom_projet | Du boulodrome de Marseille                                         |
            | url        | https://potentiel.beta.gouv.fr/laureats/.*/abandon                 |   
    
    Scénario: L'annulation de l'abandon d'un projet lauréat réactive les tâches et tâches planifiées liées au raccordement du projet (projet sans DCR)
        Etant donné le projet lauréat "Du boulodrome de Poitiers" avec :
            | appel d'offres | PPE2 - Petit PV Bâtiment |
            | période        | 1                        |
        Et une demande d'abandon en cours pour le projet lauréat
        Quand le porteur annule la demande d'abandon pour le projet lauréat
        Et une tâche "relance transmission de la demande complète raccordement" est planifiée pour le projet lauréat
        Et une tâche indiquant de "mettre à jour le gestionnaire de réseau" est consultable dans la liste des tâches du porteur pour le projet
        Et une tâche indiquant de "transmettre une référence de raccordement" est consultable dans la liste des tâches du porteur pour le projet

    Scénario: L'annulation de l'abandon d'un projet lauréat réactive les tâches et tâches planifiées liées au raccordement du projet (projet avec DCR sans AR)
        Etant donné le projet lauréat "Du boulodrome de Poitiers" avec :
            | appel d'offres | PPE2 - Petit PV Bâtiment |
            | période        | 1                        |
        Et une demande complète de raccordement sans accusé de réception pour le projet lauréat 
        Et une demande d'abandon en cours pour le projet lauréat
        Quand le porteur annule la demande d'abandon pour le projet lauréat
        Et une tâche indiquant de "renseigner l'accusé de réception de la demande complète de raccordement" est consultable dans la liste des tâches du porteur pour le projet  

    Scénario: Un porteur annule la demande d'abandon d'un projet lauréat de l'appel d'offres Petit PV
        Etant donné le projet lauréat "Du boulodrome du Savon" avec :
            | appel d'offres | PPE2 - Petit PV Bâtiment |
            | période        | 1                        |
        Et la dreal "Dreal du sud" associée à la région du projet
        Et une demande d'abandon en cours pour le projet lauréat
        Quand le porteur annule la demande d'abandon pour le projet lauréat
        Et la demande d'abandon du projet lauréat devrait être annulée
        Et un email a été envoyé au porteur avec :
            | sujet | Potentiel - Du boulodrome du Savon - Demande d'abandon annulée |
            | url   | https://potentiel.beta.gouv.fr/laureats/.*/abandon             |
        Et un email a été envoyé à l'autorité instructrice avec :
            | sujet | Potentiel - Du boulodrome du Savon - Demande d'abandon annulée |
            | url   | https://potentiel.beta.gouv.fr/laureats/.*/abandon             |
        Et une tâche "rappel échéance achèvement à trois mois" est planifiée pour le projet lauréat
        Et une tâche "rappel échéance achèvement à deux mois" est planifiée pour le projet lauréat
        Et une tâche "rappel échéance achèvement à un mois" est planifiée pour le projet lauréat

    Scénario: Un porteur annule la demande d'abandon d'un projet lauréat en ayant déclarer un PPA
        Etant donné la dreal "Dreal du sud" associée à la région du projet
        Et une demande d'abandon en cours avec signalement de PPA pour le projet lauréat
        Quand le porteur annule la demande d'abandon pour le projet lauréat
        Alors l'état PPA ne devrait pas être consultable pour le projet lauréat
        Et un email a été envoyé à la dgec avec :
            | sujet | Potentiel - Du boulodrome de Marseille - Annulation signalement PPA |
            | url   | https://potentiel.beta.gouv.fr/laureats/.*                          |
        Et un email a été envoyé à la dreal avec :
            | sujet | Potentiel - Du boulodrome de Marseille - Annulation signalement PPA |
            | url   | https://potentiel.beta.gouv.fr/laureats/.*                          |

    Scénario: Un porteur annule la demande d'abandon d'un projet lauréat déclaré en PPA par l'administration
        Etant donné le signalement par l'administration d'un PPA pour le projet lauréat
        Et une demande d'abandon en cours pour le projet lauréat
        Quand le porteur annule la demande d'abandon pour le projet lauréat
        Alors l'état PPA devrait être consultable pour le projet lauréat

    Scénario: Un porteur annule la demande d'abandon en instruction d'un projet lauréat
        Etant donné une demande d'abandon en instruction pour le projet lauréat
        Quand le porteur annule la demande d'abandon pour le projet lauréat
        Et la demande d'abandon du projet lauréat devrait être annulée

    Scénario: Impossible d'annuler la demande d'abandon d'un projet lauréat si l'abandon a déjà été accordé
        Etant donné une demande d'abandon accordée pour le projet lauréat
        Quand le porteur annule la demande d'abandon pour le projet lauréat
        Alors le porteur devrait être informé que "La demande d'abandon a déjà été accordée"

    Scénario: Impossible d'annuler la demande d'abandon d'un projet lauréat si aucun abandon n'a été demandé
        Quand le porteur annule la demande d'abandon pour le projet lauréat
        Alors le porteur devrait être informé que "Aucune demande d'abandon n'est en cours"

    Scénario: Impossible d'annuler la demande d'abandon d'un projet lauréat si l'abandon a déjà été rejeté
        Etant donné une demande d'abandon rejetée pour le projet lauréat
        Quand le porteur annule la demande d'abandon pour le projet lauréat
        Alors le porteur devrait être informé que "La demande d'abandon a déjà été rejetée"

    Scénario: Impossible d'annuler la demande d'abandon d'un projet lauréat si la demande d'abandon a déjà été confirmée
        Etant donné une demande d'abandon confirmée pour le projet lauréat
        Quand le porteur annule la demande d'abandon pour le projet lauréat
        Alors le porteur devrait être informé que "La demande d'abandon a déjà été confirmée"

    Scénario: Impossible d'annuler la demande d'abandon d'un projet lauréat si la demande d'abandon a déjà été annulée
        Etant donné une demande d'abandon annulée pour le projet lauréat
        Quand le porteur annule la demande d'abandon pour le projet lauréat
        Alors le porteur devrait être informé que "La demande d'abandon a déjà été annulée"
