# language: fr
@garanties-financières
@dépôt-garanties-financières
Fonctionnalité: Supprimer un dépôt de garanties financières

    Contexte:
        Etant donné le projet lauréat sans garanties financières importées "Du boulodrome de Marseille"

    Plan du Scénario: Un porteur supprime un dépôt de garanties financières avec une date limite de soumission
        Etant donné des garanties financières en attente pour le projet lauréat
        Et un dépôt de garanties financières pour le projet "Du boulodrome de Marseille" avec :
            | type GF              | <type GF>              |
            | date d'échéance      | <date d'échéance>      |
            | format               | <format du fichier>    |
            | contenu fichier      | <contenu du fichier>   |
            | date de constitution | <date de constitution> |
            | date de soumission   | 2023-10-01             |
            | soumis par           | porteur@test.test      |
        Quand le porteur supprime le dépôt de garanties financières du projet
        Alors il ne devrait pas y avoir de dépôt de garanties financières pour le projet
        Et des garanties financières devraient être attendues pour le projet lauréat

        Exemples:
            | type GF                   | date d'échéance | format du fichier | contenu du fichier    | date de constitution | motif                                    |
            | avec-date-échéance        | 2027-12-01      | application/pdf   | le contenu du fichier | 2023-06-01           | motif-inconnu                            |
            | consignation              |                 | application/pdf   | le contenu du fichier | 2023-06-01           | recours-accordé                          |
            | six-mois-après-achèvement |                 | application/pdf   | le contenu du fichier | 2023-06-01           | changement-producteur                    |
            | consignation              |                 | application/pdf   | le contenu du fichier | 2023-06-01           | échéance-garanties-financières-actuelles |

    Plan du Scénario: Un porteur supprime des garanties financières sans une date limite de soumission après les avoir soumises
        Etant donné un dépôt de garanties financières pour le projet "Du boulodrome de Marseille" avec :
            | type GF              | <type GF>              |
            | date d'échéance      | <date d'échéance>      |
            | format               | <format du fichier>    |
            | contenu fichier      | <contenu du fichier>   |
            | date de constitution | <date de constitution> |
            | date de soumission   | 2023-10-01             |
            | soumis par           | porteur@test.test      |
        Quand le porteur supprime le dépôt de garanties financières du projet
        Alors il ne devrait pas y avoir de dépôt de garanties financières pour le projet

        Exemples:
            | type GF                   | date d'échéance | format du fichier | contenu du fichier    | date de constitution |
            | avec-date-échéance        | 2027-12-01      | application/pdf   | le contenu du fichier | 2023-06-01           |
            | consignation              |                 | application/pdf   | le contenu du fichier | 2023-06-01           |
            | six-mois-après-achèvement |                 | application/pdf   | le contenu du fichier | 2023-06-01           |

    Scénario: Une tâche du type "échoir les garanties financières" est planifiée quand le porteur supprime un dépôt et que le projet dispose de garanties financières actuelles avec date d'échéance
        Etant donné des garanties financières actuelles pour le projet "Du boulodrome de Marseille" avec :
            | type GF            | avec-date-échéance |
            | date d'échéance    | 2024-12-01         |
            | date de validation | 2024-11-24         |
        Et un dépôt de garanties financières pour le projet "Du boulodrome de Marseille"
        Quand le porteur supprime le dépôt de garanties financières du projet
        Alors une tâche "échoir les garanties financières" est planifiée à la date du "2024-12-02" pour le projet "Du boulodrome de Marseille"

    Scénario: Une tâche du type "rappel échéance garanties financières à deux mois" est planifiée quand le porteur supprime un dépôt et que le projet ne dispose pas de garanties financières actuelles
        Etant donné des garanties financières en attente pour le projet lauréat
        Et un dépôt de garanties financières pour le projet "Du boulodrome de Marseille"
        Quand le porteur supprime le dépôt de garanties financières du projet
        Alors une tâche "échoir les garanties financières" est planifiée à la date du "2024-12-02" pour le projet "Du boulodrome de Marseille"

    Scénario: Des tâches de la catégorie "rappel échéance garanties financières" sont planifiées à M-1 et M-2 de la date d'échéance quand le porteur supprime un dépôt et que le projet dispose de garanties financières actuelles avec date d'échéance
        Etant donné des garanties financières actuelles pour le projet "Du boulodrome de Marseille" avec :
            | type GF            | avec-date-échéance |
            | date d'échéance    | 2024-10-01         |
            | date de validation | 2024-11-24         |
        Et un dépôt de garanties financières pour le projet "Du boulodrome de Marseille"
        Quand le porteur supprime le dépôt de garanties financières du projet
        Alors une tâche "rappel échéance garanties financières à un mois" est planifiée à la date du "2024-09-01" pour le projet "Du boulodrome de Marseille"
        Et une tâche "rappel échéance garanties financières à deux mois" est planifiée à la date du "2024-08-01" pour le projet "Du boulodrome de Marseille"

    Scénario: Une tâche du type "échoir les garanties financières" n'est pas planifiée quand le porteur supprime un dépôt et que le projet ne dispose pas de garanties financières actuelles avec date d'échéance
        Etant donné un dépôt de garanties financières pour le projet "Du boulodrome de Marseille"
        Quand le porteur supprime le dépôt de garanties financières du projet
        Alors une tâche "échoir les garanties financières" n'est plus planifiée pour le projet lauréat

    Scénario: Impossible de supprimer des garanties financières en attente de validation s'il n'y a pas de dépôt de garanties financières
        Etant donné des garanties financières en attente pour le projet lauréat
        Quand le porteur supprime le dépôt de garanties financières du projet
        Alors l'utilisateur devrait être informé que "Il n'y a aucun dépôt de garanties financières en cours pour ce projet"
