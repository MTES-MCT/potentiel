#Language: fr-FR
Fonctionnalité: Notifier un dépôt de garanties financières validé
    Contexte: 
        Etant donné le projet "Centrale éolienne 20" associé à deux porteurs de projets

    Scénario: Notifier un dépôt de garanties financières initiales validé
        Etant donné un dépôt de garanties financières pour le projet "Centrale éolienne 20" avec :
            | type                 | consignation          |
            | format               | application/pdf       |
            | contenu fichier      | nouveau contenu       |
            | date de constitution | 2023-01-01            |
            | date de dépôt        | 2023-10-01            | 
        Quand un utilisateur avec le rôle Dreal valide le dépôt de garanties financières pour le projet "Centrale éolienne 20"
        Alors tous les porteurs du projet devraient être notifiés que le dépôt de garanties financières pour le projet "Centrale éolienne 20" a été validé

    Scénario: Notifier un dépôt pour un renouvellement de garanties financières validé
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
        Alors tous les porteurs du projet devraient être notifiés que le dépôt de garanties financières pour le projet "Centrale éolienne 20" a été validé        