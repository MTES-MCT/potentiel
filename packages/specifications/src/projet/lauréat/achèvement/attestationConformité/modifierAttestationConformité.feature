#Language: fr-FR
Fonctionnalité: Modifier une attestation de conformité
    Contexte: 
        Etant donné le projet lauréat "Centrale PV"

    Scénario: Un porteur modifie une attestation de conformité
        Et le projet "Centrale PV" avec une attestation de conformité transmise
        Quand un admin modifie l'attestation de conformité pour le projet "Centrale PV" avec : 
            | format attestation                            | application/pdf                     |
            | contenu attestation                           | le nouveau contenu de l'attestation |
            | date transmission au co-contractant           | 2024-01-02                          |
            | format preuve transmission au co-contractant  | application/pdf                     |
            | contenu preuve transmission au co-contractant | le nouveau contenu de la preuve     |
            | date                                          | 2024-01-07                          |
            | utilisateur                                   | admin@test.test                     |
        Alors une attestation de conformité devrait être consultable pour le projet "Centrale PV" avec :
            | format attestation                            | application/pdf                     |
            | contenu attestation                           | le nouveau contenu de l'attestation |
            | date transmission au co-contractant           | 2024-01-02                          |
            | format preuve transmission au co-contractant  | application/pdf                     |
            | contenu preuve transmission au co-contractant | le nouveau contenu de la preuve     |
            | date                                          | 2024-01-07                          |
            | utilisateur                                   | admin@test.test                     |

    Scénario: Erreur si la date de transmission au co-contractant est dans le futur
        Et le projet "Centrale PV" avec une attestation de conformité transmise
        Quand un admin modifie l'attestation de conformité pour le projet "Centrale PV" avec : 
            | date transmission au co-contractant           | 2040-01-01                  |
        Alors le porteur devrait être informé que "la date de transmission au co-contractant ne peut pas être une date future"   

    Scénario: Erreur si le projet n'a pas d'attestation de conformité à modifier
        Quand un admin modifie l'attestation de conformité pour le projet "Centrale PV" avec : 
            | format attestation                            | application/pdf             |
            | contenu attestation                           | le contenu de l'attestation |
            | date transmission au co-contractant           | 2024-01-01                  |
            | format preuve transmission au co-contractant  | application/pdf             |
            | contenu preuve transmission au co-contractant | le contenu de la preuve     |
            | date                                          | 2024-01-05                  |
            | utilisateur                                   | admin@test.test             |
        Alors le porteur devrait être informé que "Aucune attestation de conformité à modifier n'a été trouvée"                  
    
        
