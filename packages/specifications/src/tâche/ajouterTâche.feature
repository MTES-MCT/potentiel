#Language: fr-FR
Fonctionnalité: AJouter une tâche
    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et le porteur pour le projet lauréat "Du boulodrome de Marseille"
            | email | porteur@test.test |
            | nom   | Porteur Projet Test |
            | role  | porteur-projet |

    Scénario: Une tâche est ajoutée lorsqu'une demande d'abandon avec recandidature est accordé
        Etant donné une demande d'abandon en cours avec recandidature pour le projet lauréat "Du boulodrome de Marseille"
        Quand le DGEC validateur accorde l'abandon pour le projet lauréat "Du boulodrome de Marseille" avec :
            | Le format de la réponse signée  | application/pdf                                                                 |
            | Le contenu de la réponse signée | Le contenu de la la réponse signée expliquant la raison de l'accord par la DGEC |
        Alors une tâche indiquant de "transmettre la preuve de recandidature" est consultable dans la liste des tâches du porteur pour le projet

    Scénario: Une tâche est ajoutée lorsqu'une confirmation d'abandon est demandée
        Etant donné une demande d'abandon en cours pour le projet lauréat "Du boulodrome de Marseille"
        Quand le DGEC validateur demande une confirmation d'abandon pour le projet lauréat "Du boulodrome de Marseille" avec :
            | Le format de la réponse signée   | application/pdf                                                              |
            | Le contenu de la réponse signée  | Le contenu de la la réponse signée expliquant la demande de confirmation par la DGEC |
        Alors une tâche indiquant de "confirmer un abandon" est consultable dans la liste des tâches du porteur pour le projet
