# language: fr
@tâche
Fonctionnalité: Achever une tâche

    Contexte:
        Etant donné le projet lauréat sans garanties financières importées "Du boulodrome de Marseille"
        Et la dreal "Dreal du sud" associée à la région du projet

    Scénario: Une tâche est achevée lorsqu'un dépot de garanties financières est soumis pour un projet en attente de garanties financières
        Etant donné des garanties financières en attente pour le projet lauréat
        Quand un porteur soumet un dépôt de garanties financières pour le projet lauréat avec :
            | type GF              | consignation          |
            | format               | application/pdf       |
            | contenu fichier      | le contenu du fichier |
            | date de constitution | 2023-06-01            |
            | date de soumission   | 2023-10-01            |
            | soumis par           | porteur@test.test     |
        Alors une tâche indiquant de "transmettre les garanties financières" n'est plus consultable dans la liste des tâches du porteur pour le projet

    Scénario: Une tâche est achevée lorsque les garanties financières sont enregistrées pour un projet en attente de garanties financières
        Etant donné des garanties financières en attente pour le projet lauréat
        Quand la DREAL enregistre les garanties financières actuelles pour le projet lauréat
        Alors une tâche indiquant de "transmettre les garanties financières" n'est plus consultable dans la liste des tâches du porteur pour le projet
