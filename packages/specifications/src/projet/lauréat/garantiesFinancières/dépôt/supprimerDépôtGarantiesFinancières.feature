# language: fr
@garanties-financières
Fonctionnalité: Supprimer un dépôt de garanties financières

    Contexte:
        Etant donné le projet lauréat sans garanties financières importées "Du boulodrome de Marseille"
        Et la dreal "Dreal du sud" associée à la région du projet

    Plan du Scénario: Un porteur supprime un dépôt de garanties financières avec une date limite de soumission
        Etant donné des garanties financières en attente pour le projet lauréat
        Et un dépôt de garanties financières avec :
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
        Etant donné un dépôt de garanties financières avec :
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
        Etant donné des garanties financières actuelles pour le projet lauréat avec :
            | type GF            | avec-date-échéance |
            | date d'échéance    | 2050-12-01         |
            | date de validation | 2024-11-24         |
        Et un dépôt de garanties financières
        Quand le porteur supprime le dépôt de garanties financières du projet
        Alors une tâche "échoir les garanties financières" est planifiée à la date du "2050-12-02" pour le projet lauréat

    Scénario: Une tâche du type "rappel des garanties financières à transmettre" est planifiée quand le porteur supprime un dépôt et que le projet ne dispose pas de garanties financières actuelles
        Etant donné des garanties financières en attente pour le projet lauréat
        Et un dépôt de garanties financières
        Quand le porteur supprime le dépôt de garanties financières du projet
        Alors une tâche "rappel des garanties financières à transmettre" est planifiée pour le projet lauréat

    Scénario: Des tâches de la catégorie "rappel échéance garanties financières" sont planifiées à M-1 et M-3 de la date d'échéance quand le porteur supprime un dépôt et que le projet dispose de garanties financières actuelles avec date d'échéance
        Etant donné des garanties financières actuelles pour le projet lauréat avec :
            | type GF            | avec-date-échéance |
            | date d'échéance    | 2050-10-01         |
            | date de validation | 2024-11-24         |
        Et un dépôt de garanties financières
        Quand le porteur supprime le dépôt de garanties financières du projet
        Alors une tâche "rappel échéance garanties financières à un mois" est planifiée à la date du "2050-09-01" pour le projet lauréat
        Et une tâche "rappel échéance garanties financières à trois mois" est planifiée à la date du "2050-07-01" pour le projet lauréat

    Scénario: Une tâche du type "échoir les garanties financières" n'est pas planifiée quand le porteur supprime un dépôt et que le projet ne dispose pas de garanties financières actuelles avec date d'échéance
        Etant donné un dépôt de garanties financières
        Quand le porteur supprime le dépôt de garanties financières du projet
        Alors il n'y a pas de tâche "échoir les garanties financières" planifiée pour le projet lauréat

    Scénario: Pour un projet achevé, aucune tâche de relance pour GF n'est planifiée si un porteur supprime un dépôt de GF
        Etant donné des garanties financières en attente pour le projet lauréat
        Et une attestation de conformité transmise pour le projet lauréat
        Et un dépôt de garanties financières
        Quand le porteur supprime le dépôt de garanties financières du projet
        Alors une tâche indiquant de 'transmettre les garanties financières' n'est plus consultable dans la liste des tâches du porteur pour le projet
        Et il n'y a pas de tâche "rappel des garanties financières à transmettre" planifiée pour le projet lauréat

    Scénario: Pour un projet achevé, les tâches "rappel échéance garanties financières" ne sont pas replanifiées quand le porteur supprime un dépôt et que le projet dispose de garanties financières actuelles avec date d'échéance
        Etant donné des garanties financières actuelles pour le projet lauréat avec :
            | type GF            | avec-date-échéance |
            | date d'échéance    | 2050-10-01         |
            | date de validation | 2024-11-24         |
        Et une attestation de conformité transmise pour le projet lauréat
        Et un dépôt de garanties financières
        Quand le porteur supprime le dépôt de garanties financières du projet
        Alors il n'y a pas de tâche "rappel échéance garanties financières à un mois" planifiée pour le projet lauréat
        Alors il n'y a pas de tâche "rappel échéance garanties financières à deux mois" planifiée pour le projet lauréat
        Alors il n'y a pas de tâche "rappel échéance garanties financières à trois mois" planifiée pour le projet lauréat

    Scénario: Impossible de supprimer des garanties financières en attente de validation s'il n'y a pas de dépôt de garanties financières
        Etant donné des garanties financières en attente pour le projet lauréat
        Quand le porteur supprime le dépôt de garanties financières du projet
        Alors l'utilisateur devrait être informé que "Il n'y a aucun dépôt de garanties financières en cours pour ce projet"
