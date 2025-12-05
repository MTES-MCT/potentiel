# language: fr
@abandon
Fonctionnalité: demander un porteur pour qu'il transmette une preuve de recandidature




# Contexte:
#     Etant donné le projet lauréat "Du boulodrome de Marseille"
#     Et un cahier des charges permettant la modification du projet

# Scénario: Demander la preuve de recandidature au porteur du projet
#     Etant donné un abandon accordé avec recandidature sans preuve transmise pour le projet lauréat
#     Quand le DGEC validateur demande au porteur du projet de transmettre une preuve de recandidature
#     Alors la preuve de recandidature a été demandée au porteur du projet lauréat

# TODO : Vérifier avec le métier pour supprimer carrément la partie recandidature
# Scénario: Impossible de demander à un porteur de projet qui a déjà transmis sa preuve de recandidature
#     Etant donné une demande d'abandon accordée avec recandidature avec preuve transmise pour le projet lauréat
#     Quand le DGEC validateur demande au porteur du projet de transmettre une preuve de recandidature
#     Alors le DGEC validateur devrait être informé que "La preuve de recandidature a déjà été transmise"

# Scénario: Impossible de demander à un porteur de projet si la date de demande dépasse le 30/06/2025
#     Etant donné un abandon accordé avec recandidature sans preuve transmise pour le projet lauréat
#     Quand le DGEC validateur demande au porteur du projet de transmettre une preuve de recandidature à la date du 01/07/2025
#     Alors le DGEC validateur devrait être informé que "Impossible de demander la preuve de recandidature au porteur après le 30/06/2025"