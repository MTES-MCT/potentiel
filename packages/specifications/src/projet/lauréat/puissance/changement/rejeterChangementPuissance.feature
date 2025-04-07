# language: fr
Fonctionnalité: Rejeter la demande de changement de puissance d'un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et le porteur "Marcel Patoulatchi" ayant accés au projet lauréat "Du boulodrome de Marseille"
        Et la dreal "Dreal du sud" associée à la région du projet

    Scénario: la DREAL associée au projet rejette le changement de puissance d'un projet lauréat
        Etant donné une demande de changement de puissance à la baisse pour le projet lauréat
        Quand la DREAL associée au projet rejette le changement de puissance à la baisse pour le projet lauréat
        Alors la demande de changement de la puissance devrait être rejetée
        Et la puissance du projet lauréat ne devrait pas être mise à jour
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - La demande de changement de puissance pour le projet Du boulodrome de Marseille dans le département(.*) a été rejetée |
            | nom_projet | Du boulodrome de Marseille                                                                                                        |
            | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                                             |
            | type       | rejet                                                                                                                             |

    Scénario: le DGEC validateur rejette le changement de puissance d'un projet lauréat
        Etant donné une demande de changement de puissance à la hausse pour le projet lauréat
        Quand le DGEC validateur rejette le changement de puissance à la hausse pour le projet lauréat
        Alors la demande de changement de la puissance devrait être rejetée
        Et la puissance du projet lauréat ne devrait pas être mise à jour
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - La demande de changement de puissance pour le projet Du boulodrome de Marseille dans le département(.*) a été rejetée |
            | nom_projet | Du boulodrome de Marseille                                                                                                        |
            | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                                             |
            | type       | rejet                                                                                                                             |

    Scénario: Impossible de rejeter une demande de changement de puissance à la hausse d'un projet lauréat pour un utilisateur DREAL
        Etant donné une demande de changement de puissance à la hausse pour le projet lauréat
        Quand la DREAL associée au projet accorde le changement de puissance à la baisse pour le projet lauréat
        Alors l'utilisateur DREAL devrait être informé que "Une demande de changement de puissance à la hausse doit être instruite par la DGEC"

    Scénario: Impossible de rejeter une demande de changement de puissance à la baisse d'un projet lauréat pour un utilisateur DGEC
        Etant donné une demande de changement de puissance à la baisse pour le projet lauréat
        Quand le DGEC validateur accorde le changement de puissance à la baisse pour le projet lauréat
        Alors l'utilisateur DGEC devrait être informé que "Une demande de changement de puissance à la baisse doit être instruite par la DREAL"

    Scénario: Impossible de rejeter le changement de puissance d'un projet lauréat si aucune demande n'est en cours
        Quand la DREAL associée au projet rejette le changement de puissance à la baisse pour le projet lauréat
        Alors l'utilisateur DREAL devrait être informé que "Aucune demande de changement de puissance n'est en cours"

    @NotImplemented
    Scénario: Impossible de rejeter le changement de puissance d'un projet lauréat si la demande a déjà été accordée
        Etant donné une demande de changement de puissance à la baisse accordée pour le projet lauréat
        Quand la DREAL associée au projet rejette le changement de puissance à la baisse pour le projet lauréat
        Alors l'utilisateur DREAL devrait être informé que "La demande de changement de puissance a déjà été accordée"

    @NotImplemented
    Scénario: Impossible de rejeter le changement de puissance d'un projet lauréat si la demande a déjà été annulée
        Etant donné une demande de changement de puissance à la baisse annulée pour le projet lauréat
        Quand la DREAL associée au projet rejette le changement de puissance à la baisse pour le projet lauréat
        Alors l'utilisateur DREAL devrait être informé que "Aucune demande de changement de puissance n'est en cours"

    @NotImplemented
    Scénario: Impossible de rejeter le changement de puissance d'un projet lauréat si la demande a déjà été rejetée
        Etant donné une demande de changement de puissance à la baisse rejetée pour le projet lauréat
        Quand la DREAL associée au projet rejette le changement de puissance à la baisse pour le projet lauréat
        Alors l'utilisateur DREAL devrait être informé que "Aucune demande de changement de puissance n'est en cours"
