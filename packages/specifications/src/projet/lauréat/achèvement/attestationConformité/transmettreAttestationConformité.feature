# language: fr
Fonctionnalité: Transmettre une attestation de conformité

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et le porteur "Marcel Patoulatchi" ayant accés au projet lauréat "Du boulodrome de Marseille"
        Et la dreal "Dreal du sud" associée au projet
        Et le DGEC validateur "Robert Robichet"

    Scénario: le porteur transmet une attestation de conformité pour le projet lauréat
        Quand le porteur transmet une attestation de conformité pour le projet lauréat "Du boulodrome de Marseille" avec :
            | format attestation                            | application/pdf             |
            | contenu attestation                           | le contenu de l'attestation |
            | date transmission au co-contractant           | 2024-01-01                  |
            | format preuve transmission au co-contractant  | application/pdf             |
            | contenu preuve transmission au co-contractant | le contenu de la preuve     |
            | date                                          | 2024-01-05                  |
        Alors une attestation de conformité devrait être consultable pour le projet "Du boulodrome de Marseille" avec :
            | format attestation                            | application/pdf             |
            | contenu attestation                           | le contenu de l'attestation |
            | date transmission au co-contractant           | 2024-01-01                  |
            | format preuve transmission au co-contractant  | application/pdf             |
            | contenu preuve transmission au co-contractant | le contenu de la preuve     |
            | date                                          | 2024-01-05                  |
            | utilisateur                                   | porteur                     |
        Et un email a été envoyé avec :
            | destinataire       | dreal                                                                                                                                     |
            | sujet              | Potentiel - Une attestation de conformité a été transmise pour le projet Du boulodrome de Marseille dans le département departementProjet |
            | nom_projet         | Du boulodrome de Marseille                                                                                                                |
            | departement_projet | departementProjet                                                                                                                         |
            | url                | https://potentiel.beta.gouv.fr/projet/PPE2%20-%20Eolien%231%23%2323/details.html                                                          |

        Et un email a été envoyé avec :
            | destinataire       | porteur                                                                                                                    |
            | sujet              | Potentiel - Mise à jour de la date d'achèvement du projet Du boulodrome de Marseille dans le département departementProjet |
            | nom_projet         | Du boulodrome de Marseille                                                                                                 |
            | departement_projet | departementProjet                                                                                                          |
            | url                | https://potentiel.beta.gouv.fr/projet/PPE2%20-%20Eolien%231%23%2323/details.html                                           |

    Scénario: Une tâche du type "échoir les garanties financières" est annulée quand une attestation de conformité est transmise
        Etant donné des garanties financières actuelles pour le projet "Du boulodrome de Marseille" avec :
            | type               | avec-date-échéance |
            | date d'échéance    | 2024-12-01         |
            | date de validation | 2024-11-24         |
        Quand le porteur transmet une attestation de conformité pour le projet lauréat "Du boulodrome de Marseille" avec :
            | date transmission au co-contractant | 2024-01-01 |
        Alors une tâche "échoir les garanties financières" n'est plus planifiée pour le projet "Du boulodrome de Marseille"

    Scénario: Une tâche du type "rappel échéance garanties financières à un mois" est annulée quand une attestation de conformité est transmise
        Etant donné des garanties financières actuelles pour le projet "Du boulodrome de Marseille" avec :
            | type               | avec-date-échéance |
            | date d'échéance    | 2024-12-01         |
            | date de validation | 2024-11-24         |
        Quand le porteur transmet une attestation de conformité pour le projet lauréat "Du boulodrome de Marseille" avec :
            | date transmission au co-contractant | 2024-01-01 |
        Alors une tâche "rappel échéance garanties financières à un mois" n'est plus planifiée pour le projet "Du boulodrome de Marseille"

    Scénario: Une tâche du type "rappel échéance garanties financières à deux mois" est annulée quand une attestation de conformité est transmise
        Etant donné des garanties financières actuelles pour le projet "Du boulodrome de Marseille" avec :
            | type               | avec-date-échéance |
            | date d'échéance    | 2024-12-01         |
            | date de validation | 2024-11-24         |
        Quand le porteur transmet une attestation de conformité pour le projet lauréat "Du boulodrome de Marseille" avec :
            | date transmission au co-contractant | 2024-01-01 |
        Alors une tâche "rappel échéance garanties financières à deux mois" n'est plus planifiée pour le projet "Du boulodrome de Marseille"

    Scénario: Impossible de transmettre une attestation de conformité si la date de transmission au co-contractant est dans le futur
        Quand le porteur transmet une attestation de conformité pour le projet lauréat "Du boulodrome de Marseille" avec :
            | date transmission au co-contractant | 2040-01-01 |
        Alors le porteur devrait être informé que "la date de transmission au co-contractant ne peut pas être une date future"

    Scénario: Impossible de transmettre une attestation de conformité si le projet a déjà une attestation de conformité
        Et une attestation de conformité transmise pour le projet "Du boulodrome de Marseille"
        Quand le porteur transmet une attestation de conformité pour le projet lauréat "Du boulodrome de Marseille" avec :
            | format attestation                            | application/pdf             |
            | contenu attestation                           | le contenu de l'attestation |
            | date transmission au co-contractant           | 2024-01-01                  |
            | format preuve transmission au co-contractant  | application/pdf             |
            | contenu preuve transmission au co-contractant | le contenu de la preuve     |
            | date                                          | 2024-01-05                  |
        Alors le porteur devrait être informé que "le projet a déjà une attestation de conformité"

    Scénario: Impossible de transmettre une attestation de conformité si le projet est éliminé
        Etant donné le projet éliminé "MIOS"
        Et le porteur "Jean-Pierre Vidol" ayant accés au projet éliminé "MIOS"
        Quand le porteur transmet une attestation de conformité pour le projet éliminé "MIOS" avec :
            | format attestation                            | application/pdf             |
            | contenu attestation                           | le contenu de l'attestation |
            | date transmission au co-contractant           | 2024-01-01                  |
            | format preuve transmission au co-contractant  | application/pdf             |
            | contenu preuve transmission au co-contractant | le contenu de la preuve     |
            | date                                          | 2024-01-05                  |
        Alors le porteur devrait être informé que "Il est impossible de transmettre une attestation de conformité pour un projet éliminé"

    Scénario: Impossible de transmettre une attestation de conformité si le projet est abandonné
        Etant donné un abandon accordé pour le projet lauréat
        Quand le porteur transmet une attestation de conformité pour le projet lauréat "Du boulodrome de Marseille" avec :
            | format attestation                            | application/pdf             |
            | contenu attestation                           | le contenu de l'attestation |
            | date transmission au co-contractant           | 2024-01-01                  |
            | format preuve transmission au co-contractant  | application/pdf             |
            | contenu preuve transmission au co-contractant | le contenu de la preuve     |
            | date                                          | 2024-01-05                  |
        Alors le porteur devrait être informé que "Il est impossible de transmettre une attestation de conformité pour un projet abandonné"
