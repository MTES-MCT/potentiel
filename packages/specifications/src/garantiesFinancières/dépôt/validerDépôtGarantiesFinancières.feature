#Language: fr-FR

Fonctionnalité: Valider un dépôt de garanties financières
    Contexte: 
        Etant donné le projet "Centrale éolienne 20" de la région "Nouvelle-Aquitaine"
    
    Scénario: Valider un dépôt de garanties financières initiales 
        Etant donné des garanties financières à déposer pour le projet "Centrale éolienne 20" avec :
            | date limite de dépôt | 2023-11-01            |
        Et des porteurs associés au projet "Centrale éolienne 20" avec :
            | name         | email              |
            | Porteur 1    | porteur1@test.test |
            | Porteur 2    | porteur2@test.test |
        Et un dépôt de garanties financières pour le projet "Centrale éolienne 20" avec :
            | type                 | consignation          |
            | format               | application/pdf       |
            | contenu fichier      | nouveau contenu       |
            | date de constitution | 2023-01-01            |
            | date de dépôt        | 2023-10-01            |     
        Quand un utilisateur avec le rôle Dreal valide le dépôt de garanties financières pour le projet "Centrale éolienne 20" avec :
            | type                 | consignation          |
            | format               | application/pdf       |
            | contenu fichier      | nouveau contenu       |
            | date de constitution | 2023-01-01            |
        Alors les garanties financières devraient être consultables pour le projet "Centrale éolienne 20" avec : 
            | type                 | consignation          |
            | format               | application/pdf       |
            | contenu fichier      | nouveau contenu       |
            | date de constitution | 2023-01-01            |
        Et le fichier de l'attestation de garanties financières devrait être téléchargeable pour le projet "Centrale éolienne 20" avec :
            | format               | application/pdf       |
            | contenu fichier      | nouveau contenu       |
        Et le dépôt de garanties financières devrait être supprimé pour le projet "Centrale éolienne 20"  
        Et il devrait y avoir un dépôt de garanties financières "validé" pour le projet "Centrale éolienne 20" avec :
            | date limite de dépôt | 2023-11-01            |
            | région               | Nouvelle-Aquitaine    |  
        Et les porteurs du projet devraient être notifiés que le dépôt de garanties financières pour le projet "Centrale éolienne 20" a été validé avec : 
            | name      | email              | 
            | Porteur 1 | porteur1@test.test | 
            | Porteur 2 | porteur2@test.test |    

    Scénario: Valider un dépôt pour un renouvellement de garanties financières
        Etant donné des porteurs associés au projet "Centrale éolienne 20" avec :
            | name         | email              |
            | Porteur 1    | porteur1@test.test |
            | Porteur 2    | porteur2@test.test |
        Et des garanties financières complètes pour le projet "Centrale éolienne 20" avec :
            | type                 | avec date d'échéance  |
            | date d'échéance      | 2027-12-01            |
            | format               | application/pdf       |
            | date de constitution | 2020-12-02            | 
            | contenu fichier      | le contenu            |  
        Et un dépôt de garanties financières pour le projet "Centrale éolienne 20" avec :
            | type                 | consignation          |
            | format               | application/pdf       |
            | contenu fichier      | nouveau contenu       |
            | date de constitution | 2023-01-01            |
            | date de dépôt        | 2023-10-01            |     
        Quand un utilisateur avec le rôle Dreal valide le dépôt de garanties financières pour le projet "Centrale éolienne 20" avec :
            | type                 | consignation          |
            | format               | application/pdf       |
            | contenu fichier      | nouveau contenu       |
            | date de constitution | 2023-01-01            |
        Alors les garanties financières devraient être consultables pour le projet "Centrale éolienne 20" avec : 
            | type                 | consignation          |
            | format               | application/pdf       |
            | contenu fichier      | nouveau contenu       |
            | date de constitution | 2023-01-01            |
        Et le fichier de l'attestation de garanties financières devrait être téléchargeable pour le projet "Centrale éolienne 20" avec :
            | format               | application/pdf       |
            | contenu fichier      | nouveau contenu       |
        Et le dépôt de garanties financières devrait être supprimé pour le projet "Centrale éolienne 20"
        Et les porteurs du projet devraient être notifiés que le dépôt de garanties financières pour le projet "Centrale éolienne 20" a été validé avec : 
            | name      | email              | 
            | Porteur 1 | porteur1@test.test | 
            | Porteur 2 | porteur2@test.test |    