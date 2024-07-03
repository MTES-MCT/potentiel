# language: fr
Fonctionnalité: Ajouter une tâche

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et le porteur pour le projet lauréat "Du boulodrome de Marseille"
            | email | porteur@test.test   |
            | nom   | Porteur Projet Test |
            | role  | porteur-projet      |

    Scénario: Une tâche est ajoutée lorsqu'une demande d'abandon avec recandidature est accordé
        Etant donné une demande d'abandon en cours avec recandidature pour le projet lauréat "Du boulodrome de Marseille"
        Quand le DGEC validateur accorde l'abandon pour le projet lauréat "Du boulodrome de Marseille" avec :
            | Le format de la réponse signée  | application/pdf                                                                 |
            | Le contenu de la réponse signée | Le contenu de la la réponse signée expliquant la raison de l'accord par la DGEC |
        Alors une tâche indiquant de "transmettre la preuve de recandidature" est consultable dans la liste des tâches du porteur pour le projet

    Scénario: Une tâche est ajoutée lorsqu'une confirmation d'abandon est demandée
        Etant donné une demande d'abandon en cours pour le projet lauréat "Du boulodrome de Marseille"
        Quand le DGEC validateur demande une confirmation d'abandon pour le projet lauréat "Du boulodrome de Marseille" avec :
            | Le format de la réponse signée  | application/pdf                                                                      |
            | Le contenu de la réponse signée | Le contenu de la la réponse signée expliquant la demande de confirmation par la DGEC |
        Alors une tâche indiquant de "confirmer un abandon" est consultable dans la liste des tâches du porteur pour le projet

    Scénario: Une tâche est ajoutée lorsque les garanties financières sont demandées
        Etant donné des garanties financières en attente pour le projet "Du boulodrome de Marseille" avec :
            | date limite de soumission | 2023-11-01    |
            | date de notification      | 2023-09-01    |
            | motif                     | motif-inconnu |
        Alors une tâche indiquant de "transmettre les garanties financières" est consultable dans la liste des tâches du porteur pour le projet

    Scénario: Une tâche est ajoutée lorsqu'un gestionnaire réseau inconnu est attribué
        Etant donné le gestionnaire de réseau "Enedis"
        Quand le gestionnaire de réseau inconnu est attribué au raccordement du projet lauréat "Du boulodrome de Marseille"
        Alors une tâche indiquant de "mettre à jour le gestionnaire de réseau" est consultable dans la liste des tâches du porteur pour le projet

    Scénario: Une tâche est ajoutée lorsqu'un raccordement est modifié avec un gestionnaire réseau inconnu
        Etant donné le gestionnaire de réseau "Enedis"
        Et une demande complète de raccordement pour le projet lauréat "Du boulodrome de Marseille" transmise auprès du gestionnaire de réseau "Enedis" avec :
            | La date de qualification                | 2022-10-28                                                                                            |
            | La référence du dossier de raccordement | OUE-RP-2022-000033                                                                                    |
            | Le format de l'accusé de réception      | application/pdf                                                                                       |
            | Le contenu de l'accusé de réception     | Accusé de réception ayant pour référence OUE-RP-2022-000033 et la date de qualification au 2022-10-28 |
        Quand le système modifie le gestionnaire de réseau du projet "Du boulodrome de Marseille" avec un gestionnaire inconnu
        Alors une tâche indiquant de "mettre à jour le gestionnaire de réseau" est consultable dans la liste des tâches du porteur pour le projet
