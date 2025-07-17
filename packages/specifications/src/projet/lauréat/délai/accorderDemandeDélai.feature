# language: fr
@délai
@accorder-demande-délai
Fonctionnalité: Accorder la demande de délai d'un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Bordeaux"
        Et un cahier des charges modificatif choisi
        Et la dreal "Dreal du sud" associée à la région du projet

    Plan du scénario: la DREAL associée au projet accorde la demande de délai d'un projet lauréat
        Etant donné une date d'achèvement prévisionnel pour le projet lauréat au "<date achèvement prévisionnel actuelle>"
        Et une demande de délai en cours de "<durée du délai demandé>" mois pour le projet lauréat
        Quand la DREAL associée au projet accorde la demande de délai pour le projet lauréat
        Alors la demande de délai devrait être accordée
        Et la date d'achèvement prévisionnel du projet lauréat devrait être au "<date achèvement prévisionnel attendue>"
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - La demande de délai pour le projet Du boulodrome de Bordeaux situé dans le département(.*) a été accordée |
            | nom_projet | Du boulodrome de Bordeaux                                                                                             |
            | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                                 |

        Exemples:
            | date achèvement prévisionnel actuelle | durée du délai demandé | date achèvement prévisionnel attendue |
            | 2022-05-01                            | 12                     | 2023-05-01                            |


# Scénario: Impossible d'accorder le délai d'un projet lauréat si aucune demande n'est en cours
#     Quand la DREAL associée au projet rejette le délai pour le projet lauréat
#     Alors l'utilisateur DREAL devrait être informé que "Aucune demande de délai n'est en cours"

# Scénario: Impossible d'accorder le délai d'un projet lauréat si la demande a déjà été accordée
#     Etant donné une demande de délai accordée pour le projet lauréat
#     Quand la DREAL associée au projet rejette le délai pour le projet lauréat
#     Alors l'utilisateur DREAL devrait être informé que "La demande de délai a déjà été accordée"
#

# Scénario: Impossible d'accorder le délai d'un projet lauréat si la demande a déjà été annulée
#     Etant donné une demande de délai annulée pour le projet lauréat
#     Quand la DREAL associée au projet rejette le délai pour le projet lauréat
#     Alors l'utilisateur DREAL devrait être informé que "Aucune demande de délai n'est en cours"

# Scénario: Impossible d'accorder le délai d'un projet lauréat si la demande a déjà été rejetée
#     Etant donné une demande de délai rejetée pour le projet lauréat
#     Quand la DREAL associée au projet rejette le délai pour le projet lauréat
#     Alors l'utilisateur DREAL devrait être informé que "Aucune demande de délai n'est en cours"