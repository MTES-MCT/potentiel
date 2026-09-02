# language: fr
@producteur
Fonctionnalité: Corriger le numéro d'identification d'un projet lauréat

  Scénario: Corriger le numéro d'identification d'un projet lauréat
    Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
      | appel d'offres | PPE2 - Bâtiment |
    Et la dreal "Dreal du sud" associée à la région du projet
    Quand <rôle> corrige le numéro d'identification du projet lauréat
    Alors le producteur du projet lauréat devrait être mis à jour
    Et une tâche indiquant de "renseigner le numéro d'identification" n'est plus consultable dans la liste des tâches du porteur pour le projet

    Exemples:
      | rôle       |
      | le porteur |
      | la dgec    |
      | la dreal   |


  Scénario: L'administration corrige le numéro d'identification d'un projet achevé
    Etant donné le projet lauréat "Du boulodrome de Besançon" avec :
      | appel d'offres | PPE2 - Bâtiment |
      | période        | 1               |
    Et la dreal "Dreal du nord-est" associée à la région du projet
    Et l'achèvement réel transmis pour le projet lauréat
    Quand <rôle> corrige le numéro d'identification du projet lauréat
    Alors le producteur du projet lauréat devrait être mis à jour
    Et une tâche indiquant de "renseigner le numéro d'identification" n'est plus consultable dans la liste des tâches du porteur pour le projet

    Exemples:
      | rôle     |
      | la dgec  |
      | la dreal |

  Scénario: L'administration corrige le numéro d'identification d'un projet avec une demande d'abandon en cours
    Etant donné le projet lauréat "Du boulodrome de Libourne" avec :
      | appel d'offres | PPE2 - Bâtiment |
      | période        | 1               |
    Et la dreal "Dreal du sud-ouest" associée à la région du projet
    Et une demande d'abandon en cours pour le projet lauréat
    Quand <rôle> corrige le numéro d'identification du projet lauréat
    Alors le producteur du projet lauréat devrait être mis à jour
    Et une tâche indiquant de "renseigner le numéro d'identification" n'est plus consultable dans la liste des tâches du porteur pour le projet

    Exemples:
      | rôle     |
      | la dgec  |
      | la dreal |

  Scénario: L'administration corrige le numéro d'identification d'un projet abandonné
    Etant donné le projet lauréat "Du boulodrome de Concarneau" avec :
      | appel d'offres | PPE2 - Bâtiment |
      | période        | 1               |
    Et la dreal "Dreal du nord-ouest" associée à la région du projet
    Et une demande d'abandon accordée pour le projet lauréat
    Quand <rôle> corrige le numéro d'identification du projet lauréat
    Alors le producteur du projet lauréat devrait être mis à jour
    Et une tâche indiquant de "renseigner le numéro d'identification" n'est plus consultable dans la liste des tâches du porteur pour le projet

    Exemples:
      | rôle     |
      | la dgec  |
      | la dreal |

  Scénario: Impossible de corriger le numéro d'identification d'un projet lauréat avec un numéro identique
    Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
      | appel d'offres | PPE2 - Bâtiment   |
      | période        | 1                 |
      | numéro siret   | 110 090 016 00053 |
    Quand le porteur corrige le numéro d'identification du projet lauréat avec une valeur identique
    Alors le porteur devrait être informé que "Aucune modification n’a été apportée"

  Scénario: Impossible pour porteur de corriger le numéro d'identification d'un projet lauréat abandonné
    Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
      | appel d'offres | PPE2 - Bâtiment |
      | période        | 1               |
    Et une demande d'abandon accordée pour le projet lauréat
    Quand le porteur corrige le numéro d'identification du projet lauréat
    Alors le porteur devrait être informé que "Impossible de faire un changement pour un projet abandonné"

  Scénario: Impossible pour un porteur de corriger le numéro d'identification d'un projet lauréat si une demande d'abandon est en cours
    Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
      | appel d'offres | PPE2 - Bâtiment |
      | période        | 1               |
    Et une demande d'abandon en cours pour le projet lauréat
    Quand le porteur corrige le numéro d'identification du projet lauréat
    Alors le porteur devrait être informé que "Impossible de faire un changement car une demande d'abandon est en cours pour le projet"

  Scénario: Impossible pour un porteur de corriger le numéro d'identification d'un projet lauréat achevé
    Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
      | appel d'offres | PPE2 - Bâtiment |
      | période        | 1               |
    Et l'achèvement réel transmis pour le projet lauréat
    Quand le porteur corrige le numéro d'identification du projet lauréat
    Alors le porteur devrait être informé que "Impossible de faire un changement pour un projet achevé"

  Scénario: Impossible de corriger le numéro d'identification d'un projet lauréat si le cahier des charges ne le permet pas
    Etant donné le projet lauréat legacy "Du bouchon lyonnais" avec :
      | appel d'offres | Eolien |
      | période        | 1      |
    Quand le porteur corrige le numéro d'identification du projet lauréat
    Alors le porteur devrait être informé que "Le cahier des charges de ce projet ne permet pas ce changement"

