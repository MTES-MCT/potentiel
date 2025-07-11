# language: fr
@délai
@rejeter-délai
Fonctionnalité: Rejeter la demande de délai d'un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et un cahier des charges modificatif choisi
        Et la dreal "Dreal du sud" associée à la région du projet

    Scénario: la DREAL associée au projet rejette le délai d'un projet lauréat
        Etant donné une demande de délai en cours pour le projet lauréat
        Quand la DREAL associée au projet rejette le délai pour le projet lauréat
        Alors la demande de délai devrait être rejetée
        Et la date d'achèvement prévisionnel du projet lauréat ne devrait pas être mis à jour
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - La demande de délai pour le projet Du boulodrome de Marseille dans le département(.*) a été rejetée |
            | nom_projet | Du boulodrome de Marseille                                                                                      |
            | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                           |
            | type       | rejet                                                                                                           |

    Scénario: Impossible de rejeter le délai d'un projet lauréat si aucune demande n'est en cours
        Quand la DREAL associée au projet rejette le délai pour le projet lauréat
        Alors l'utilisateur DREAL devrait être informé que "Aucune demande de délai n'est en cours"

    Scénario: Impossible de rejeter le délai d'un projet lauréat si la demande a déjà été accordée
        Etant donné une demande de délai accordée pour le projet lauréat
        Quand la DREAL associée au projet rejette le délai pour le projet lauréat
        Alors l'utilisateur DREAL devrait être informé que "La demande de délai a déjà été accordée"

    Scénario: Impossible de rejeter le délai d'un projet lauréat si la demande a déjà été annulée
        Etant donné une demande de délai annulée pour le projet lauréat
        Quand la DREAL associée au projet rejette le délai pour le projet lauréat
        Alors l'utilisateur DREAL devrait être informé que "Aucune demande de délai n'est en cours"

    Scénario: Impossible de rejeter le délai d'un projet lauréat si la demande a déjà été rejetée
        Etant donné une demande de délai rejetée pour le projet lauréat
        Quand la DREAL associée au projet rejette le délai pour le projet lauréat
        Alors l'utilisateur DREAL devrait être informé que "Aucune demande de délai n'est en cours"
