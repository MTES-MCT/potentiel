#Language: fr-FR
Fonctionnalité: Transmettre une preuve de recandidature
    Contexte:
      Etant donné le projet lauréat "Du boulodrome de Marseille"
    Scénario: Le porteur du projet transmet comme preuve de recandidature un projet éliminé
      Etant donné le projet éliminé "MIOS"
      Et un abandon accordé avec recandidature pour le projet lauréat "Du boulodrome de Marseille"
      Quand le porteur transmet le projet éliminé "MIOS" comme preuve de recandidature suite à l'abandon du projet "Du boulodrome de Marseille" avec :
      | La date de notification du projet | 2024-01-01 |
      Alors le projet "MIOS" devrait être la preuve de recandidature suite à l'abandon du projet "Du boulodrome de Marseille"
    
    Scénario: Le porteur du projet transmet comme preuve de recandidature un projet lauréat
      Etant donné le projet lauréat "Boulodrome Sainte Livrade"
      Et un abandon accordé avec recandidature pour le projet lauréat "Du boulodrome de Marseille"
      Quand le porteur transmet le projet lauréat "Boulodrome Sainte Livrade" comme preuve de recandidature suite à l'abandon du projet "Du boulodrome de Marseille" avec :
      | La date de notification du projet | 2024-01-01 |
      Alors le projet "Boulodrome Sainte Livrade" devrait être la preuve de recandidature suite à l'abandon du projet "Du boulodrome de Marseille"
    
    Scénario: Impossible de transmettre une preuve pour un abandon accordé sans recandidature
      Etant donné le projet lauréat "Boulodrome Sainte Livrade"
      Et un abandon accordé pour le projet lauréat "Du boulodrome de Marseille"
      Quand le porteur transmet le projet lauréat "Boulodrome Sainte Livrade" comme preuve de recandidature suite à l'abandon du projet "Du boulodrome de Marseille" avec :
      | La date de notification du projet | 2024-01-01 |
      Alors le porteur devrait être informé que "Il est impossible de transmettre une preuve pour un abandon sans recandidature"
    
    Scénario: Impossible de transmettre une preuve de recandidature pour un abandon rejeté
      Etant donné le projet lauréat "Boulodrome Sainte Livrade"
      Et un abandon rejeté avec recandidature pour le projet lauréat "Du boulodrome de Marseille"
      Quand le porteur transmet le projet lauréat "Boulodrome Sainte Livrade" comme preuve de recandidature suite à l'abandon du projet "Du boulodrome de Marseille" avec :
      | La date de notification du projet | 2024-01-01 | 
      Alors le porteur devrait être informé que "Il est impossible de transmettre une preuve de recandidature pour un abandon non accordé"     

    Scénario: Impossible de transmettre une preuve de recandidature pour un abandon confirmé
      Etant donné le projet lauréat "Boulodrome Sainte Livrade"
      Et un abandon rejeté avec recandidature pour le projet lauréat "Du boulodrome de Marseille"
      Quand le porteur transmet le projet lauréat "Boulodrome Sainte Livrade" comme preuve de recandidature suite à l'abandon du projet "Du boulodrome de Marseille" avec :
      | La date de notification du projet | 2024-01-01 | 
      Alors le porteur devrait être informé que "Il est impossible de transmettre une preuve de recandidature pour un abandon non accordé"   

    Scénario: Impossible de transmettre une preuve de recandidature pour une demande d'abandon en cours
      Etant donné le projet lauréat "Boulodrome Sainte Livrade"
      Et une demande d'abandon en cours avec recandidature pour le projet lauréat "Du boulodrome de Marseille"
      Quand le porteur transmet le projet lauréat "Boulodrome Sainte Livrade" comme preuve de recandidature suite à l'abandon du projet "Du boulodrome de Marseille" avec :
      | La date de notification du projet | 2024-01-01 |
      Alors le porteur devrait être informé que "Il est impossible de transmettre une preuve de recandidature pour un abandon non accordé"
 
    Scénario: Impossible de transmettre une preuve de recandidature pour une demande d'abandon à confirmer
      Etant donné le projet lauréat "Boulodrome Sainte Livrade"
      Et une confirmation d'abandon demandée avec recandidature pour le projet lauréat "Du boulodrome de Marseille"
      Quand le porteur transmet le projet lauréat "Boulodrome Sainte Livrade" comme preuve de recandidature suite à l'abandon du projet "Du boulodrome de Marseille" avec :
      | La date de notification du projet | 2024-01-01 |
      Alors le porteur devrait être informé que "Il est impossible de transmettre une preuve de recandidature pour un abandon non accordé"         

    Scénario: Impossible de transmettre comme preuve de recandidature un projet dont la date de notification est antérieure au 15/12/2023
      Etant donné le projet lauréat "Boulodrome Sainte Livrade"
      Et un abandon accordé avec recandidature pour le projet lauréat "Du boulodrome de Marseille"                                                                               
      Quand le porteur transmet le projet lauréat "Boulodrome Sainte Livrade" comme preuve de recandidature suite à l'abandon du projet "Du boulodrome de Marseille" avec :
      | La date de notification du projet | 2023-12-14 |
      Alors le porteur devrait être informé que "Il est impossible de transmettre comme preuve de recandidature un projet ayant été notifié avant le 15/12/2023"

    Scénario: Impossible de transmettre comme preuve de recandidature un projet dont la date de notification est ultérieure au 31/03/2024
      Etant donné le projet lauréat "Boulodrome Sainte Livrade"
      Et un abandon accordé avec recandidature pour le projet lauréat "Du boulodrome de Marseille"
      Quand le porteur transmet le projet lauréat "Boulodrome Sainte Livrade" comme preuve de recandidature suite à l'abandon du projet "Du boulodrome de Marseille" avec :
      | La date de notification du projet | 2024-04-02 |
      Alors le porteur devrait être informé que "Il est impossible de transmettre comme preuve de recandidature un projet ayant été notifié après le 31/03/2024"

  @NotImplemented
    Scénario: Impossible de transmettre comme preuve de recandidature un projet inexistant
      Etant donné un abandon accordé avec recandidature pour le projet lauréat "Du boulodrome de Marseille"
      Quand le porteur transmet le projet lauréat "projet inconnu" comme preuve de recandidature suite à l'abandon du projet "Du boulodrome de Marseille" avec :
      | La date de notification du projet | 2024-01-01 |
      Alors le porteur devrait être informé que "Il est impossible de transmettre comme preuve de recandidature un projet inexistant"