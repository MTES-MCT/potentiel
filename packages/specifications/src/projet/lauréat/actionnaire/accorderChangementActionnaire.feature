# language: fr
@actionnaire
Fonctionnalité: Accorder le changement d'actionnaire d'un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offres | Eolien                      |
            | période        | 6                           |
            | actionnariat   | investissement-participatif |
        Et un cahier des charges permettant la modification du projet
        Et la dreal "Dreal du sud" associée à la région du projet

    Scénario: la DREAL associée au projet accorde le changement d'actionnaire d'un projet lauréat
        Etant donné une demande de changement d'actionnaire en cours pour le projet lauréat
        Quand la DREAL associée au projet accorde le changement d'actionnaire pour le projet lauréat
        Alors l'actionnaire du projet lauréat devrait être mis à jour
        Et la demande de changement de l'actionnaire devrait être accordée
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - La demande de changement d'actionnaire pour le projet Du boulodrome de Marseille dans le département(.*) a été accordée |
            | nom_projet | Du boulodrome de Marseille                                                                                                          |
            | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                                               |
            | type       | accord                                                                                                                              |

    Scénario: Impossible d'accorder le changement d'actionnaire d'un projet lauréat si aucune demande n'est en cours
        Quand la DREAL associée au projet accorde le changement d'actionnaire pour le projet lauréat
        Alors l'utilisateur DREAL devrait être informé que "Aucune demande de changement d'actionnaire n'est en cours"

    Scénario: Impossible d'accorder le changement d'actionnaire d'un projet lauréat si la demande a déjà été accordée
        Etant donné une demande de changement d'actionnaire accordée pour le projet lauréat
        Quand la DREAL associée au projet accorde le changement d'actionnaire pour le projet lauréat
        Alors l'utilisateur DREAL devrait être informé que "La demande de changement d'actionnaire a déjà été accordée"

    Scénario: Impossible d'accorder le changement d'actionnaire d'un projet lauréat si la demande a déjà été annulée
        Etant donné une demande de changement d'actionnaire annulée pour le projet lauréat
        Quand la DREAL associée au projet accorde le changement d'actionnaire pour le projet lauréat
        Alors l'utilisateur DREAL devrait être informé que "Aucune demande de changement d'actionnaire n'est en cours"

    Scénario: Impossible d'accorder le changement d'actionnaire d'un projet lauréat si la demande a déjà été rejetée
        Etant donné une demande de changement d'actionnaire rejetée pour le projet lauréat
        Quand la DREAL associée au projet accorde le changement d'actionnaire pour le projet lauréat
        Alors l'utilisateur DREAL devrait être informé que "Aucune demande de changement d'actionnaire n'est en cours"
