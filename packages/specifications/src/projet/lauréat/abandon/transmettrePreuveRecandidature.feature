#Language: fr-FR
Fonctionnalité: Transmettre une preuve de recandidature
    Contexte:
      Etant donné le projet lauréat "Du boulodrome de Marseille"

    Scénario: Le porteur du projet transmet comme preuve de recandidature un projet éliminé
      Etant donné le projet éliminé "MIOS"
      Et un abandon accordé avec recandidature pour le projet lauréat "Du boulodrome de Marseille"
      Quand le porteur transmet le projet éliminé "MIOS" comme preuve de recandidature suite à l'abandon du projet "Du boulodrome de Marseille" avec :
      | La date de notification du projet | 01/12/2024 |
      Alors le projet "MIOS" devrait être la preuve de recandidature suite à l'abandon du projet "Du boulodrome de Marseille"

    Scénario: Le porteur du projet transmet comme preuve de recandidature un projet lauréat
      Etant donné le projet lauréat "Boulodrome Sainte Livrade"
      Et un abandon accordé avec recandidature pour le projet lauréat "Du boulodrome de Marseille"
      Quand le porteur transmet le projet lauréat "Boulodrome Sainte Livrade" comme preuve de recandidature suite à l'abandon du projet "Du boulodrome de Marseille" avec :
      | La date de notification du projet | 01/12/2024 |
      Alors le projet "Boulodrome Sainte Livrade" devrait être la preuve de recandidature suite à l'abandon du projet "Du boulodrome de Marseille"

    Scénario: Impossible de transmettre une preuve de recandidature pour un abandon rejeté
      Etant donné le projet lauréat "Boulodrome Sainte Livrade"
      Et un abandon rejeté avec recandidature pour le projet lauréat "Du boulodrome de Marseille"
      Quand le porteur transmet le projet lauréat "Boulodrome Sainte Livrade" comme preuve de recandidature suite à l'abandon du projet "Du boulodrome de Marseille" avec :
      | La date de notification du projet | 01/12/2024 | 
      Alors le porteur devrait être informé que "Il est impossible de transmettre une preuve de recandidature pour un projet non abandonné"     

    Scénario: Impossible de transmettre une preuve de recandidature pour un abandon confirmé
      Etant donné le projet lauréat "Boulodrome Sainte Livrade"
      Et un abandon rejeté avec recandidature pour le projet lauréat "Du boulodrome de Marseille"
      Quand le porteur transmet le projet lauréat "Boulodrome Sainte Livrade" comme preuve de recandidature suite à l'abandon du projet "Du boulodrome de Marseille" avec :
      | La date de notification du projet | 01/12/2024 | 
      Alors le porteur devrait être informé que "Il est impossible de transmettre une preuve de recandidature pour un projet non abandonné"   

    Scénario: Impossible de transmettre une preuve de recandidature pour une demande d'abandon en cours
      Etant donné le projet lauréat "Boulodrome Sainte Livrade"
      Et une demande d'abandon en cours avec recandidature pour le projet lauréat "Du boulodrome de Marseille"
      Quand le porteur transmet le projet lauréat "Boulodrome Sainte Livrade" comme preuve de recandidature suite à l'abandon du projet "Du boulodrome de Marseille" avec :
      | La date de notification du projet | 01/12/2024 |
      Alors le porteur devrait être informé que "Il est impossible de transmettre une preuve de recandidature pour un projet non abandonné"
 
    Scénario: Impossible de transmettre une preuve de recandidature pour une demande d'abandon à confirmer
      Etant donné le projet lauréat "Boulodrome Sainte Livrade"
      Et une confirmation d'abandon demandée avec recandidature pour le projet lauréat "Du boulodrome de Marseille"
      Quand le porteur transmet le projet lauréat "Boulodrome Sainte Livrade" comme preuve de recandidature suite à l'abandon du projet "Du boulodrome de Marseille" avec :
      | La date de notification du projet | 01/12/2024 |
      Alors le porteur devrait être informé que "Il est impossible de transmettre une preuve de recandidature pour un projet non abandonné"         

    @NotImplemented
    Scénario: Impossible de transmettre comme preuve de recandidature un projet dont la date de notification est antérieure au 15/12/2023
      Etant donné un abandon accordé avec recandidature pour le projet lauréat "Du boulodrome de Marseille"                                                                               |
      Quand le porteur transmet comme preuve de recandidature le projet "MIOS" avec :
      | La date de notification du projet | 14/12/2023 |
      Alors le porteur devrait être informé que "Le projet faisant preuve de recandidature ne doit pas avoir comme doit pas avoir été notifié avant le 15/12/2023"

    @NotImplemented
    Scénario: Impossible de transmettre comme preuve de recandidature un projet dont la date de notification est supérieure au 31/03/2024
      Etant donné un abandon accordé avec recandidature pour le projet lauréat "Du boulodrome de Marseille"
      Quand le porteur transmet comme preuve de recandidature le projet "MIOS" avec :
      | La date de notification du projet | 02/04/2024 |
      Alors le porteur devrait être informé que "Le projet faisant preuve de recandidature ne doit pas avoir comme doit pas avoir été notifié après le 31/03/2024"
