# language: fr
@représentant-légal
Fonctionnalité: Annuler la demande de changement de représentant légal d'un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et la dreal "Dreal du sud-ouest" associée à la région du projet
        Et un cahier des charges permettant la modification du projet

    Scénario: Un porteur annule la demande de changement de représentant légal d'un projet lauréat
        Etant donné une demande de changement de représentant légal en cours pour le projet lauréat
        Quand le porteur annule la demande de changement de représentant légal pour le projet lauréat
        Alors la demande de changement de représentant légal du projet lauréat ne devrait plus être consultable
        Et il n'y a pas de tâche "gestion automatique de la demande de changement de représentant légal" planifiée pour le projet lauréat
        Et il n'y a pas de tâche "rappel d'instruction de la demande de changement de représentant légal à deux mois" planifiée pour le projet lauréat
        Et un email a été envoyé à la dreal avec :
            | sujet      | Potentiel - Annulation de la demande de modification du représentant légal pour le projet Du boulodrome de Marseille situé dans le département(.*) |
            | nom_projet | Du boulodrome de Marseille                                                                                                                         |
            | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                                                              |

    Scénario: Impossible d'annuler la demande de changement de représentant légal d'un projet lauréat si aucun changement n'a été demandé
        Quand le porteur annule la demande de changement de représentant légal pour le projet lauréat
        Alors le porteur devrait être informé que "Aucun changement de représentant légal n'est en cours"

    Scénario: Impossible d'annuler la demande de changement de représentant légal d'un projet lauréat si il a déjà été accordé
        Etant donné une demande de changement de représentant légal accordée pour le projet lauréat
        Quand le porteur annule la demande de changement de représentant légal pour le projet lauréat
        Alors le porteur devrait être informé que "La demande de changement de représentant légal a déjà été accordée"

    Scénario: Impossible d'annuler la demande de changement de représentant légal d'un projet lauréat si il a déjà été rejeté
        Etant donné une demande de changement de représentant légal rejetée pour le projet lauréat
        Quand le porteur annule la demande de changement de représentant légal pour le projet lauréat
        Alors le porteur devrait être informé que "La demande de changement de représentant légal a déjà été rejetée"
