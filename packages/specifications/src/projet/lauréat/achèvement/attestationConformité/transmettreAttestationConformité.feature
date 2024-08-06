# language: fr
Fonctionnalité: Transmettre une attestation de conformité

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"

    Scénario: Un porteur transmet une attestation de conformité
        Quand un porteur transmet une attestation de conformité pour le projet "Du boulodrome de Marseille" avec :
            | format attestation                            | application/pdf             |
            | contenu attestation                           | le contenu de l'attestation |
            | date transmission au co-contractant           | 2024-01-01                  |
            | format preuve transmission au co-contractant  | application/pdf             |
            | contenu preuve transmission au co-contractant | le contenu de la preuve     |
            | date                                          | 2024-01-05                  |
            | utilisateur                                   | porteur@test.test           |
        Alors une attestation de conformité devrait être consultable pour le projet "Du boulodrome de Marseille" avec :
            | format attestation                            | application/pdf             |
            | contenu attestation                           | le contenu de l'attestation |
            | date transmission au co-contractant           | 2024-01-01                  |
            | format preuve transmission au co-contractant  | application/pdf             |
            | contenu preuve transmission au co-contractant | le contenu de la preuve     |
            | date                                          | 2024-01-05                  |
            | utilisateur                                   | porteur@test.test           |

    Scénario: Une tâche du type "échoir les garanties financières" est annulée quand une attestation de conformité est transmise
        Etant donné des garanties financières actuelles pour le projet "Du boulodrome de Marseille" avec :
            | type               | avec-date-échéance |
            | date d'échéance    | 2024-12-01         |
            | date de validation | 2024-11-24         |
        Quand un porteur transmet une attestation de conformité pour le projet "Du boulodrome de Marseille" avec :
            | date transmission au co-contractant | 2024-01-01 |
        Alors une tâche "échoir les garanties financières" n'est plus planifiée pour le projet "Du boulodrome de Marseille"

    Scénario: Une tâche du type "rappel échéance garanties financières à un mois" est annulée quand une attestation de conformité est transmise
        Etant donné des garanties financières actuelles pour le projet "Du boulodrome de Marseille" avec :
            | type               | avec-date-échéance |
            | date d'échéance    | 2024-12-01         |
            | date de validation | 2024-11-24         |
        Quand un porteur transmet une attestation de conformité pour le projet "Du boulodrome de Marseille" avec :
            | date transmission au co-contractant | 2024-01-01 |
        Alors une tâche "rappel échéance garanties financières à un mois" n'est plus planifiée pour le projet "Du boulodrome de Marseille"

    Scénario: Une tâche du type "rappel échéance garanties financières à deux mois" est annulée quand une attestation de conformité est transmise
        Etant donné des garanties financières actuelles pour le projet "Du boulodrome de Marseille" avec :
            | type               | avec-date-échéance |
            | date d'échéance    | 2024-12-01         |
            | date de validation | 2024-11-24         |
        Quand un porteur transmet une attestation de conformité pour le projet "Du boulodrome de Marseille" avec :
            | date transmission au co-contractant | 2024-01-01 |
        Alors une tâche "rappel échéance garanties financières à deux mois" n'est plus planifiée pour le projet "Du boulodrome de Marseille"

    Scénario: Impossible de transmettre une attestation de conformité si la date de transmission au co-contractant est dans le futur
        Quand un porteur transmet une attestation de conformité pour le projet "Du boulodrome de Marseille" avec :
            | date transmission au co-contractant | 2040-01-01 |
        Alors le porteur devrait être informé que "la date de transmission au co-contractant ne peut pas être une date future"

    Scénario: Impossible de transmettre une attestation de conformité si le projet a déjà une attestation de conformité
        Et une attestation de conformité transmise pour le projet "Du boulodrome de Marseille"
        Quand un porteur transmet une attestation de conformité pour le projet "Du boulodrome de Marseille" avec :
            | format attestation                            | application/pdf             |
            | contenu attestation                           | le contenu de l'attestation |
            | date transmission au co-contractant           | 2024-01-01                  |
            | format preuve transmission au co-contractant  | application/pdf             |
            | contenu preuve transmission au co-contractant | le contenu de la preuve     |
            | date                                          | 2024-01-05                  |
            | utilisateur                                   | porteur@test.test           |
        Alors le porteur devrait être informé que "le projet a déjà une attestation de conformité"

    # Ce cas ne peut pas être implémenté à date car nous n'avons pas accès à l'aggréagat candidature (projet)
    @NotImplemented
    Scénario: Impossible de transmettre une attestation de conformité si le projet est éliminé


    # Ce cas ne peut pas être implémenté à date car nous n'avons pas accès à l'aggréagat candidature (projet)
    @NotImplemented
    Scénario: Impossible de transmettre une attestation de conformité si le projet est abandonné

