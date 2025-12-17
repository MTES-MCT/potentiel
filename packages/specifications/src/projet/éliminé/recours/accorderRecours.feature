# language: fr
@recours
Fonctionnalité: Accorder la demande de recours d'un projet éliminé

    Contexte:
        Etant donné le projet éliminé "Du boulodrome de Marseille" avec :
            | appel d'offres | PPE2 - Sol |

    Scénario: Un DGEC validateur accorde le recours d'un projet éliminé
        Etant donné une demande de recours en cours pour le projet éliminé
        Quand le DGEC validateur accorde le recours pour le projet éliminé
        Alors le recours du projet éliminé devrait être accordé
        Et le projet lauréat devrait être consultable
        Et le projet éliminé ne devrait plus être consultable
        Et les garanties financières actuelles ne devraient pas être consultables pour le projet lauréat
        Et des garanties financières devraient être attendues pour le projet lauréat avec :
            | motif | recours-accordé |
        Et une tâche "rappel des garanties financières à transmettre" est planifiée pour le projet lauréat
        Et un email a été envoyé à la dgec avec :
            | sujet      | Potentiel - Demande de recours accordée pour le projet Du boulodrome de Marseille .* |
            | nom_projet | Du boulodrome de Marseille                                                           |
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - Demande de recours accordée pour le projet Du boulodrome de Marseille .* |
            | nom_projet | Du boulodrome de Marseille                                                           |
        Et un email a été envoyé à la cre avec :
            | sujet      | Potentiel - Demande de recours accordée pour le projet Du boulodrome de Marseille .* |
            | nom_projet | Du boulodrome de Marseille                                                           |
        Mais aucun autre email n'a été envoyé
        Et l'attestation de désignation de la candidature ne devrait pas être régénérée

    Scénario: Un DGEC validateur accorde le recours en instruction d'un projet éliminé
        Etant donné une demande de recours en instruction pour le projet éliminé
        Quand le DGEC validateur accorde le recours pour le projet éliminé
        Alors le recours du projet éliminé devrait être accordé
        Et le projet lauréat devrait être consultable
        Et le projet éliminé ne devrait plus être consultable
        Et les garanties financières actuelles ne devraient pas être consultables pour le projet lauréat
        Et des garanties financières devraient être attendues pour le projet lauréat avec :
            | motif | recours-accordé |

    Scénario: Impossible d'accorder le recours d'un projet éliminé si le recours a déjà été accordé
        Etant donné une demande de recours accordée pour le projet éliminé
        Quand le DGEC validateur accorde le recours pour le projet éliminé
        Alors le DGEC validateur devrait être informé que "Le recours a déjà été accordé"

    Scénario: Impossible d'accorder le recours d'un projet éliminé si le recours a déjà été rejeté
        Etant donné une demande de recours rejetée pour le projet éliminé
        Quand le DGEC validateur accorde le recours pour le projet éliminé
        Alors le DGEC validateur devrait être informé que "Le recours a déjà été rejeté"

    Scénario: Impossible d'accorder le recours d'un projet éliminé si aucun recours n'a été demandé
        Quand le DGEC validateur accorde le recours pour le projet éliminé
        Alors le DGEC validateur devrait être informé que "Aucun recours n'est en cours"

    @select
    Scénario: Impossible d'accorder le recours d'un projet éliminé si le recours a déjà été annulé
        Etant donné une demande de recours annulée pour le projet éliminé
        Quand le DGEC validateur accorde le recours pour le projet éliminé
        Alors le DGEC validateur devrait être informé que "Le recours a déjà été annulé"
