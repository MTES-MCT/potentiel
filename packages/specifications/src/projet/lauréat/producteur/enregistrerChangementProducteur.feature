# language: fr
@producteur
Fonctionnalité: Enregistrer un changement de producteur d'un projet lauréat

    Scénario: Enregistrer un changement de producteur d'un projet lauréat
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offres | PPE2 - Bâtiment |
        Et la dreal "Dreal du sud" associée à la région du projet
        Et un dépôt de garanties financières avec :
            | type GF | consignation |
        Quand le porteur enregistre un changement de producteur pour le projet lauréat
        Alors le producteur du projet lauréat devrait être mis à jour
        Et le changement enregistré du producteur du projet lauréat devrait être consultable
        Et le porteur ne doit plus avoir accès au projet lauréat
        Et le projet lauréat est consultable dans la liste des projets à réclamer
        Et il ne devrait pas y avoir de dépôt de garanties financières pour le projet
        Et les garanties financières actuelles ne devraient pas être consultables pour le projet lauréat
        Et un historique des garanties financières devrait être consultable pour le projet lauréat avec :
            | raison          | changement de producteur |
            | type GF         | avec-date-échéance       |
            | date d'échéance | 2024-08-01               |
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - Révocation de vos accès pour le projet Du boulodrome de Marseille |
            | nom_projet | Du boulodrome de Marseille                                                    |
            | cause      | Cela fait suite à un changement de producteur déclaré sur Potentiel.          |
        Et un email a été envoyé à la dreal avec :
            | sujet      | Potentiel - Déclaration de changement de producteur pour le projet Du boulodrome de Marseille dans le département(.*) |
            | nom_projet | Du boulodrome de Marseille                                                                                            |
            | url        | https://potentiel.beta.gouv.fr/laureats/.*/producteur/changement/.*                                                   |
        Et une tâche "rappel des garanties financières à transmettre" est planifiée pour le projet lauréat

    Scénario: Enregistrer un changement de producteur d'un projet lauréat pour un projet avec GF avec date d'échéance
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offres  | PPE2 - Bâtiment    |
            | type GF         | avec-date-échéance |
            | date d'échéance | 2050-01-01         |
        Quand le porteur enregistre un changement de producteur pour le projet lauréat
        Et une tâche "échoir les garanties financières" n'est plus planifiée pour le projet lauréat

    Scénario: Enregistrer un changement de producteur d'un projet lauréat dont le cahier des charges initial ne le permet pas, suite à un choix de cahier des charges modificatif
        Etant donné le projet lauréat legacy "Du bouchon lyonnais" avec :
            | appel d'offres | CRE4 - Sol |
            | période        | 1          |
        Et un cahier des charges permettant la modification du projet
        Et la dreal "Dreal du sud" associée à la région du projet
        Quand le porteur enregistre un changement de producteur pour le projet lauréat
        Alors le producteur du projet lauréat devrait être mis à jour

    Scénario: Impossible d'enregistrer un changement de producteur d'un projet lauréat avec un producteur identique
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offres | PPE2 - Bâtiment |
            | période        | 1               |
        Quand le porteur enregistre un changement de producteur avec une valeur identique pour le projet lauréat
        Alors le porteur devrait être informé que "Le nouveau producteur est identique à celui associé au projet"

    Scénario: Impossible d'enregistrer un changement de producteur d'un projet lauréat abandonné
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offres | PPE2 - Bâtiment |
            | période        | 1               |
        Et un abandon accordé pour le projet lauréat
        Quand le porteur enregistre un changement de producteur pour le projet lauréat
        Alors le porteur devrait être informé que "Impossible de faire un changement pour un projet abandonné"

    Scénario: Impossible de faire un changement d'un projet lauréat si une demande d'abandon est en cours
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offres | PPE2 - Bâtiment |
            | période        | 1               |
        Et une demande d'abandon en cours pour le projet lauréat
        Quand le porteur enregistre un changement de producteur pour le projet lauréat
        Alors le porteur devrait être informé que "Impossible de faire un changement car une demande d'abandon est en cours pour le projet"

    Scénario: Impossible d'enregistrer le changement de producteur d'un projet achevé
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offres | PPE2 - Bâtiment |
            | période        | 1               |
        Et une attestation de conformité transmise pour le projet lauréat
        Quand le porteur enregistre un changement de producteur pour le projet lauréat
        Alors le porteur devrait être informé que "Impossible de faire un changement pour un projet achevé"

    Scénario: Impossible d'enregistrer le changement de producteur d'un projet lauréat si le cahier des charges ne le permet pas
        Etant donné le projet lauréat legacy "Du bouchon lyonnais" avec :
            | appel d'offres | <Appel d'offre> |
            | période        | <Période>       |
        Quand le porteur enregistre un changement de producteur pour le projet lauréat
        Alors le porteur devrait être informé que "Le cahier des charges de ce projet ne permet pas ce changement"

        Exemples:
            | Appel d'offre | Période |
            | Eolien        | 1       |
            | CRE4 - Sol    | 1       |
