#Language: fr-FR
Fonctionnalité: demander un porteur pour qu'il transmette une preuve de recandidature
  Contexte:
    Etant donné le projet lauréat "Du boulodrome de Marseille"

  @select
  Scénario: Demander la preuve de recandidature au porteur du projet 
    Etant donné un abandon accordé avec recandidature sans preuve transmise pour le projet lauréat "Du boulodrome de Marseille"
    Quand le DGEC validateur demande au porteur du projet "Du boulodrome de Marseille" de transmettre une preuve de recandidature
    Alors la preuve de recandidature a été demandée au porteur du projet "Du boulodrome de Marseille"

  @select
  Scénario: Impossible de demander un porteur de projet qui a déjà transmis sa preuve de recandidature
    Etant donné un abandon accordé avec recandidature avec preuve transmise pour le projet lauréat "Du boulodrome de Marseille"
    Quand le DGEC validateur demande au porteur du projet "Du boulodrome de Marseille" de transmettre une preuve de recandidature
    Alors la preuve de recandidature n'a pas été demandée au porteur du projet "Du boulodrome de Marseille" 
  
  @select
  Scénario: Impossible de demander un porteur de projet si la date de demande dépasse le 31/03/2025
  Etant donné un abandon accordé avec recandidature pour le projet lauréat "Du boulodrome de Marseille"
  Quand le DGEC validateur demande au porteur du projet "Du boulodrome de Marseille" de transmette une preuve de recandidature à la date du "2025-04-01"
  Alors le DGEC validateur devrait être informé que "Impossible de demander la preuve de recandidature au porteur après la date légale du 31/03/2025"