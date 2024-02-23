#Language: fr-FR
Fonctionnalité: Soumettre de nouvelles garanties financières
    Contexte: 
        Etant donné le projet lauréat "Centrale PV"
    @select
    Plan du Scénario: Un porteur soumet des garanties financières initiales
        Etant donné des garanties financières en attente pour le projet "Centrale PV" avec :
            | date limite de soumission | 2023-11-01 |
            | date de notification      | 2023-09-01 |
        Quand le porteur soumet des garanties financières pour le projet "Centrale PV" avec :
            | type                 | <type>                 |
            | date d'échéance      | <date d'échéance>      |
            | format               | <format du fichier>    |
            | contenu fichier      | <contenu du fichier>   |
            | date de constitution | <date de constitution> |
            | date de soumission   | 2023-10-01             |
            | soumis par           | porteur@test.test      |
        Alors les garanties financières devraient être consultables pour le projet "Centrale PV" avec :
            | type                 | <type>                 |
            | date d'échéance      | <date d'échéance>      |
            | format               | <format du fichier>    |
            | contenu fichier      | <contenu du fichier>   |
            | date de constitution | <date de constitution> |
            | date de soumission   | 2023-10-01             |
    Exemples:
            | type                      | date d'échéance | format du fichier | contenu du fichier    | date de constitution |
            | avec date d'échéance      | 2027-12-01      | application/pdf   | le contenu du fichier | 2023-06-01           |
            | consignation              |                 | application/pdf   | le contenu du fichier | 2023-06-01           |
            | six mois après achèvement |                 | application/pdf   | le contenu du fichier | 2023-06-01           |   

    # Plan du Scénario: Un porteur soumet de nouvelles garanties financières pour remplacer des garanties financières validées
    #     Etant donné des garanties financières validées pour le projet "Centrale PV" avec :
    #         | type                 | consignation          |
    #         | format               | application/pdf       |
    #         | contenu fichier      | contenu               |
    #         | date de constitution | 2023-01-01            |
    #         | date de validation   | 2023-01-01            |  
    #     Quand le porteur soumet des garanties financières pour le projet "Centrale PV" avec :
    #         | type                 | <type>                 |
    #         | date d'échéance      | <date d'échéance>      |
    #         | format               | <format du fichier>    |
    #         | contenu fichier      | <contenu du fichier>   |
    #         | date de constitution | <date de constitution> |
    #         | date de soumission   | 2023-10-01             |
    #         | soumis par           | porteur@test.test      |
    #     Alors les garanties financières devraient être consultables pour le projet "Centrale PV" avec :
    #         | type                 | <type>                 |
    #         | date d'échéance      | <date d'échéance>      |
    #         | format               | <format du fichier>    |
    #         | contenu fichier      | <contenu du fichier>   |
    #         | date de constitution | <date de constitution> |
    #         | date de soumission   | 2023-10-01             |
    #         | région               | Corse                  |
    # Exemples:
    #         | type                    | date d'échéance | format du fichier | contenu du fichier    | date de constitution |
    #         | avec date d'échéance    | 2027-12-01      | application/pdf   | le contenu du fichier | 2023-06-01           |
    #         | consignation            |                 | application/pdf   | le contenu du fichier | 2023-06-01           |
    #         | six mois après achèvement |                 | application/pdf   | le contenu du fichier | 2023-06-01           |  
    @select
    Scénario: Erreur si date de constitution dans le futur
        Quand le porteur soumet des garanties financières pour le projet "Centrale PV" avec :
            | date de constitution | 2055-01-01 |
        Alors l'utilisateur devrait être informé que "La date de constitution des garanties financières ne peut pas être une date future" 
    @select
    Scénario: Erreur si date de d'échéance manquante
        Quand le porteur soumet des garanties financières pour le projet "Centrale PV" avec :
            | type          | avec date d'échéance |     
            | dateÉchéance  |                      |     
        Alors l'utilisateur devrait être informé que "Vous devez renseigner la date d'échéance pour ce type de garanties financières" 
 
    # Plan du Scénario: Erreur si date de d'échéance non compatible avec le type
    #     Quand le porteur soumet des garanties financières pour le projet "Centrale éolienne 20" avec un type non compatible avec une date d'échéance, avec : 
    #     | type | <type> |   
    #     Alors l'utilisateur devrait être informé que "Vous ne pouvez pas ajouter une date d'échéance pour le type de garanties financières renseigné"
    # Exemples:
    #         | type                    |
    #         | consignation            |
    #         | six mois après achèvement |
    @select
    Scénario: Erreur si un dépôt a déjà été soumis
        Etant donné des garanties financières à traiter pour le projet "Centrale PV" avec :
            | type                 | avec date d'échéance          |
            | date d'échéance      | 2027-12-01                    |
         Quand le porteur soumet des garanties financières pour le projet "Centrale PV" avec :
            | type                 | consignation                  |          
        Alors l'utilisateur devrait être informé que "Il y a déjà des garanties financières en attente de validation pour ce projet"              
