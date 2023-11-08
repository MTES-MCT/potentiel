#Language: fr-FR
Fonctionnalité: Rejeter l'abandon d'un projet lauréat
    Contexte:
      Etant donné le projet lauréat "Du boulodrome de Marseille"

@select
    Scénario: Un DGEC validateur rejette l'abandon d'un projet lauréat
      Etant donné une demande d'abandon en cours pour le projet lauréat "Du boulodrome de Marseille"
      Quand le DGEC validateur rejette l'abandon pour le projet lauréat "Du boulodrome de Marseille" avec :
        | Le format de la réponse signée   | application/pdf                                                              |
        | Le contenu de la réponse signée  | Le contenu de la la réponse signée expliquant la raison du rejet par la DGEC |
      Alors l'abandon du projet lauréat "Du boulodrome de Marseille" devrait être rejeté

@select
    Scénario: Impossible de rejetter l'abandon d'un projet lauréat si l'abandon a déjà été accordé
      Etant donné un abandon accordé pour le projet lauréat "Du boulodrome de Marseille"
      Quand le DGEC validateur rejette l'abandon pour le projet lauréat "Du boulodrome de Marseille"
      Alors le DGEC validateur devrait être informé que "L'abandon a déjà été accordé"

@select
    Scénario: Impossible de rejetter l'abandon d'un projet lauréat si aucun abandon n'a été demandé
      Quand le DGEC validateur rejette l'abandon pour le projet lauréat "Du boulodrome de Marseille"
      Alors le DGEC validateur devrait être informé que "Aucun abandon n'est en cours"
