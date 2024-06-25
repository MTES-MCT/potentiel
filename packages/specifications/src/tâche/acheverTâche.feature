# language: fr
Fonctionnalité: Achever une tâche

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et le porteur pour le projet lauréat "Du boulodrome de Marseille"
            | email | porteur@test.test   |
            | nom   | Porteur Projet Test |
            | role  | porteur-projet      |

    Scénario: Une tâche est achevée quand la preuve de recandidature est transmise
        Etant donné le projet éliminé "MIOS"
        Et un abandon accordé avec recandidature pour le projet lauréat "Du boulodrome de Marseille"
        Quand le porteur transmet le projet éliminé "MIOS" comme preuve de recandidature suite à l'abandon du projet "Du boulodrome de Marseille" avec :
            | La date de notification du projet | 2024-01-01 |
        Alors une tâche indiquant de "transmettre la preuve de recandidature" n'est plus consultable dans la liste des tâches du porteur pour le projet

    Scénario: Une tâche est achevée lorsqu'un abandon est confirmé
        Etant donné une confirmation d'abandon demandée pour le projet lauréat "Du boulodrome de Marseille"
        Quand le porteur confirme l'abandon pour le projet lauréat "Du boulodrome de Marseille"
        Alors une tâche indiquant de "confirmer un abandon" n'est plus consultable dans la liste des tâches du porteur pour le projet

    Scénario: Une tâche est achevée lorsqu'un dépot de garanties financières est soumis pour un projet en attente de garanties financières
        Etant donné des garanties financières en attente pour le projet "Du boulodrome de Marseille" avec :
            | date limite de soumission | 2023-11-01    |
            | date de notification      | 2023-09-01    |
            | motif                     | motif-inconnu |
        Quand le porteur soumet des garanties financières pour le projet "Du boulodrome de Marseille" avec :
            | type                 | consignation          |
            | format               | application/pdf       |
            | contenu fichier      | le contenu du fichier |
            | date de constitution | 2023-06-01            |
            | date de soumission   | 2023-10-01            |
            | soumis par           | porteur@test.test     |
        Alors une tâche indiquant de "transmettre les garanties financières" n'est plus consultable dans la liste des tâches du porteur pour le projet

    Scénario: Une tâche est achevée lorsque les garanties financières sont enregistrées pour un projet en attente de garanties financières
        Etant donné des garanties financières en attente pour le projet "Du boulodrome de Marseille" avec :
            | date limite de soumission | 2023-11-01    |
            | date de notification      | 2023-09-01    |
            | motif                     | motif-inconnu |
        Quand un admin enregistre les garanties financières validées pour le projet "Du boulodrome de Marseille" avec :
            | type                 | consignation    |
            | format               | application/pdf |
            | contenu fichier      | contenu fichier |
            | date de constitution | 2023-06-12      |
            | date mise à jour     | 2024-03-01      |
        Alors une tâche indiquant de "transmettre les garanties financières" n'est plus consultable dans la liste des tâches du porteur pour le projet
