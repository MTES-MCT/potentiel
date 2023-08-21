#Language: fr-FR
@select
Fonctionnalité: Valider un dépôt de garanties financières
    Contexte: 
        Etant donné le projet "Centrale éolienne 20"

    Scénario: Valider un dépôt de garanties financières initiales 
        Etant donné un dépôt de garanties financières pour le projet "Centrale éolienne 20" avec :
            | type                 | consignation          |
            | format               | application/pdf       |
            | contenu fichier      | nouveau contenu       |
            | date de constitution | 2023-01-01            |
            | date de dépôt        | 2023-10-01            |     
        Quand un utilisateur avec le rôle Dreal valide le dépôt de garanties financières pour le projet "Centrale éolienne 20"
        Alors les garanties financières devraient être consultables pour le projet "Centrale éolienne 20" avec : 
            | type                 | consignation          |
            | format               | application/pdf       |
            | contenu fichier      | nouveau contenu       |
            | date de constitution | 2023-01-01            |
        Et le fichier de l'attestation de garanties financières devrait être téléchargeable pour le projet "Centrale éolienne 20" avec :
            | format               | application/pdf       |
            | contenu fichier      | nouveau contenu       |
        Et le dépôt de garanties financières devrait être supprimé pour le projet "Centrale éolienne 20"    

    Scénario: Valider un dépôt pour un renouvellement de garanties financières
        Etant donné des garanties financières complètes pour le projet "Centrale éolienne 20" avec :
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
        Quand un utilisateur avec le rôle Dreal valide le dépôt de garanties financières pour le projet "Centrale éolienne 20"
        Alors les garanties financières devraient être consultables pour le projet "Centrale éolienne 20" avec : 
            | type                 | consignation          |
            | format               | application/pdf       |
            | contenu fichier      | nouveau contenu       |
            | date de constitution | 2023-01-01            |
        Et le fichier de l'attestation de garanties financières devrait être téléchargeable pour le projet "Centrale éolienne 20" avec :
            | format               | application/pdf       |
            | contenu fichier      | nouveau contenu       |
        Et le dépôt de garanties financières devrait être supprimé pour le projet "Centrale éolienne 20"    

    Scénario: Impossible de valider un dépôt inexistant
        Quand un utilisateur avec le rôle Dreal valide le dépôt de garanties financières pour le projet "Centrale éolienne 20"
        Alors l'utilisateur devrait être informé que "Le dépôt de garanties financières n'a pas été trouvé. Veuillez contacter un administrateur si le problème persiste."  

                       