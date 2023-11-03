#Language: fr-FR
Fonctionnalité: Rejeter l'abandon d'un projet lauréat
    Contexte:
      Etant donné le projet lauréat "Du boulodrome de Marseille"

    @NotImplemented
    Scénario: Un DGEC validateur rejette l'abandon d'un projet lauréat
      Quand le DGEC validateur rejette l'abandon pour le projet lauréat "Du boulodrome de Marseille" avec :
        | Le format de la réponse signée   | application/pdf                                                              |
        | Le contenu de la réponse signée  | Le contenu de la la réponse signée expliquant la raison du rejet par la DGEC |
      Alors la demande d'abandon du projet lauréat "Du boulodrome de Marseille" devrait être rejetée

    @NotImplemented
    Scénario: Impossible de rejetter l'abandon d'un projet lauréat si l'abandon a déjà été accordé
      Etant donné une demande d'abandon accordée pour le projet lauréat "Du boulodrome de Marseille"
      Quand le DGEC validateur rejette l'abandon pour le projet lauréat "Du boulodrome de Marseille"
      Alors le DGEC validateur devrait être informé que "L'abandon déjà été accordé"

    @NotImplemented
    Scénario: Impossible de rejetter l'abandon d'un projet lauréat si aucun abandon n'a été demandé
      Quand le DGEC validateur rejette l'abandon pour le projet lauréat "Du boulodrome de Marseille"
      Alors le DGEC validateur devrait être informé que "Aucun abandon n'a été demandé"
