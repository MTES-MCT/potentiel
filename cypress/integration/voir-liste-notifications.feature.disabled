# language: fr
Fonctionnalité: Listing des notifications

  Contexte:
    Etant donné les notifications suivantes
      | type               | status  | error                | email                       | name | subject    | createdAt     | updatedAt     | context                      | variables                                 |
      | project-invitation | sent    |                      | invitation-ok@test.com      | Name | Invitation | 1588924095642 |               | { "projectId": "my-project"} | { "invitation_link": "invitation-link"}   |
      | project-invitation | error   | Mail service blocked | invitation-error@test.com   | Name | Invitation | 1588924095642 |               | { "projectId": "my-project"} | { "invitation_link": "invitation-link-1"} |
      | project-invitation | retried | Mail service blocked | invitation-retried@test.com | Name | Invitation | 1588924095642 | 1588924095642 | { "projectId": "my-project"} | { "invitation_link": "invitation-link"}   |
      | password-reset     | error   |                      | password-error@test.com     | Name | Password   | 1588924095642 |               | { "projectId": "my-project"} | { "invitation_link": "invitation-link-2"} |

  @admin
  Scénario: Je vois les notifications qui ont vécu une erreur
    Lorsque je me rends sur la page admin qui liste les notifications
    Alors la notification de "invitation-error@test.com" se trouve dans la liste
    Et la notification de "password-error@test.com" se trouve dans la liste
    Et la notification de "invitation-retried@test.com" se trouve dans la liste
    Et la notification de "invitation-ok@test.com" ne se trouve pas dans la liste

  @admin
  Scénario: Je relance les porteurs de projets invités et non-inscrits sur un appel d'offre
    Lorsque je me rends sur la page admin qui liste les notifications
    Et que je click sur le bouton "Relancer les notifications en erreur"
    Alors "2" emails de notifications sont envoyés
    Et "invitation-error@test.com" reçoit un mail de notification
    Et son mail a pour sujet "Invitation"
    Et son mail a pour template "1402576"
    Et son mail a la variable "invitation_link" avec comme valeur "invitation-link-1"
    Et "password-error@test.com" reçoit un mail de notification
    Et son mail a pour sujet "Password"
    Et son mail a pour template "1389166"
    Et son mail a la variable "invitation_link" avec comme valeur "invitation-link-2"