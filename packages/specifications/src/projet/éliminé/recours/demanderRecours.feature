#Language: fr-FR
@select
Fonctionnalité: Demander le recours d'un projet éliminé
  Contexte:
    Etant donné le projet éliminé "Du boulodrome de Marseille"

  Scénario: Un porteur demande le recours d'un projet éliminé
    Quand le porteur demande le recours pour le projet éliminé "Du boulodrome de Marseille" avec :
      | La raison de le recours              | Une raison donnée par le porteur concernant le recours du projet éliminé                  |
      | Le format de la pièce justificative  | application/pdf                                                                           |
      | Le contenu de la pièce justificative | Le contenu de la pièce justificative expliquant la raison de le recours du projet éliminé |
      | Recandidature                        | oui                                                                                       |
    Alors le recours du projet éliminé "Du boulodrome de Marseille" devrait être consultable dans la liste des recours

  Scénario: Un porteur demande le recours d'un projet éliminé
    Quand le porteur demande le recours pour le projet éliminé "Du boulodrome de Marseille" avec :
      | La raison de le recours | Une raison donnée par le porteur concernant le recours du projet éliminé |
      | Recandidature           | oui                                                                      |
    Alors le recours du projet éliminé "Du boulodrome de Marseille" devrait être consultable dans la liste des recours

  Scénario: Un porteur demande le recours d'un projet éliminé après un rejet
    Etant donné un recours rejeté pour le projet éliminé "Du boulodrome de Marseille"
    Quand le porteur demande le recours pour le projet éliminé "Du boulodrome de Marseille" avec :
      | La raison de le recours | Une raison donnée par le porteur concernant le recours du projet éliminé |
      | Recandidature           | oui                                                                      |
    Alors le recours du projet éliminé "Du boulodrome de Marseille" devrait être consultable dans la liste des recours
    Et le recours du projet éliminé "Du boulodrome de Marseille" devrait être de nouveau demandé

  Scénario: Impossible de demander un recours pour un projet si le recours est déjà en cours
    Etant donné un recours en cours pour le projet éliminé "Du boulodrome de Marseille"
    Quand le porteur demande le recours pour le projet éliminé "Du boulodrome de Marseille"
    Alors le porteur devrait être informé que "Un recours est déjà en cours"

  Scénario: Impossible de demander un recours pour un projet si le recours est accordé
    Etant donné un recours accordé pour le projet éliminé "Du boulodrome de Marseille"
    Quand le porteur demande le recours pour le projet éliminé "Du boulodrome de Marseille"
    Alors le porteur devrait être informé que "Le recours a déjà été accordé"