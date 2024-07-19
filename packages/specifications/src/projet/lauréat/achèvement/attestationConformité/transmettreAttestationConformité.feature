# language: fr
Fonctionnalité: Transmettre une attestation de conformité

    Contexte:
        Etant donné le projet lauréat "Centrale PV"

    Scénario: Un porteur transmet une attestation de conformité
        Quand un porteur transmet une attestation de conformité pour le projet "Centrale PV" avec :
            | format attestation                            | application/pdf             |
            | contenu attestation                           | le contenu de l'attestation |
            | date transmission au co-contractant           | 2024-01-01                  |
            | format preuve transmission au co-contractant  | application/pdf             |
            | contenu preuve transmission au co-contractant | le contenu de la preuve     |
            | date                                          | 2024-01-05                  |
            | utilisateur                                   | porteur@test.test           |
        Alors une attestation de conformité devrait être consultable pour le projet "Centrale PV" avec :
            | format attestation                            | application/pdf             |
            | contenu attestation                           | le contenu de l'attestation |
            | date transmission au co-contractant           | 2024-01-01                  |
            | format preuve transmission au co-contractant  | application/pdf             |
            | contenu preuve transmission au co-contractant | le contenu de la preuve     |
            | date                                          | 2024-01-05                  |
            | utilisateur                                   | porteur@test.test           |

    Scénario: Impossible de transmettre une attestation de conformité si la date de transmission au co-contractant est dans le futur
        Quand un porteur transmet une attestation de conformité pour le projet "Centrale PV" avec :
            | date transmission au co-contractant | 2040-01-01 |
        Alors le porteur devrait être informé que "la date de transmission au co-contractant ne peut pas être une date future"

    Scénario: Impossible de transmettre une attestation de conformité si le projet a déjà une attestation de conformité
        Et une attestation de conformité transmise pour le projet "Centrale PV"
        Quand un porteur transmet une attestation de conformité pour le projet "Centrale PV" avec :
            | format attestation                            | application/pdf             |
            | contenu attestation                           | le contenu de l'attestation |
            | date transmission au co-contractant           | 2024-01-01                  |
            | format preuve transmission au co-contractant  | application/pdf             |
            | contenu preuve transmission au co-contractant | le contenu de la preuve     |
            | date                                          | 2024-01-05                  |
            | utilisateur                                   | porteur@test.test           |
        Alors le porteur devrait être informé que "le projet a déjà une attestation de conformité"

    # À vérifier côté métier
    @NotImplemented
    Scénario: Impossible de transmettre une attestation de conformité si le projet dispose de garanties financières échues

