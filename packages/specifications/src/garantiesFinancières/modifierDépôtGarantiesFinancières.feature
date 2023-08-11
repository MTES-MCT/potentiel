#Language: fr-FR
@select
Fonctionnalité: Modifier le dépôt de garanties financières en attente de validation dans Potentiel
    Contexte: 
        Etant donné le projet "Centrale éolienne 20"

    Scénario: Modifier un dépôt existant
        Etant donné un dépôt de garanties financières pour le projet "Centrale éolienne 20" avec :
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
        Alors le dépôt de garanties financières devrait être mis à jour pour le projet "Centrale éolienne 20" avec :   
            | type                 | consignation                  |
            | format               | application/pdf               |
            | contenu fichier      | le nouveau contenu du fichier |
            | date de constitution | 2022-01-01                    |
            | date de dépôt        | 2023-08-11                    |    

    Scénario: Erreur si modification d'un dépôt non trouvé  
        Quand un utilisateur avec le rôle 'porteur-projet' modifie un dépôt de garanties financières pour le projet "Centrale éolienne 20" avec :
            | type                 | consignation                  |
            | format               | application/pdf               |
            | contenu fichier      | le nouveau contenu du fichier |
            | date de constitution | 2022-01-01                    |
        Alors l'utilisateur devrait être informé que "Le dépôt de garanties financières que vous tentez de modifier est introuvable"
                       