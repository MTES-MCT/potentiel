#Language: fr-FR

Fonctionnalité: Enregistrer l'attestation des garanties financières validées
    Contexte: 
        Etant donné le projet lauréat "Centrale PV"
    
    Scénario: Un porteur enregistre des garanties financières validées
        Etant donné des garanties financières importées avec l'attestation manquante pour le projet "Centrale PV" avec :
            | type                 | consignation           |
            | date d'échéance      |                        |
        Quand un porteur enregistre l'attestation des garanties financières validées pour le projet "Centrale PV" avec : 
            | format               | application/pdf        |
            | contenu fichier      | contenu fichier        |
            | date de constitution | 2023-06-12             |
            | date mise à jour     | 2024-03-01             |
        Alors les garanties financières validées devraient consultables pour le projet "Centrale PV" avec :
            | type                 | consignation           |
            | date d'échéance      |                        |
            | format               | application/pdf        |
            | contenu fichier      | contenu fichier        |
            | date de constitution | 2023-06-12             |
            | date de soumission   | 2023-11-01             |
            | soumis par           | porteur@test.test      |

    Scénario: Erreur si l'attestation est déjà présente
        Etant donné des garanties financières validées pour le projet "Centrale PV" avec :
            | format               | application/pdf        |
            | contenu fichier      | contenu fichier        |
            | date de constitution | 2023-06-12             |
        Quand un porteur enregistre l'attestation des garanties financières validées pour le projet "Centrale PV" avec : 
            | date de constitution | 2020-01-01             |
        Alors l'utilisateur devrait être informé que "Il y a déjà une attestation pour ces garanties financières"         

    Scénario: Erreur si la date de constitution est dans le futur
        Etant donné des garanties financières importées avec l'attestation manquante pour le projet "Centrale PV" avec :
            | type                 | consignation           |
        Quand un porteur enregistre l'attestation des garanties financières validées pour le projet "Centrale PV" avec : 
            | date de constitution | 2050-01-01             |
        Alors l'utilisateur devrait être informé que "La date de constitution des garanties financières ne peut pas être une date future"                     

    Scénario: Erreur si aucunes garanties financières validées ne sont trouvées    
        Quand un porteur enregistre l'attestation des garanties financières validées pour le projet "Centrale PV" avec : 
            | date de constitution | 2020-01-01             |
        Alors l'utilisateur devrait être informé que "Il n'y a aucunes garanties financières validées pour ce projet"          
