#Language: fr-FR
@select
Fonctionnalité: Supprimer un dépôt de garanties financières
    Contexte: 
        Etant donné le projet "Centrale éolienne 20"

    Scénario: Supprimer un dépôt de garanties financières 
        Etant donné un dépôt de garanties financières pour le projet "Centrale éolienne 20" avec :
            | type                 | consignation          |
            | format               | application/pdf       |
            | contenu fichier      | nouveau contenu       |
            | date de constitution | 2023-01-01            |
            | date de dépôt        | 2023-10-01            | 
        Quand un utilisateur avec le rôle Porteur supprime le dépôt de garanties financières pour le projet "Centrale éolienne 20"
        Alors le dépôt de garanties financières devrait être supprimé pour le projet "Centrale éolienne 20"

    Scénario: Impossible de supprimer un dépôt inexistant
        Quand un utilisateur avec le rôle Porteur supprime le dépôt de garanties financières pour le projet "Centrale éolienne 20"
        Alors l'utilisateur devrait être informé que "Le dépôt de garanties financières n'a pas été trouvé. Veuillez contacter un administrateur si le problème persiste."  

                       