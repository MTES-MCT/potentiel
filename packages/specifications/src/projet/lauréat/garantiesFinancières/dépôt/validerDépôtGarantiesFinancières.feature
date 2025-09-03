# language: fr
@garanties-financières
@dépôt-garanties-financières
Fonctionnalité: Valider un dépôt de garanties financières

    Contexte:
        Etant donné le projet lauréat sans garanties financières importées "Du boulodrome de Marseille"
        Et la dreal "Dreal du sud" associée à la région du projet

    Plan du Scénario: Valider un dépôt de garanties financières
        Etant donné des garanties financières en attente pour le projet lauréat
        Et un dépôt de garanties financières pour le projet "Du boulodrome de Marseille" avec :
            | type GF         | <type GF>         |
            | date d'échéance | <date d'échéance> |
        Quand l'utilisateur dreal valide un dépôt de garanties financières pour le projet lauréat
        Alors les garanties financières actuelles devraient être consultables pour le projet lauréat
        Et il ne devrait pas y avoir de dépôt de garanties financières pour le projet

        Exemples:
            | type GF                   | date d'échéance |
            | avec-date-échéance        | 2027-12-01      |
            | consignation              |                 |
            | six-mois-après-achèvement |                 |

    Scénario: Valider un dépôt de garanties financières pour un projet ayant déjà des garanties financières actuelles avec un statut validé
        Etant donné des garanties financières actuelles pour le projet "Du boulodrome de Marseille"
        Et un dépôt de garanties financières pour le projet "Du boulodrome de Marseille"
        Quand l'utilisateur dreal valide un dépôt de garanties financières pour le projet lauréat
        Alors les garanties financières actuelles devraient être consultables pour le projet lauréat
        Et un historique des garanties financières devrait être consultable pour le projet lauréat avec :
            | raison | modification des garanties financières |

    Scénario: Valider un dépôt de garanties financières pour un projet ayant déjà des garanties financières actuelles avec un statut échu
        Etant donné des garanties financières actuelles échues le "2024-07-17" pour le projet lauréat
        Et un dépôt de garanties financières pour le projet "Du boulodrome de Marseille"
        Quand l'utilisateur dreal valide un dépôt de garanties financières pour le projet lauréat
        Alors les garanties financières actuelles devraient être consultables pour le projet lauréat
        Et un historique des garanties financières devrait être consultable pour le projet lauréat avec :
            | type GF         | avec-date-échéance                              |
            | date d'échéance | 2024-07-17                                      |
            | statut          | échu                                            |
            | raison          | renouvellement des garanties financières échues |

    Scénario: Une tâche du type "échoir les garanties financières" est planifiée quand des garanties financières avec date d'échéance sont créées
        Etant donné un dépôt de garanties financières pour le projet "Du boulodrome de Marseille" avec :
            | type GF         | avec-date-échéance |
            | date d'échéance | 2050-12-01         |
        Quand l'utilisateur dreal valide un dépôt de garanties financières pour le projet lauréat
        Alors une tâche "échoir les garanties financières" est planifiée à la date du "2050-12-02" pour le projet lauréat

    Scénario: Les nouvelles garanties financières sont échues si le dépôt de garanties financières avec date d'échéance est échu
        Etant donné un dépôt de garanties financières pour le projet "Du boulodrome de Marseille" avec :
            | type GF         | avec-date-échéance |
            | date d'échéance | 2024-12-01         |
        Quand l'utilisateur dreal valide un dépôt de garanties financières pour le projet lauréat
        Alors les garanties financières actuelles du projet sont échues
        Et une tâche "échoir les garanties financières" n'est plus planifiée pour le projet lauréat
        Et des garanties financières devraient être attendues pour le projet lauréat avec :
            | motif | échéance-garanties-financières-actuelles |

    Scénario: Des tâches de la catégorie "rappel échéance garanties financières" sont planifiées à M-1 et M-2 de la date d'échéance en cas de dépôt validé
        Etant donné un dépôt de garanties financières pour le projet "Du boulodrome de Marseille" avec :
            | type GF         | avec-date-échéance |
            | date d'échéance | 2050-10-01         |
        Quand l'utilisateur dreal valide un dépôt de garanties financières pour le projet lauréat
        Alors une tâche "rappel échéance garanties financières à un mois" est planifiée à la date du "2050-09-01" pour le projet lauréat
        Et une tâche "rappel échéance garanties financières à deux mois" est planifiée à la date du "2050-08-01" pour le projet lauréat

    Scénario: Impossible de valider un dépôt de garanties financières si aucune dépôt n'est trouvé
        Etant donné des garanties financières en attente pour le projet lauréat
        Quand l'utilisateur dreal valide un dépôt de garanties financières pour le projet lauréat
        Alors l'utilisateur devrait être informé que "Il n'y a aucun dépôt de garanties financières en cours pour ce projet"
