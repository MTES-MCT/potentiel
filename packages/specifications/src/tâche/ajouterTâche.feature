# TODO move to GF
# language: fr
Fonctionnalité: Ajouter une tâche

    Contexte:
        Etant donné le projet lauréat sans garanties financières importées "Du boulodrome de Marseille"
        Et le porteur "Marcel Patoulatchi" ayant accés au projet lauréat "Du boulodrome de Marseille"

    Scénario: Une tâche est ajoutée lorsque les garanties financières sont demandées
        Etant donné des garanties financières en attente pour le projet "Du boulodrome de Marseille" avec :
            | date limite de soumission | 2023-11-01    |
            | date de notification      | 2023-09-01    |
            | motif                     | motif-inconnu |
        Alors une tâche indiquant de "transmettre les garanties financières" est consultable dans la liste des tâches du porteur pour le projet
