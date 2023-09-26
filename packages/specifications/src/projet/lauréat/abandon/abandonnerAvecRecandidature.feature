#Language: fr-FR
Fonctionnalité: Abandonner un projet lauréat avec recandidature
    Contexte:
      Etant donné le projet lauréat "Du boulodrome de Marseille"

    @select
    Scénario: Le projet lauréat est abandonné avec recandidature
      Quand un porteur demande l'abandon avec recandidature pour le projet "Du boulodrome de Marseille" avec :
        | La raison de l'abandon                | Une raison donnée par le porteur concernant l'abandon du projet lauréat |
        | Le format de la piéce justificative   | application/pdf                                                         |
        | Le contenu de la piéce justificative  | Le contenu de la piéce justificative expliquant la raison de l'abandon du projet lauréat |
      Alors la recandidature du projet "Du boulodrome de Marseille" devrait être consultable dans la liste des projets lauréat abandonnés devant recandidater
      Et le projet "Du boulodrome de Marseille" devrait être disponible dans la liste des recandidatures attendues

    # Ce scénario ne peut pas être finaliser tant que les candidatures ne sont pas dans le nouveau socle
    # Scénario: Impossible d'abandonné un projet qui n'existe pas
    #   Quand un porteur demande un abandon avec recandidature pour un projet qui n'existe pas
    #   Alors le porteur devrait être informé que "Le projet n'existe pas"

    @select
    Scénario: Impossible d'abandonné un projet avec recandidature si un abandon a déjà été fait précédement
      Etant donné une demande d'abandon avec recandidature pour le projet "Du boulodrome de Marseille"
      Quand un porteur demande l'abandon avec recandidature pour le projet "Du boulodrome de Marseille" avec :
        | La raison de l'abandon                | Une raison donnée par le porteur concernant l'abandon du projet lauréat |
        | Le format de la piéce justificative   | application/pdf                                                         |
        | Le contenu de la piéce justificative  | Le contenu de la piéce justificative expliquant la raison de l'abandon du projet lauréat |
      Alors le porteur devrait être informé que "Une demande d'abandon existe déjà pour le projet"

      
        