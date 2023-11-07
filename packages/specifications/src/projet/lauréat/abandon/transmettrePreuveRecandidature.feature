#Language: fr-FR
Fonctionnalité: Ajouter une preuve de recandidature
    Contexte:
      Etant donné le projet lauréat "Du boulodrome de Marseille"
      Et le projet éliminé "MIOS"
      
    @NotImplemented
    Scénario: Le porteur du projet transmet une preuve de recandidature
      Etant donné une demande d'abandon avec recandidature accordée pour le projet "Du boulodrome de Marseille" avec :
      | La raison de l'abandon                | Une raison donnée par le porteur concernant l'abandon du projet lauréat                   |
      | Le format de la pièce justificative   | application/pdf                                                                           |
      | Le contenu de la pièce justificative  | Le contenu de la pièce justificative expliquant la raison de l'abandon du projet lauréat  | 
      Quand le porteur transmet comme preuve de recandidature le projet "MIOS" avec :
      | La date de notification du projet | 01/12/2024 |
      Alors l'abandon du projet "Du boulodrome de Marseille" n'est plus en alerte
      Et le porteur devrait être informé que "La preuve de recandidature a bien été prise en compte"

    @NotImplemented
    Scénario: Impossible de transmettre une preuve de recandidature si la demande d'abandon n'a pas été accepté
      Etant donné une demande d'abandon en cours pour le projet lauréat "Du boulodrome de Marseille"
      Quand le porteur transmet comme preuve de recandidature le projet "MIOS" avec :
      | La date de notification du projet | 14/12/2023 |
      Alors le porteur devrait être informé que "Il est impossible de transmettre une preuve de recandidature pour un projet non abandonné"

    @NotImplemented
    Scénario: Impossible de transmettre une preuve de recandidature si la date de notification du projet est antérieure au 15/12/2023
      Etant donné une demande d'abandon avec recandidature accordée pour le projet "Du boulodrome de Marseille" avec :
      | La raison de l'abandon                | Une raison donnée par le porteur concernant l'abandon du projet lauréat                   |
      | Le format de la pièce justificative   | application/pdf                                                                           |
      | Le contenu de la pièce justificative  | Le contenu de la pièce justificative expliquant la raison de l'abandon du projet lauréat  |                                                                                 |
      Quand le porteur transmet comme preuve de recandidature le projet "MIOS" avec :
      | La date de notification du projet | 14/12/2023 |
      Alors le porteur devrait être informé que "Le projet faisant preuve de recandidature ne doit pas avoir comme doit pas avoir été notifié avant le 15/12/2023"

    @NotImplemented
    Scénario: Impossible de transmettre une preuve de recandidature si la date de notification du projet est supérieure au 31/03/2024
      Etant donné une demande d'abandon avec recandidature accordée pour le projet "Du boulodrome de Marseille" avec :
      | La raison de l'abandon                | Une raison donnée par le porteur concernant l'abandon du projet lauréat                   |
      | Le format de la pièce justificative   | application/pdf                                                                           |
      | Le contenu de la pièce justificative  | Le contenu de la pièce justificative expliquant la raison de l'abandon du projet lauréat  |                                                                                         |
      Quand le porteur transmet comme preuve de recandidature le projet "MIOS" avec :
      | La date de notification du projet | 02/04/2024 |
      Alors le porteur devrait être informé que "Le projet faisant preuve de recandidature ne doit pas avoir comme doit pas avoir été notifié après le 31/03/2024"
