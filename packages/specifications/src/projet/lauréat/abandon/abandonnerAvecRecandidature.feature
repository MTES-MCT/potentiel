#Language: fr-FR
Fonctionnalité: Abandonner un projet lauréat avec recandidature
    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"

    Scénario: Le projet lauréat est abandonné avec recandidature
      Quand un porteur demande un abandon avec recandidature pour le projet "Du boulodrome de Marseille" avec :
        | La raison de l'abandon                | Une raison donnée par le porteur concernant l'abandon du projet lauréat |
        | Le format de la piéce justificative   | application/pdf                                                         |
        | Le contenu de la piéce justificative  | Le contenu de la piéce justificative expliquant la raison de l'abandon du projet lauréat |
      Alors la recandidature du projet devrait être consultable dans la liste des projets lauréat abandonnés devant recandidatés
        