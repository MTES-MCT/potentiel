#Language: fr-FR
@select
Fonctionnalité: Valider un dépôt de garanties financières
    Contexte: 
        Etant donné le projet "Centrale éolienne 20"

    Scénario: Valider un dépôt existant
        Etant donné un dépôt de garanties financières pour le projet "Centrale éolienne 20" avec :
            | type                 | avec date d'échéance          |
            | date d'échéance      | 2027-12-01                    |
            | format               | application/pdf               |
            | contenu fichier      | le contenu du fichier         |
            | date de constitution | 2021-12-01                    |
            | date de dépôt        | 2023-08-11                    |     
        Quand un utilisateur avec le rôle Dreal valide un dépôt de garanties financières pour le projet "Centrale éolienne 20"
        Alors les garanties financières devraient être consultables pour le projet "Centrale éolienne 20" avec : 
            | type                 | avec date d'échéance          |
            | date d'échéance      | 2027-12-01                    |
            | format               | application/pdf               |
            | contenu fichier      | le contenu du fichier         |
            | date de constitution | 2021-12-01                    |
            | date de dépôt        | 2023-08-11                    |  
        Alors le dépôt de garanties financières devrait être supprimé pour le projet "Centrale éolienne 20"    
        Et le fichier de l'attestation de garanties financières devrait être téléchargeable pour le projet "Centrale éolienne 20" avec :
            | format               | application/pdf               |
            | contenu fichier      | le contenu du fichier         |

    # Scénario: Impossible de valider un dépôt inexistant
    #     Quand un utilisateur avec le rôle Dreal valide un dépôt de garanties financières pour le projet "Centrale éolienne 20" avec :
    #     Alors l'utilisateur devrait être informé que "Le dépôt de garanties financières n'a pas été trouvé. Veuillez contacter un administrateur si le problème persiste."  

                       