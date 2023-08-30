#Language: fr-FR
@select
Fonctionnalité: Modifier le dépôt de garanties financières en attente de validation dans Potentiel
    Contexte: 
        Etant donné le projet "Centrale éolienne 20" de la région "Nouvelle-Aquitaine"

    Scénario: Modifier un dépôt existant
        Etant donné un dépôt de garanties financières pour le projet "Centrale éolienne 20" avec :
            | type                 | avec date d'échéance          |
            | date d'échéance      | 2027-12-01                    |
            | format               | application/pdf               |
            | contenu fichier      | le contenu du fichier         |
            | date de constitution | 2021-12-01                    |
            | date de dépôt        | 2023-08-11                    |     
        Quand un utilisateur avec le rôle 'porteur-projet' modifie un dépôt de garanties financières pour le projet "Centrale éolienne 20" avec :
            | type                 | consignation                  |
            | format               | application/pdf               |
            | contenu fichier      | le nouveau contenu du fichier |
            | date de constitution | 2022-01-01                    | 
            | date de modification | 2023-08-28                    | 
        Alors le dépôt de garanties financières devrait être mis à jour pour le projet "Centrale éolienne 20" avec :   
            | type                       | consignation                  |
            | format                     | application/pdf               |
            | contenu fichier            | le nouveau contenu du fichier |
            | date de constitution       | 2022-01-01                    |
            | date de dépôt              | 2023-08-11                    |  
            | date dernière modification | 2023-08-28                    |
            | région                     | Nouvelle-Aquitaine            |


    Scénario: Modifier un dépôt après sa migration
        Etant donné un dépôt de garanties financières migré pour le projet "Centrale éolienne 20" avec :
            | date d'échéance      | 2027-12-01                    |
            | format               | application/pdf               |
            | contenu fichier      | le contenu du fichier         |
            | date de constitution | 2021-12-01                    |
            | date de dépôt        | 2023-08-11                    |     
        Quand un utilisateur avec le rôle 'porteur-projet' modifie un dépôt de garanties financières pour le projet "Centrale éolienne 20" avec :
            | type                 | consignation                  |
            | format               | application/pdf               |
            | contenu fichier      | le nouveau contenu du fichier |
            | date de constitution | 2022-01-01                    |
            | date de modification | 2023-08-28                    |
        Alors le dépôt de garanties financières devrait être mis à jour pour le projet "Centrale éolienne 20" avec :   
            | type                       | consignation                  |
            | format                     | application/pdf               |
            | contenu fichier            | le nouveau contenu du fichier |
            | date de constitution       | 2022-01-01                    |
            | date de dépôt              | 2023-08-11                    |   
            | date dernière modification | 2023-08-28                    |        
            | région                     | Nouvelle-Aquitaine            | 

    Scénario: Erreur si modification d'un dépôt non trouvé  
        Quand un utilisateur avec le rôle 'porteur-projet' modifie un dépôt de garanties financières pour le projet "Centrale éolienne 20" avec :
            | type                 | consignation                  |
            | format               | application/pdf               |
            | contenu fichier      | le nouveau contenu du fichier |
            | date de constitution | 2022-01-01                    |
            | date de modification | 2023-08-28                    | 
        Alors l'utilisateur devrait être informé que "Le dépôt de garanties financières n'a pas été trouvé pour ce projet. Veuillez contacter un administrateur si le problème persiste."

    Scénario: Erreur si date de constitution dans le futur
        Etant donné un dépôt de garanties financières pour le projet "Centrale éolienne 20" avec :
            | type                 | avec date d'échéance   |
            | date d'échéance      | 2027-12-01             |
            | format               | application/pdf        |
            | contenu fichier      | le contenu du fichier  |
            | date de constitution | 2021-12-01             |
            | date de dépôt        | 2023-08-11             |  
        Quand un utilisateur avec le rôle 'porteur-projet' modifie un dépôt de garanties financières pour le projet "Centrale éolienne 20" avec :
            | type                 | avec date d'échéance   |
            | date d'échéance      | 2027-12-01             |
            | format               | application/pdf        |
            | contenu fichier      | le contenu du fichier  |
            | date de constitution | 2050-12-01             |
            | date de modification | 2023-08-28             | 
        Alors l'utilisateur devrait être informé que "La date de constitution des garanties financières ne peut pas être une date future" 
   
    Scénario: Erreur si date de d'échéance manquante
        Etant donné un dépôt de garanties financières pour le projet "Centrale éolienne 20" avec :
            | type                 | avec date d'échéance   |
            | date d'échéance      | 2027-12-01             |
            | format               | application/pdf        |
            | contenu fichier      | le contenu du fichier  |
            | date de constitution | 2021-12-01             |
            | date de dépôt        | 2023-08-11             | 
        Quand un utilisateur avec le rôle 'porteur-projet' modifie un dépôt de garanties financières pour le projet "Centrale éolienne 20" avec :
            | type                 | avec date d'échéance   |
            | format               | application/pdf        |
            | contenu fichier      | le contenu du fichier  |
            | date de constitution | 2020-12-01             |
            | date de modification | 2023-08-28             | 
        Alors l'utilisateur devrait être informé que "La date d'échéance est requise pour ce type de garanties financières" 

    Plan du Scénario: Erreur si date de d'échéance non compatible avec le type
        Etant donné un dépôt de garanties financières pour le projet "Centrale éolienne 20" avec :
            | type                 | avec date d'échéance   |
            | date d'échéance      | 2027-12-01             |
            | format               | application/pdf        |
            | contenu fichier      | le contenu du fichier  |
            | date de constitution | 2021-12-01             |
            | date de dépôt        | 2023-08-11             | 
        Quand un utilisateur avec le rôle 'porteur-projet' modifie un dépôt de garanties financières pour le projet "Centrale éolienne 20" avec :
            | type                 | <type>                 |
            | date d'échéance      | 2027-12-01             |
            | format               | application/pdf        |
            | contenu fichier      | le contenu du fichier  |
            | date de constitution | 2021-12-02             |
            | date de modification | 2023-08-28             | 
        Alors l'utilisateur devrait être informé que "Vous ne pouvez pas ajouter une date d'échéance pour le type de garanties financières renseigné"
    Exemples:
            | type                    |
            | consignation            |
            | 6 mois après achèvement |    
                       