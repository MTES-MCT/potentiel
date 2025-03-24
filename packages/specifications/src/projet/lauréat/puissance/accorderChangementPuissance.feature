# language: fr
@NotImplemented
Fonctionnalité: Accorder le changement de puissance d'un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et le porteur "Marcel Patoulatchi" ayant accés au projet lauréat "Du boulodrome de Marseille"
        Et la dreal "Dreal du sud" associée à la région du projet

    Scénario: la DREAL associée au projet accorde le changement de puissance d'un projet lauréat
        Etant donné une demande de changement de puissance à la baisse en cours pour le projet lauréat
        Quand la DREAL associée au projet accorde le changement de puissance pour le projet lauréat
        Alors la puissance du projet lauréat devrait être mis à jour
        Et la demande de changement de la puissance devrait être accordée
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - La demande de changement de puissance pour le projet Du boulodrome de Marseille dans le département(.*) a été accordée |
            | nom_projet | Du boulodrome de Marseille                                                                                                         |
            | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                                              |
            | type       | accord                                                                                                                             |

    Scénario: le DGEC validateur accorde le changement de puissance d'un projet lauréat
        Etant donné une demande de changement de puissance à la hausse en cours pour le projet lauréat
        Quand le DGEC validateur accorde le changement de puissance pour le projet lauréat
        Alors la puissance du projet lauréat devrait être mis à jour
        Et la demande de changement de la puissance devrait être accordée
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - La demande de changement de puissance pour le projet Du boulodrome de Marseille dans le département(.*) a été accordée |
            | nom_projet | Du boulodrome de Marseille                                                                                                         |
            | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                                              |
            | type       | accord                                                                                                                             |

    Scénario: Impossible d'accorder le changement de puissance d'un projet lauréat si aucune demande n'est en cours
        Quand la DREAL associée au projet accorde le changement de puissance pour le projet lauréat
        Alors l'utilisateur DREAL devrait être informé que "Aucune demande de changement de puissance n'est en cours"

    Scénario: Impossible d'accorder le changement de puissance d'un projet lauréat si la demande a déjà été accordée
        Etant donné une demande de changement de puissance à la baisse accordée pour le projet lauréat
        Quand la DREAL associée au projet accorde le changement de puissance pour le projet lauréat
        Alors l'utilisateur DREAL devrait être informé que "La demande de changement de puissance a déjà été accordée"

    Scénario: Impossible d'accorder le changement de puissance d'un projet lauréat si la demande a déjà été annulée
        Etant donné une demande de changement de puissance à la baisse annulée pour le projet lauréat
        Quand la DREAL associée au projet accorde le changement de puissance pour le projet lauréat
        Alors l'utilisateur DREAL devrait être informé que "Aucune demande de changement de puissance n'est en cours"

    Scénario: Impossible d'accorder le changement de puissance d'un projet lauréat si la demande a déjà été rejetée
        Etant donné une demande de changement de puissance à la baisse rejetée pour le projet lauréat
        Quand la DREAL associée au projet accorde le changement de puissance pour le projet lauréat
        Alors l'utilisateur DREAL devrait être informé que "Aucune demande de changement de puissance n'est en cours"
