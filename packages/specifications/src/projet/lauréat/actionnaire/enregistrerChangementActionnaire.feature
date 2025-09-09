# language: fr
@actionnaire
Fonctionnalité: Enregistrer un changement d'actionnaire d'un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offre | PPE2 - Bâtiment |
        Et la dreal "DREAL" associée à la région du projet
        Et un cahier des charges permettant la modification du projet

    Scénario: Enregistrer un changement d'actionnaire d'un projet lauréat
        Quand le porteur enregistre un changement d'actionnaire pour le projet lauréat
        Alors l'actionnaire du projet lauréat devrait être mis à jour
        Et le changement enregistré de l'actionnaire devrait être consultable
        Et un email a été envoyé à la dreal avec :
            | sujet      | Potentiel - Enregistrement d'un changement d'actionnaire pour le projet Du boulodrome de Marseille dans le département(.*) |
            | nom_projet | Du boulodrome de Marseille                                                                                                 |
            | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                                      |
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - Enregistrement d'un changement d'actionnaire pour le projet Du boulodrome de Marseille dans le département(.*) |
            | nom_projet | Du boulodrome de Marseille                                                                                                 |
            | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                                      |

    Scénario: Enregistrer un changement d'actionnaire avec une valeur identique
        Quand le porteur enregistre un changement d'actionnaire avec la même valeur pour le projet lauréat
        Alors le changement enregistré de l'actionnaire devrait être consultable

    Scénario: Impossible d'enregistrer un changement d'actionnaire si l'AO ne le permet pas
        Etant donné le projet lauréat "Du boulodrome de Lyon" avec :
            | appel d'offre | PPE2 - Petit PV Bâtiment |
            | période       | 1                        |
        Quand le porteur enregistre un changement d'actionnaire pour le projet lauréat
        Alors le porteur devrait être informé que "Le cahier des charges de ce projet ne permet pas ce changement"

    Scénario: Impossible d'enregistrer un changement d'actionnaire si l'actionnaire est inexistant
        Etant donné le projet éliminé "Du boulodrome de Lyon"
        Quand le porteur enregistre un changement d'actionnaire pour le projet éliminé
        Alors l'utilisateur devrait être informé que "Le projet lauréat n'existe pas"

    Scénario: Impossible pour le porteur de modifier l'actionnaire d'un projet lauréat abandonné
        Etant donné un abandon accordé pour le projet lauréat
        Quand le porteur enregistre un changement d'actionnaire pour le projet lauréat
        Alors le porteur devrait être informé que "Impossible de faire un changement pour un projet abandonné"

    Scénario: Impossible pour le porteur de modifier l'actionnaire si une demande d'abandon est en cours
        Etant donné une demande d'abandon en cours pour le projet lauréat
        Quand le porteur enregistre un changement d'actionnaire pour le projet lauréat
        Alors le porteur devrait être informé que "Impossible de faire un changement car une demande d'abandon est en cours pour le projet"

    Scénario: Impossible pour le porteur de modifier l'actionnaire d'un projet achevé
        Etant donné une attestation de conformité transmise pour le projet lauréat
        Quand le porteur enregistre un changement d'actionnaire pour le projet lauréat
        Alors le porteur devrait être informé que "Impossible de faire un changement pour un projet achevé"

    Scénario: Impossible pour le porteur de modifier l'actionnaire d'un projet "Eolien" si l'actionnariat est 'investissement-participatif'
        Etant donné le projet lauréat "Du bouchon de Lyon le retour" avec :
            | appel d'offre | Eolien                      |
            | période       | 6                           |
            | actionnariat  | investissement-participatif |
        Quand le porteur enregistre un changement d'actionnaire pour le projet lauréat
        Alors le porteur devrait être informé que "L'instruction de la demande de changement est obligatoire dans ces conditions"

    Scénario: Impossible pour le porteur d'enregistrer un changement d'actionnaire d'un projet "Eolien" si l'actionnariat est 'financement-participatif'
        Etant donné le projet lauréat "Du bouchon de Lyon" avec :
            | appel d'offre | Eolien                   |
            | période       | 6                        |
            | actionnariat  | financement-participatif |
        Quand le porteur enregistre un changement d'actionnaire pour le projet lauréat
        Alors le porteur devrait être informé que "L'instruction de la demande de changement est obligatoire dans ces conditions"

    Scénario: Impossible pour le porteur d'enregistrer un changement d'actionnaire d'un projet "Eolien" si il n'y a pas de GFs en cours
        Etant donné le projet lauréat legacy "Du bouchon de Lyon" avec :
            | appel d'offre | Eolien |
            | période       | 5      |
            | actionnariat  |        |
            | type GF       |        |
        Quand le porteur enregistre un changement d'actionnaire pour le projet lauréat
        Alors le porteur devrait être informé que "L'instruction de la demande de changement est obligatoire dans ces conditions"

    Scénario: Impossible pour le porteur d'enregistrer un changement d'actionnaire d'un projet "Eolien" si il y a un dépot de GFs en cours
        Etant donné le projet lauréat "Du bouchon de Lyon" avec :
            | appel d'offre | Eolien |
            | période       | 6      |
            | actionnariat  |        |
        Et un dépôt de garanties financières
        Quand le porteur enregistre un changement d'actionnaire pour le projet lauréat
        Alors le porteur devrait être informé que "L'instruction de la demande de changement est obligatoire dans ces conditions"

    Scénario: Impossible pour le porteur d'enregistrer un changement d'actionnaire d'un projet "Eolien" si il y a déjà une demande en cours
        Etant donné le projet lauréat legacy "Du bouchon de Nîmes" avec :
            | appel d'offre | Eolien |
            | période       | 5      |
            | actionnariat  |        |
            | type GF       |        |
        Et une demande de changement d'actionnaire en cours pour le projet lauréat
        Et des garanties financières actuelles pour le projet "Du bouchon de Nîmes"
        Quand le porteur enregistre un changement d'actionnaire pour le projet lauréat
        Alors le porteur devrait être informé que "Une demande de changement est déjà en cours"

    Scénario: Impossible d'enregistrer le changement d'actionnaire d'un projet lauréat ayant un cahier des charges qui ne le permet pas
        Etant donné le projet lauréat legacy "Du bouchon lyonnais" avec :
            | appel d'offre | CRE4 - Sol |
            | période       | 1          |
        Quand le porteur enregistre un changement d'actionnaire pour le projet lauréat
        Alors le porteur devrait être informé que "Le cahier des charges de ce projet ne permet pas ce changement"
