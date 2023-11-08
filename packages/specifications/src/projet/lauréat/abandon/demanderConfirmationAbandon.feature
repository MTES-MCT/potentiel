#Language: fr-FR
Fonctionnalité: Demander une confirmation d'abandon d'un projet lauréat
    Contexte:
      Etant donné le projet lauréat "Du boulodrome de Marseille"

    @select
    Scénario: Un DGEC validateur demande une confirmation d'abandon d'un projet lauréat
      Etant donné une demande d'abandon en cours pour le projet lauréat "Du boulodrome de Marseille"
      Quand le DGEC validateur demande une confirmation d'abandon pour le projet lauréat "Du boulodrome de Marseille" avec :
        | Le format de la réponse signée   | application/pdf                                                              |
        | Le contenu de la réponse signée  | Le contenu de la la réponse signée expliquant la demande de confirmation par la DGEC |
      Alors la confirmation d'abandon du projet lauréat "Du boulodrome de Marseille" devrait être demandée

    @select
    Scénario: Impossible de demande une confirmation d'abandon d'un projet lauréat si l'abandon a déjà été accordé
      Etant donné un abandon accordé pour le projet lauréat "Du boulodrome de Marseille"
      Quand le DGEC validateur demande une confirmation d'abandon pour le projet lauréat "Du boulodrome de Marseille"
      Alors le DGEC validateur devrait être informé que "L'abandon a déjà été accordé"

    @select
    Scénario: Impossible de demande une confirmation d'abandon d'un projet lauréat si l'abandon a déjà été rejeté
      Etant donné un abandon rejeté pour le projet lauréat "Du boulodrome de Marseille"
      Quand le DGEC validateur demande une confirmation d'abandon pour le projet lauréat "Du boulodrome de Marseille"
      Alors le DGEC validateur devrait être informé que "L'abandon a déjà été rejeté"

    Scénario: Impossible de demande une confirmation d'abandon d'un projet lauréat si la confirmation d'abandon a déjà été demandé
      Etant donné une confirmation d'abandon demandée pour le projet lauréat "Du boulodrome de Marseille"
      Quand le DGEC validateur demande une confirmation d'abandon pour le projet lauréat "Du boulodrome de Marseille"
      Alors le DGEC validateur devrait être informé que "La confirmation de l'abandon a déjà été demandée"
    
    @select
    Scénario: Impossible de demande une confirmation d'abandon d'un projet lauréat si l'abandon a déjà été confirmé
      Etant donné un abandon confirmé pour le projet lauréat "Du boulodrome de Marseille"
      Quand le DGEC validateur demande une confirmation d'abandon pour le projet lauréat "Du boulodrome de Marseille"
      Alors le DGEC validateur devrait être informé que "L'abandon a déjà été confirmé"

    @select
    Scénario: Impossible de demande une confirmation d'abandon d'un projet lauréat si aucun abandon n'a été demandé
      Quand le DGEC validateur demande une confirmation d'abandon pour le projet lauréat "Du boulodrome de Marseille"
      Alors le DGEC validateur devrait être informé que "Aucun abandon n'est en cours"
