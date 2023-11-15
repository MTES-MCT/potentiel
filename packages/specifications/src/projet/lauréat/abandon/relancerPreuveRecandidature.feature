#Language: fr-FR
Fonctionnalité: Relancer un porteur pour qu'il transmette une preuve de recandidature
  Contexte:
    Etant donné le projet lauréat "Du boulodrome de Marseille"

  @NotImplemented
  Plan du scénario: Le porteur du projet est relancé trimestriellement si sa demande d'abandon avec recandidature a été accordé et qu'il n'a pas transmis de preuve de recandidature
    Etant donné un abandon accordé avec recandidature il y a "<Nombre mois>" mois pour le projet lauréat "Du boulodrome de Marseille"
    Quand le DGEC validateur relance le porteur pour qu'il transmette une preuve de recandidature
    Alors le porteur "<État de la relance>"

    Exemples:
      | Nombre mois | État de la relance  |
      | 3           | a été relancé       |
      | 2           | n'a pas été relancé |
      | 0           | n'a pas été relancé |
      | 9           | a été relancé       |
      | 6           | a été relancé       |
      | 11          | n'a pas été relancé |
      | 15          | a été relancé       |
  