#Language: fr-FR
Fonctionnalité: Demander l'abandon d'un projet lauréat
  Contexte:
    Etant donné le projet lauréat "Du boulodrome de Marseille"

  Scénario: Un porteur demande l'abandon d'un projet lauréat
    Quand le porteur demande l'abandon pour le projet lauréat "Du boulodrome de Marseille" avec :
      | La raison de l'abandon               | Une raison donnée par le porteur concernant l'abandon du projet lauréat                  |
      | Le format de la pièce justificative  | application/pdf                                                                          |
      | Le contenu de la pièce justificative | Le contenu de la pièce justificative expliquant la raison de l'abandon du projet lauréat |
      | Recandidature                        | oui                                                                                      |
    Alors l'abandon du projet lauréat "Du boulodrome de Marseille" devrait être consultable dans la liste des projets lauréat abandonnés

  Scénario: Un porteur demande l'abandon d'un projet lauréat
    Quand le porteur demande l'abandon pour le projet lauréat "Du boulodrome de Marseille" avec :
      | La raison de l'abandon | Une raison donnée par le porteur concernant l'abandon du projet lauréat |
      | Recandidature          | oui                                                                     |
    Alors l'abandon du projet lauréat "Du boulodrome de Marseille" devrait être consultable dans la liste des projets lauréat abandonnés

  Scénario: Un porteur demande l'abandon d'un projet lauréat après un rejet
    Etant donné un abandon rejeté pour le projet lauréat "Du boulodrome de Marseille"
    Quand le porteur demande l'abandon pour le projet lauréat "Du boulodrome de Marseille" avec :
      | La raison de l'abandon | Une raison donnée par le porteur concernant l'abandon du projet lauréat |
      | Recandidature          | oui                                                                     |
    Alors l'abandon du projet lauréat "Du boulodrome de Marseille" devrait être consultable dans la liste des projets lauréat abandonnés
    Et l'abandon du projet lauréat "Du boulodrome de Marseille" devrait être de nouveau demandé

  Scénario: Impossible d'abandonner un projet si l'abandon est déjà en cours
    Etant donné une demande d'abandon en cours pour le projet lauréat "Du boulodrome de Marseille"
    Quand le porteur demande l'abandon pour le projet lauréat "Du boulodrome de Marseille"
    Alors le porteur devrait être informé que "Une demande d'abandon est déjà en cours"

  Scénario: Impossible d'abandonner un projet si l'abandon est accordé
    Etant donné un abandon accordé pour le projet lauréat "Du boulodrome de Marseille"
    Quand le porteur demande l'abandon pour le projet lauréat "Du boulodrome de Marseille"
    Alors le porteur devrait être informé que "L'abandon a déjà été accordé"