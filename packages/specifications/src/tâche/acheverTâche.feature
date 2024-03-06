#Language: fr-FR
Fonctionnalité: Achever une tâche
    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et le porteur pour le projet lauréat "Du boulodrome de Marseille"
            | email | porteur@test.test |
            | nom   | Porteur Projet Test |
            | role  | porteur-projet |

    Scénario: Une tâche est achevée quand la preuve de recandidature est transmise
        Etant donné le projet éliminé "MIOS"
        Et un abandon accordé avec recandidature pour le projet lauréat "Du boulodrome de Marseille"
        Quand le porteur transmet le projet éliminé "MIOS" comme preuve de recandidature suite à l'abandon du projet "Du boulodrome de Marseille" avec :
        | La date de notification du projet | 2024-01-01 |
        Alors une tâche indiquant de "transmettre la preuve de recandidature" n'est plus consultable dans la liste des tâches du porteur pour le projet

    Scénario: Une tâche est ajoutée lorsqu'une confirmation d'abandon est demandée
        Etant donné une confirmation d'abandon demandée pour le projet lauréat "Du boulodrome de Marseille"
        Quand le porteur confirme l'abandon pour le projet lauréat "Du boulodrome de Marseille"
        Alors une tâche indiquant de "confirmer un abandon" n'est plus consultable dans la liste des tâches du porteur pour le projet
