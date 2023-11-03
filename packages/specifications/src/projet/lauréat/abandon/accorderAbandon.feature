#Language: fr-FR
Fonctionnalité: Accorder l'abandon d'un projet lauréat
    Contexte:
      Etant donné le projet lauréat "Du boulodrome de Marseille"

    Scénario: Un DGEC validateur accorde l'abandon d'un projet lauréat
      Quand le DGEC validateur accorde l'abandon pour le projet lauréat "Du boulodrome de Marseille" avec :
        | Le format de la réponse signée   | application/pdf                                                              |
        | Le contenu de la réponse signée  | Le contenu de la la réponse signée expliquant la raison du rejet par la DGEC |
      Alors la demande d'abandon du projet lauréat "Du boulodrome de Marseille" devrait être accordée

    Scénario: Impossible d'accorder l'abandon d'un projet lauréat si l'abandon a déjà été accordé
      Etant donné une demande d'abandon accordée pour le projet lauréat "Du boulodrome de Marseille"
      Quand le DGEC validateur accorde l'abandon pour le projet lauréat "Du boulodrome de Marseille"
      Alors le DGEC validateur devrait être informé que "L'abandon déjà accordé"

    Scénario: Impossible d'accorder l'abandon d'un projet lauréat si l'abandon a déjà été rejeté
      Etant donné une demande d'abandon rejeté pour le projet lauréat "Du boulodrome de Marseille"
      Quand le DGEC validateur accorde l'abandon pour le projet lauréat "Du boulodrome de Marseille"
      Alors le DGEC validateur devrait être informé que "L'abandon déjà été rejeté"

    Scénario: Impossible d'accorder l'abandon d'un projet lauréat si aucun abandon n'a été demandé
      Quand le DGEC validateur accorde l'abandon pour le projet lauréat "Du boulodrome de Marseille"
      Alors le DGEC validateur devrait être informé que "Aucun abandon n'a été demandé"
