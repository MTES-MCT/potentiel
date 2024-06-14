#Language: fr-FR
Fonctionnalité: Soumettre de nouvelles garanties financières
    Contexte: 
        Etant donné le projet lauréat "Centrale PV"

    Plan du Scénario: Un porteur soumet des garanties financières initiales
        Etant donné des garanties financières en attente pour le projet "Centrale PV" avec :
            | date limite de soumission | 2023-11-01                      |
            | date de notification      | 2023-09-01                      |
            | motif                     | motif-inconnu                   |
        Quand le porteur soumet des garanties financières pour le projet "Centrale PV" avec :
            | type                 | <type>                 |
            | date d'échéance      | <date d'échéance>      |
            | format               | <format du fichier>    |
            | contenu fichier      | <contenu du fichier>   |
            | date de constitution | <date de constitution> |
            | date de soumission   | <date de soumission>   |
            | soumis par           | porteur@test.test      |
        Alors les garanties financières à traiter devraient être consultables pour le projet "Centrale PV" avec :
            | type                         | <type>                 |
            | date d'échéance              | <date d'échéance>      |
            | format                       | <format du fichier>    |
            | contenu fichier              | <contenu du fichier>   |
            | date de constitution         | <date de constitution> |
            | date de soumission           | <date de soumission>   |
            | soumis par                   | porteur@test.test      |
            | date de dernière mise à jour | <date de soumission>   |
        Et les garanties financières en attente du projet "Centrale PV" ne devraient plus être consultable dans la liste des garanties financières en attente
    Exemples:
            | type                      | date d'échéance | format du fichier | contenu du fichier    | date de constitution | date de soumission |
            | avec-date-échéance        | 2027-12-01      | application/pdf   | le contenu du fichier | 2023-06-01           | 2023-10-01         |
            | consignation              |                 | application/pdf   | le contenu du fichier | 2023-06-01           | 2023-10-01         |
            | six-mois-après-achèvement |                 | application/pdf   | le contenu du fichier | 2023-06-01           | 2023-10-01         | 
    
    Scénario: Impossible de soumettre de nouvelles garanties financières si date de constitution dans le futur
        Quand le porteur soumet des garanties financières pour le projet "Centrale PV" avec :
            | date de constitution | 2055-01-01 |
        Alors l'utilisateur devrait être informé que "La date de constitution des garanties financières ne peut pas être une date future" 
    
    Scénario: Impossible de soumettre de nouvelles garanties financières si date d'échéance manquante
        Quand le porteur soumet des garanties financières pour le projet "Centrale PV" avec :
            | type          | avec-date-échéance   |     
            | dateÉchéance  |                      |     
        Alors l'utilisateur devrait être informé que "Vous devez renseigner la date d'échéance pour ce type de garanties financières" 
    
    Plan du Scénario: Impossible de soumettre de nouvelles garanties financières si date d'échéance non compatible avec le type
        Quand le porteur soumet des garanties financières pour le projet "Centrale PV" avec :
            | type | <type>                |   
            | date d'échéance | 2028-01-01 |   
        Alors l'utilisateur devrait être informé que "Vous ne pouvez pas renseigner de date d'échéance pour ce type de garanties financières"
    Exemples:
            | type                      |
            | consignation              |
            | six-mois-après-achèvement |
    
    Scénario: Impossible de soumettre de nouvelles garanties financières si un dépôt a déjà été soumis
        Etant donné des garanties financières à traiter pour le projet "Centrale PV" avec :
            | type                 | avec-date-échéance  |
            | date d'échéance      | 2027-12-01          |
         Quand le porteur soumet des garanties financières pour le projet "Centrale PV" avec :
            | type                 | consignation        |          
        Alors l'utilisateur devrait être informé que "Il y a déjà des garanties financières en attente de validation pour ce projet"   

    Scénario: Impossible de soumettre de nouvelles garanties financières si une demande de mainlevée a été demandée    
        Etant donné le projet "Centrale PV" avec une attestation de conformité transmise
        Et des garanties financières validées pour le projet "Centrale PV"    
        Et une demande de mainlevée de garanties financières pour le projet "Centrale PV" avec :
            | motif                | projet-achevé          |              
         Quand le porteur soumet des garanties financières pour le projet "Centrale PV" avec :
            | type                 | consignation        |          
        Alors l'utilisateur devrait être informé que "Vous ne pouvez pas déposer de nouvelles garanties financières car vous avez une demande de mainlevée de garanties financières en cours"  

    Scénario: Impossible de soumettre de nouvelles garanties financières si une demande de mainlevée est en instruction    
        Etant donné le projet "Centrale PV" avec une attestation de conformité transmise
        Et des garanties financières validées pour le projet "Centrale PV"      
        Et une demande de mainlevée de garanties financières en instruction pour le projet "Centrale PV"
        Quand le porteur soumet des garanties financières pour le projet "Centrale PV" avec :
            | type                 | consignation        |          
        Alors l'utilisateur devrait être informé que "Vous ne pouvez pas déposer de nouvelles garanties financières car vous avez une mainlevée de garanties financières en cours d'instruction"          