#Language: fr-FR
Fonctionnalité: Relancer un porteur pour qu'il transmette une preuve de recandidature
  Contexte:
    Etant donné le projet lauréat "Du boulodrome de Marseille"

  @select
  Plan du scénario: Le porteur du projet est relancé trimestriellement si sa demande d'abandon avec recandidature a été accordé et qu'il n'a pas transmis de preuve de recandidature
    Etant donné un abandon accordé avec recandidature il y a "<Nombre mois>" mois sans preuve transmise pour le projet lauréat "Du boulodrome de Marseille"
    Quand le DGEC validateur relance le porteur du projet "Du boulodrome de Marseille" pour qu'il transmette une preuve de recandidature
    Alors le porteur du projet "Du boulodrome de Marseille" "<État de la relance>" concernant la transmission de la preuve de recandidature

    Exemples:
      | Nombre mois | État de la relance  |
      | 3           | a été relancé       |
      | 2           | n'a pas été relancé |
      | 0           | n'a pas été relancé |
      | 9           | a été relancé       |
      | 6           | a été relancé       |
      | 11          | n'a pas été relancé |
      | 15          | a été relancé       |

  @select
  Plan du scénario: Impossible de relancer un porteur de projet qui a déjà transmis sa preuve de recandidature
    Etant donné un abandon accordé avec recandidature il y a "<Nombre mois>" mois avec preuve transmise pour le projet lauréat "Du boulodrome de Marseille"
    Quand le DGEC validateur relance le porteur du projet "Du boulodrome de Marseille" pour qu'il transmette une preuve de recandidature
    Alors le porteur du projet "Du boulodrome de Marseille" "n'a pas été relancé" concernant la transmission de la preuve de recandidature

    Exemples:
      | Nombre mois | 
      | 3           | 
      | 2           | 
      | 0           | 
      | 9           | 
      | 6           | 
      | 11          | 
      | 15          |       
  
  Scénario: Impossible de relancer un porteur de projet si la date de relance dépasse le 31/03/2025
  Etant donné un abandon accordé avec recandidature pour le projet lauréat "Du boulodrome de Marseille"
  Quand le DGEC validateur relance à la date du "2025-04-01" le porteur du projet "Du boulodrome de Marseille" pour qu'il transmettre une preuve de recandidature
  Alors le DGEC validateur devrait être informé que "Impossible de relancer le porteur après la date légale du 31/03/2025"