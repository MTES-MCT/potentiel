# language: fr
Fonctionnalité: Annuler la demande de changement de représentant légal d'un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et le porteur "Marcel Patoulatchi" ayant accés au projet lauréat "Du boulodrome de Marseille"
        Et la dreal "Dreal du sud-ouest" associée à la région du projet

    Scénario: Un porteur annule la demande de changement de représentant légal d'un projet lauréat
        Etant donné une demande de changement de représentant légal en cours pour le projet lauréat
        Quand le porteur annule la demande de changement de représentant légal pour le projet lauréat
        Alors la demande de changement de représentant légal du projet lauréat ne devrait plus être consultable
        Et une tâche "gestion automatique de la demande de changement de représentant légal" n'est plus planifiée pour le projet "Du boulodrome de Marseille"
        Et une tâche "rappel d'instruction de la demande de changement de représentant légal à deux mois" n'est plus planifiée pour le projet "Du boulodrome de Marseille"
        Et un email a été envoyé à la dreal avec :
            | sujet      | Potentiel - Annulation de la demande de modification du représentant légal pour le projet Du boulodrome de Marseille situé dans le département(.*) |
            | nom_projet | Du boulodrome de Marseille                                                                                                                         |
            | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                                                              |

    Scénario: Impossible d'annuler la demande de changement de représentant légal d'un projet lauréat si aucun changement n'a été demandé
        Quand le porteur annule la demande de changement de représentant légal pour le projet lauréat
        Alors le porteur devrait être informé que "Aucune demande de changement de représentant légal n'est en cours"

    @NotImplemented
    Scénario: Impossible d'annuler la demande de changement de représentant légal d'un projet lauréat si il a déjà été accordé
        Etant donné un abandon accordé pour le projet lauréat
        Quand le porteur annule la demande de changement de représentant légal pour le projet lauréat
        Alors le porteur devrait être informé que "Le changement de représentant légal a déjà été accordé"

    @NotImplemented
    Scénario: Impossible d'annuler la demande de changement de représentant légal d'un projet lauréat si il a déjà été rejeté
        Etant donné un abandon rejeté pour le projet lauréat
        Quand le porteur annule la demande de changement de représentant légal pour le projet lauréat
        Alors le porteur devrait être informé que "Le changement de représentant légal a déjà été rejeté"
