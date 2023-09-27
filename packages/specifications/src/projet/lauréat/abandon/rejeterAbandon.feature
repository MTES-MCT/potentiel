Fonctionnalité: Rejeter l'abandon d'un projet lauréat
    Contexte:
      Etant donné le projet lauréat "Du boulodrome de Marseille"

    @select
    Scénario: Le DGEC validateur accepte l'abandon d'un projet lauréat
      Etant donné une demande d'abandon en cours pour le projet "Du boulodrome de Marseille"
      Quand le DGEC validateur rejette l'abandon pour le projet "Du boulodrome de Marseille" avec :
      | Le format de la réponse signée  | application/pdf                                                                       |
      | Le contenu de la réponse signée | Le contenu de la réponse signée expliquant la raison du rejet de la demande d'abandon |
      Alors le projet "Du boulodrome de Marseille" n'a plus de demande d'abandon en cours
      