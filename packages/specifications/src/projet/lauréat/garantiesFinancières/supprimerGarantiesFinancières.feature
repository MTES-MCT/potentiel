#Language: fr-FR
Fonctionnalité: Supprimer des garanties financières validées
    Contexte: 
        Etant donné le projet lauréat "Centrale PV"
    
    Plan du Scénario: Un admin supprime des garanties financières validées
        Etant donné des garanties financières validées pour le projet "Centrale PV" avec :
            | type                 | consignation           |
            | date d'échéance      |                        |
            | format               | application/pdf        |
            | contenu fichier      | contenu fichier 1      |
            | date de constitution | 2023-06-10             |
            | date de soumission   | 2023-11-01             |
            | soumis par           | porteur@test.test      |
            | date validation      | 2023-11-03             |
        Quand un admin supprime les garanties financières validées pour le projet "Centrale PV"
        Alors aucunes garanties financières validées ne devraient être consultables pour le projet "Centrale PV"                 

    Scénario: Erreur si aucunes garanties financières validées ne sont trouvées    
        Quand un admin supprime les garanties financières validées pour le projet "Centrale PV"
        Alors l'utilisateur devrait être informé que "Il n'y a aucunes garanties financières validées pour ce projet"          
