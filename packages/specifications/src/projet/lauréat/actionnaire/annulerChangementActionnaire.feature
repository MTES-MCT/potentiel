# language: fr
@actionnaire
@select
Fonctionnalité: Annuler la demande changement de l'actionnaire d'un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offres | Eolien                      |
            | période        | 6                           |
            | actionnariat   | investissement-participatif |
        Et un cahier des charges permettant la modification du projet
        Et la dreal "DREAL" associée à la région du projet

    Scénario: Annuler la demande de changement d'actionnaire d'un projet lauréat
        Etant donné une demande de changement d'actionnaire en cours pour le projet lauréat
        Quand le porteur annule la demande de changement de l'actionnaire pour le projet lauréat
        Alors la demande de changement de l'actionnaire devrait être annulée
        Et un email a été envoyé à la dreal avec :
            | sujet      | Potentiel - La demande de changement d'actionnaire pour le projet Du boulodrome de Marseille dans le département(.*) a été annulée |
            | nom_projet | Du boulodrome de Marseille                                                                                                         |
            | url        | https://potentiel.beta.gouv.fr/projets/.*                                                                                          |
            | type       | annulation                                                                                                                         |

    Scénario: Impossible d'annuler la demande de changement de l'actionnaire si la demande est inexistante
        Quand le porteur annule la demande de changement de l'actionnaire pour le projet lauréat
        Alors l'utilisateur devrait être informé que "Aucune demande de changement d'actionnaire n'est en cours"

    Scénario: Impossible d'annuler la demande de changement de l'actionnaire si la demande est acceptée
        Etant donné une demande de changement d'actionnaire accordée pour le projet lauréat
        Quand le porteur annule la demande de changement de l'actionnaire pour le projet lauréat
        Alors l'utilisateur devrait être informé que "La demande de changement d'actionnaire a déjà été accordée"

    Scénario: Impossible d'annuler la demande de changement de l'actionnaire si la demande est rejetée
        Etant donné une demande de changement d'actionnaire rejetée pour le projet lauréat
        Quand le porteur annule la demande de changement de l'actionnaire pour le projet lauréat
        Alors l'utilisateur devrait être informé que "Aucune demande de changement d'actionnaire n'est en cours"
