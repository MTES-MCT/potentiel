# language: fr
@abandon
Fonctionnalité: Annuler la demande d'abandon d'un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et un cahier des charges permettant la modification du projet

    Scénario: Un porteur annule la demande d'abandon d'un projet lauréat
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offres | PPE2 - Sol |
            | période        | 8          |
        Et la dreal "Dreal du sud" associée à la région du projet
        Et une demande d'abandon en cours pour le projet lauréat
        Quand le porteur annule la demande d'abandon pour le projet lauréat
        Et la demande d'abandon du projet lauréat devrait être annulée
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - Demande d'abandon annulée pour le projet Du boulodrome de Marseille .* |
            | nom_projet | Du boulodrome de Marseille                                                         |
            | url        | https://potentiel.beta.gouv.fr/laureats/.*/abandon                                 |
        Et un email a été envoyé à l'autorité instructrice avec :
            | sujet      | Potentiel - Demande d'abandon annulée pour le projet Du boulodrome de Marseille .* |
            | nom_projet | Du boulodrome de Marseille                                                         |
            | url        | https://potentiel.beta.gouv.fr/laureats/.*/abandon                                 |

    Scénario: Un porteur annule la demande d'abandon d'un projet lauréat de l'appel d'offres Petit PV
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offres | PPE2 - Petit PV Bâtiment |
            | période        | 1                        |
        Et la dreal "Dreal du sud" associée à la région du projet
        Et une demande d'abandon en cours pour le projet lauréat
        Quand le porteur annule la demande d'abandon pour le projet lauréat
        Et la demande d'abandon du projet lauréat devrait être annulée
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - Demande d'abandon annulée pour le projet Du boulodrome de Marseille .* |
            | nom_projet | Du boulodrome de Marseille                                                         |
            | url        | https://potentiel.beta.gouv.fr/laureats/.*/abandon                                 |
        Et un email a été envoyé à l'autorité instructrice avec :
            | sujet      | Potentiel - Demande d'abandon annulée pour le projet Du boulodrome de Marseille .* |
            | nom_projet | Du boulodrome de Marseille                                                         |
            | url        | https://potentiel.beta.gouv.fr/laureats/.*/abandon                                 |
        Et une tâche "rappel échéance achèvement à trois mois" est planifiée pour le projet lauréat
        Et une tâche "rappel échéance achèvement à deux mois" est planifiée pour le projet lauréat
        Et une tâche "rappel échéance achèvement à un mois" est planifiée pour le projet lauréat

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
