# language: fr
Fonctionnalité: Achever une tâche

    Contexte:
        Etant donné le projet lauréat sans garanties financières importées "Du boulodrome de Marseille"

    Scénario: Une tâche est achevée lorsqu'un dépot de garanties financières est soumis pour un projet en attente de garanties financières
        Etant donné des garanties financières en attente pour le projet lauréat
        Quand un porteur soumet un dépôt de garanties financières pour le projet "Du boulodrome de Marseille" avec :
            | type GF              | consignation          |
            | format               | application/pdf       |
            | contenu fichier      | le contenu du fichier |
            | date de constitution | 2023-06-01            |
            | date de soumission   | 2023-10-01            |
            | soumis par           | porteur@test.test     |
        Alors une tâche indiquant de "transmettre les garanties financières" n'est plus consultable dans la liste des tâches du porteur pour le projet

    Scénario: Une tâche est achevée lorsque les garanties financières sont enregistrées pour un projet en attente de garanties financières
        Etant donné des garanties financières en attente pour le projet lauréat
        Quand un porteur enregistre les garanties financières actuelles pour le projet "Du boulodrome de Marseille" avec :
            | type GF              | consignation    |
            | format               | application/pdf |
            | contenu fichier      | contenu fichier |
            | date de constitution | 2023-06-12      |
            | date mise à jour     | 2024-03-01      |
            | enregistré par       | admin@test.test |
        Alors une tâche indiquant de "transmettre les garanties financières" n'est plus consultable dans la liste des tâches du porteur pour le projet
