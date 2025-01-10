# language: fr
Fonctionnalité: Demander le changement de l'actionnaire d'un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et le porteur "Marcel Patoulatchi" ayant accés au projet lauréat "Du boulodrome de Marseille"
        Et la dreal "DREAL" associée à la région du projet

    Scénario: Demander le changement de l'actionnaire d'un projet lauréat
        Quand le porteur demande le changement de l'actionnaire pour le projet lauréat
        Alors la demande de changement de l'actionnaire devrait être consultable
        Et un email a été envoyé à la dreal avec :
            | sujet      | Potentiel - Demande de changement de l'actionnaire pour le projet Du boulodrome de Marseille dans le département(.*) |
            | nom_projet | Du boulodrome de Marseille                                                                                           |
            | url        | https://potentiel.beta.gouv.fr/laureats/.*/changement/actionnaire                                                    |

    Scénario: Demander le changement de l'actionnaire d'un projet lauréat si une demande a déjà été rejetée
        Etant donné une demande de changement d'actionnaire rejetée pour le projet lauréat
        Quand le porteur demande le changement de l'actionnaire pour le projet lauréat
        Alors la nouvelle demande de changement de l'actionnaire devrait être consultable
        Et un email a été envoyé à la dreal avec :
            | sujet      | Potentiel - Demande de changement de l'actionnaire pour le projet Du boulodrome de Marseille dans le département(.*) |
            | nom_projet | Du boulodrome de Marseille                                                                                           |
            | url        | https://potentiel.beta.gouv.fr/laureats/.*/changement/actionnaire                                                    |

    Scénario: Demander le changement de l'actionnaire d'un projet lauréat si une demande a déjà été annulée
        Etant donné une demande de changement d'actionnaire annulée pour le projet lauréat
        Quand le porteur demande le changement de l'actionnaire pour le projet lauréat
        Alors la nouvelle demande de changement de l'actionnaire devrait être consultable
        Et un email a été envoyé à la dreal avec :
            | sujet      | Potentiel - Demande de changement de l'actionnaire pour le projet Du boulodrome de Marseille dans le département(.*) |
            | nom_projet | Du boulodrome de Marseille                                                                                           |
            | url        | https://potentiel.beta.gouv.fr/laureats/.*/changement/actionnaire                                                    |

    Scénario: Demander le changement de l'actionnaire d'un projet lauréat si une demande a déjà été accordée
        Etant donné une demande de changement d'actionnaire accordée pour le projet lauréat
        Quand le porteur demande le changement de l'actionnaire pour le projet lauréat
        Alors la nouvelle demande de changement de l'actionnaire devrait être consultable
        Et un email a été envoyé à la dreal avec :
            | sujet      | Potentiel - Demande de changement de l'actionnaire pour le projet Du boulodrome de Marseille dans le département(.*) |
            | nom_projet | Du boulodrome de Marseille                                                                                           |
            | url        | https://potentiel.beta.gouv.fr/laureats/.*/changement/actionnaire                                                    |

    Scénario: Demander le changement de l'actionnaire d'un projet lauréat si l'actionnaire a une valeur identique
        Quand le porteur demande le changement de l'actionnaire avec la même valeur pour le projet lauréat
        Alors la nouvelle demande de changement de l'actionnaire devrait être consultable

    Scénario: Impossible de demander le changement de l'actionnaire si l'actionnaire est inexistant
        Etant donné le projet éliminé "Du boulodrome de Lyon"
        Quand le porteur demande le changement de l'actionnaire pour le projet éliminé
        Alors l'utilisateur devrait être informé que "L'actionnaire n'existe pas"

    Scénario: Impossible de demander le changement de l'actionnaire si une demande existe déjà
        Etant donné une demande de changement d'actionnaire en cours pour le projet lauréat
        Quand le porteur demande le changement de l'actionnaire pour le projet lauréat
        Alors l'utilisateur devrait être informé que "Une demande de changement est déjà en cours"

    Scénario: Impossible de demander le changement de l'actionnaire d'un projet lauréat abandonné
        Etant donné un abandon accordé pour le projet lauréat
        Quand le porteur demande le changement de l'actionnaire pour le projet lauréat
        Alors le porteur devrait être informé que "Impossible de demander le changement d'actionnaire pour un projet abandonné"

    Scénario: Impossible de demander le changement d'actionnaire si une demande d'abandon est en cours
        Etant donné une demande d'abandon en cours pour le projet lauréat
        Quand le porteur demande le changement de l'actionnaire pour le projet lauréat
        Alors le porteur devrait être informé que "Impossible de demander le changement d'actionnaire car une demande d'abandon est en cours pour le projet"

    Scénario: Impossible de demander le changement de l'actionnaire d'un projet achevé
        Etant donné une attestation de conformité transmise pour le projet "Du boulodrome de Marseille"
        Quand le porteur demande le changement de l'actionnaire pour le projet lauréat
        Alors le porteur devrait être informé que "Impossible de demander le changement d'actionnaire pour un projet achevé"
