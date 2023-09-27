#Language: fr-FR
Fonctionnalité: Demander l'abandon d'un projet lauréat
    Contexte:
      Etant donné le projet lauréat "Du boulodrome de Marseille"

    Scénario: Un porteur demande l'abandon d'un projet lauréat
      Quand un porteur demande l'abandon du projet "Du boulodrome de Marseille" avec :
        | La raison de l'abandon                | Une raison donnée par le porteur concernant l'abandon du projet lauréat                   |
        | Le format de la piéce justificative   | application/pdf                                                                           |
        | Le contenu de la piéce justificative  | Le contenu de la piéce justificative expliquant la raison de l'abandon du projet lauréat  |
        | Recandidature                         | oui                                                                                       |
      Alors la recandidature du projet "Du boulodrome de Marseille" devrait être consultable dans la liste des projets lauréat abandonnés

    Scénario: Impossible d'abandonné un projet si une demande d'abandon est en cours
      Etant donné une demande d'abandon en cours pour le projet "Du boulodrome de Marseille"
      Quand un porteur demande l'abandon du projet "Du boulodrome de Marseille" avec :
        | La raison de l'abandon                | Une raison donnée par le porteur concernant l'abandon du projet lauréat                   |
        | Le format de la piéce justificative   | application/pdf                                                                           |
        | Le contenu de la piéce justificative  | Le contenu de la piéce justificative expliquant la raison de l'abandon du projet lauréat  |
        | Recandidature                         | non                                                                                       |
      Alors le porteur devrait être informé que "Une demande d'abandon est déjà en cours pour le projet"

    Scénario: Un porteur demande l'abandon d'un projet lauréat avec recandidature
      Quand un porteur demande l'abandon du projet "Du boulodrome de Marseille" avec :
        | La raison de l'abandon                | Une raison donnée par le porteur concernant l'abandon du projet lauréat                   |
        | Le format de la piéce justificative   | application/pdf                                                                           |
        | Le contenu de la piéce justificative  | Le contenu de la piéce justificative expliquant la raison de l'abandon du projet lauréat  |
        | Recandidature                         | oui                                                                                       |
      Alors le projet "Du boulodrome de Marseille" devrait être disponible dans la liste des recandidatures attendues

      
        