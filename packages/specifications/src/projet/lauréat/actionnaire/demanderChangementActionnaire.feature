# language: fr
@actionnaire
Fonctionnalité: Demander le changement de l'actionnaire d'un projet lauréat CRE4 Eolien

    Contexte:
        Etant donné le projet lauréat legacy "Du boulodrome de Marseille" avec :
            | appel d'offre | Eolien |
            | type GF       |        |
        Et la dreal "DREAL" associée à la région du projet
        Et un cahier des charges permettant la modification du projet

    Scénario: Demander le changement de l'actionnaire d'un projet CRE4 Eolien sans garanties financières constituées
        Quand le porteur demande le changement de l'actionnaire pour le projet lauréat
        Alors la demande de changement de l'actionnaire devrait être consultable
        Et un email a été envoyé à la dreal avec :
            | sujet      | Potentiel - Demande de changement de l'actionnaire pour le projet Du boulodrome de Marseille dans le département(.*) |
            | nom_projet | Du boulodrome de Marseille                                                                                           |
            | url        | https://potentiel.beta.gouv.fr/laureats/.*/actionnaire                                                               |

    Scénario: Demander le changement de l'actionnaire d'un projet lauréat legacy (CRE4 Eolien) avec un dépot de garanties financières en cours
        Etant donné le projet lauréat legacy "Du boulodrome de Bordeaux" avec :
            | appel d'offre | Eolien |
        Et la dreal "DREAL" associée à la région du projet
        Et un dépôt de garanties financières
        Quand le porteur demande le changement de l'actionnaire pour le projet lauréat
        Alors la demande de changement de l'actionnaire devrait être consultable
        Et un email a été envoyé à la dreal avec :
            | sujet      | Potentiel - Demande de changement de l'actionnaire pour le projet Du boulodrome de Bordeaux dans le département(.*) |
            | nom_projet | Du boulodrome de Bordeaux                                                                                           |
            | url        | https://potentiel.beta.gouv.fr/laureats/.*/actionnaire                                                              |

    Scénario: Demander le changement de l'actionnaire d'un projet CRE4 Eolien ayant comme actionnariat "financement-participatif"
        Etant donné le projet lauréat legacy "Du boulodrome de Bordeaux" avec :
            | appel d'offre | Eolien                   |
            | actionnariat  | financement-participatif |
        Et la dreal "DREAL" associée à la région du projet
        Quand le porteur demande le changement de l'actionnaire pour le projet lauréat
        Alors la demande de changement de l'actionnaire devrait être consultable
        Et un email a été envoyé à la dreal avec :
            | sujet      | Potentiel - Demande de changement de l'actionnaire pour le projet Du boulodrome de Bordeaux dans le département(.*) |
            | nom_projet | Du boulodrome de Bordeaux                                                                                           |
            | url        | https://potentiel.beta.gouv.fr/laureats/.*/actionnaire                                                              |

    Scénario: Demander le changement de l'actionnaire d'un projet CRE4 Eolien ayant comme actionnariat "investissement-participatif"
        Etant donné le projet lauréat legacy "Du boulodrome de Bordeaux" avec :
            | appel d'offre | Eolien                      |
            | actionnariat  | investissement-participatif |
        Et la dreal "DREAL" associée à la région du projet
        Quand le porteur demande le changement de l'actionnaire pour le projet lauréat
        Alors la demande de changement de l'actionnaire devrait être consultable
        Et un email a été envoyé à la dreal avec :
            | sujet      | Potentiel - Demande de changement de l'actionnaire pour le projet Du boulodrome de Bordeaux dans le département(.*) |
            | nom_projet | Du boulodrome de Bordeaux                                                                                           |
            | url        | https://potentiel.beta.gouv.fr/laureats/.*/actionnaire                                                              |

    Scénario: Demander le changement de l'actionnaire d'un projet lauréat legacy (CRE4 Eolien) si l'actionnaire a une valeur identique
        Quand le porteur demande le changement de l'actionnaire avec la même valeur pour le projet lauréat
        Alors la demande de changement de l'actionnaire devrait être consultable

    Scénario: Impossible de demander le changement de l'actionnaire si l'actionnaire est inexistant
        Etant donné le projet éliminé "Du boulodrome de Lyon"
        Quand le porteur demande le changement de l'actionnaire pour le projet éliminé
        Alors l'utilisateur devrait être informé que "Le projet lauréat n'existe pas"

    Scénario: Impossible de demander le changement de l'actionnaire si une demande existe déjà
        Etant donné une demande de changement d'actionnaire en cours pour le projet lauréat
        Quand le porteur demande le changement de l'actionnaire pour le projet lauréat
        Alors l'utilisateur devrait être informé que "Une demande de changement est déjà en cours"

    Scénario: Impossible de demander le changement de l'actionnaire d'un projet lauréat abandonné
        Etant donné un abandon accordé pour le projet lauréat
        Quand le porteur demande le changement de l'actionnaire pour le projet lauréat
        Alors le porteur devrait être informé que "Impossible de faire un changement pour un projet abandonné"

    Scénario: Impossible de demander le changement d'actionnaire si une demande d'abandon est en cours
        Etant donné une demande d'abandon en cours pour le projet lauréat
        Quand le porteur demande le changement de l'actionnaire pour le projet lauréat
        Alors le porteur devrait être informé que "Impossible de faire un changement car une demande d'abandon est en cours pour le projet"

    Scénario: Impossible de demander le changement de l'actionnaire d'un projet achevé
        Etant donné une attestation de conformité transmise pour le projet lauréat
        Quand le porteur demande le changement de l'actionnaire pour le projet lauréat
        Alors le porteur devrait être informé que "Impossible de faire un changement pour un projet achevé"

    Scénario: Impossible de demander le changement d'actionnaire d'un projet lauréat ayant un cahier des charges qui ne le permet pas
        Etant donné le projet lauréat legacy "Du bouchon lyonnais" avec :
            | appel d'offre | CRE4 - Sol |
            | période       | 1          |
            | type GF       |            |
        Quand le porteur demande le changement de l'actionnaire pour le projet lauréat
        Alors le porteur devrait être informé que "Le cahier des charges de ce projet ne permet pas ce changement"
