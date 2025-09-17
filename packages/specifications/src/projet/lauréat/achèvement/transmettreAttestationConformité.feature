# language: fr
@achèvement
Fonctionnalité: Transmettre une attestation de conformité

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et un cahier des charges permettant la modification du projet
        Et la dreal "Dreal du sud" associée à la région du projet

    Scénario: le porteur transmet une attestation de conformité pour le projet lauréat
        Quand le porteur transmet une attestation de conformité pour le projet lauréat
        Alors une attestation de conformité devrait être consultable pour le projet lauréat
        Et un email a été envoyé à la dreal avec :
            | sujet      | Potentiel - Une attestation de conformité a été transmise pour le projet Du boulodrome de Marseille dans le département(.*) |
            | nom_projet | Du boulodrome de Marseille                                                                                                  |
            | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                                       |
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - Mise à jour de la date d'achèvement du projet Du boulodrome de Marseille dans le département(.*) |
            | nom_projet | Du boulodrome de Marseille                                                                                   |
            | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                        |

    Scénario: Une tâche du type "échoir les garanties financières" est annulée quand une attestation de conformité est transmise
        Etant donné des garanties financières actuelles pour le projet lauréat avec :
            | type GF            | avec-date-échéance |
            | date d'échéance    | 2050-12-01         |
            | date de validation | 2024-11-24         |
        Quand le porteur transmet une attestation de conformité pour le projet lauréat
        Alors une tâche "échoir les garanties financières" n'est plus planifiée pour le projet lauréat

    Scénario: Une tâche du type "rappel échéance garanties financières à un mois" est annulée quand une attestation de conformité est transmise
        Etant donné des garanties financières actuelles pour le projet lauréat avec :
            | type GF            | avec-date-échéance |
            | date d'échéance    | 2050-12-01         |
            | date de validation | 2024-11-24         |
        Quand le porteur transmet une attestation de conformité pour le projet lauréat
        Alors une tâche "rappel échéance garanties financières à un mois" n'est plus planifiée pour le projet lauréat

    Scénario: Une tâche du type "rappel échéance garanties financières à deux mois" est annulée quand une attestation de conformité est transmise
        Etant donné des garanties financières actuelles pour le projet lauréat avec :
            | type GF            | avec-date-échéance |
            | date d'échéance    | 2050-12-01         |
            | date de validation | 2024-11-24         |
        Quand le porteur transmet une attestation de conformité pour le projet lauréat
        Alors une tâche "rappel échéance garanties financières à deux mois" n'est plus planifiée pour le projet lauréat

    Scénario: le porteur transmet une attestation de conformité pour un appel d'offres le cahier des charges ne le permet pas
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offre | CRE4 - Sol |
            | période       | 7          |
        Quand le porteur transmet une attestation de conformité pour le projet lauréat
        Alors une attestation de conformité devrait être consultable pour le projet lauréat

    Scénario: Impossible de transmettre une attestation de conformité si la date de transmission au co-contractant est dans le futur
        Quand le porteur transmet une attestation de conformité pour le projet lauréat avec :
            | date transmission au co-contractant | 2040-01-01 |
        Alors le porteur devrait être informé que "la date de transmission au co-contractant ne peut pas être une date future"

    Scénario: Impossible de transmettre une attestation de conformité si le projet a déjà une attestation de conformité
        Et une attestation de conformité transmise pour le projet lauréat
        Quand le porteur transmet une attestation de conformité pour le projet lauréat
        Alors le porteur devrait être informé que "le projet a déjà une attestation de conformité"

    Scénario: Impossible de transmettre une attestation de conformité si le projet est éliminé
        Etant donné le projet éliminé "MIOS"
        Quand le porteur transmet une attestation de conformité pour le projet éliminé
        Alors le porteur devrait être informé que "Le projet lauréat n'existe pas"

    Scénario: Impossible de transmettre une attestation de conformité si le projet est abandonné
        Etant donné un abandon accordé pour le projet lauréat
        Quand le porteur transmet une attestation de conformité pour le projet lauréat
        Alors le porteur devrait être informé que "Impossible de faire un changement pour un projet abandonné"
