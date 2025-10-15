# language: fr
@puissance
Fonctionnalité: Accorder le changement de puissance d'un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offres | PPE2 - Eolien |
            | période        | 1             |
        Et la dreal "Dreal du sud" associée à la région du projet

    Scénario: la DREAL associée au projet accorde une demande de changement de puissance à la baisse d'un projet lauréat
        Etant donné une demande de changement de puissance pour le projet lauréat avec :
            | ratio puissance | 0.75 |
        Quand la DREAL associée au projet accorde le changement de puissance pour le projet lauréat
        Alors la demande de changement de la puissance devrait être accordée
        Et la puissance du projet lauréat devrait être mise à jour
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - La demande de changement de puissance pour le projet Du boulodrome de Marseille dans le département(.*) a été accordée |
            | nom_projet | Du boulodrome de Marseille                                                                                                         |
            | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                                              |
            | type       | accord                                                                                                                             |

    Scénario: la DREAL associée au projet accorde une demande de changement de puissance à la hausse d'un projet lauréat
        Etant donné une demande de changement de puissance pour le projet lauréat avec :
            | ratio puissance | 1.45 |
        Quand la DREAL associée au projet accorde le changement de puissance pour le projet lauréat
        Alors la demande de changement de la puissance devrait être accordée
        Et la puissance du projet lauréat devrait être mise à jour
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - La demande de changement de puissance pour le projet Du boulodrome de Marseille dans le département(.*) a été accordée |
            | nom_projet | Du boulodrome de Marseille                                                                                                         |
            | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                                              |
            | type       | accord                                                                                                                             |

    Scénario: Impossible d'accorder le changement de puissance d'un projet lauréat si aucune demande n'est en cours
        Quand la DREAL associée au projet accorde le changement de puissance pour le projet lauréat
        Alors l'utilisateur DREAL devrait être informé que "Aucune demande de changement de puissance n'est en cours"

    Scénario: Impossible d'accorder le changement de puissance d'un projet lauréat si la demande a déjà été accordée
        Quand la DREAL associée au projet accorde le changement de puissance pour le projet lauréat
        Alors l'utilisateur DREAL devrait être informé que "Aucune demande de changement de puissance n'est en cours"

    Scénario: Impossible d'accorder le changement de puissance d'un projet lauréat si la demande a déjà été annulée
        Etant donné une demande de changement de puissance annulée pour le projet lauréat
            | ratio puissance | 0.75 |
        Quand la DREAL associée au projet accorde le changement de puissance pour le projet lauréat
        Alors l'utilisateur DREAL devrait être informé que "Aucune demande de changement de puissance n'est en cours"

    Scénario: Impossible d'accorder le changement de puissance d'un projet lauréat si la demande a déjà été rejetée
        Etant donné une demande de changement de puissance rejetée pour le projet lauréat
            | ratio puissance | 0.75 |
        Quand la DREAL associée au projet accorde le changement de puissance pour le projet lauréat
        Alors l'utilisateur DREAL devrait être informé que "Aucune demande de changement de puissance n'est en cours"
