# language: fr
@tâche
Fonctionnalité: Ajouter une tâche

    Contexte:
        Etant donné le projet lauréat sans garanties financières importées "Du boulodrome de Marseille"

    Scénario: Une tâche est ajoutée lorsque les garanties financières sont demandées
        Etant donné des garanties financières en attente pour le projet lauréat
        Alors une tâche indiquant de "transmettre les garanties financières" est consultable dans la liste des tâches du porteur pour le projet
