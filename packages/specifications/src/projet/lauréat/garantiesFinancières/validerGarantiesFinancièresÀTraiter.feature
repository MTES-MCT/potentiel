#Language: fr-FR
@NotImplemented
Fonctionnalité: Valider des garanties financières en attente de validation
    Contexte: 
        Etant donné le projet lauréat "Centrale PV"
    
    Plan du Scénario: Un utilisateur dreal valide des garanties financières à traiter
        Etant donné des garanties financières en attente pour le projet "Centrale PV" avec :
            | date limite de soumission | 2023-11-01 |
            | date de notification      | 2023-09-01 |
        Et des garanties financières à traiter pour le projet "Centrale PV" avec :
            | type                 | <type>                 |
            | date d'échéance      | <date d'échéance>      |
            | format               | <format du fichier>    |
            | contenu fichier      | <contenu du fichier>   |
            | date de constitution | <date de constitution> |
            | date de soumission   | 2023-10-01             |
            | soumis par           | porteur@test.test      |
        Quand l'utilisateur dreal valide les garanties financières à traiter pour le projet "Centrale PV"    
        Alors des garanties financières devraient être validées pour le projet "Centrale PV" avec :
            | type                 | <type>                 |
            | date d'échéance      | <date d'échéance>      |
            | format               | <format du fichier>    |
            | contenu fichier      | <contenu du fichier>   |
            | date de constitution | <date de constitution> |
            | date de soumission   | 2023-10-01             |
            | validé le            | porteur@test.test      |
        Et il ne devrait pas y avoir de garanties financières à traiter pour le projet "Centrale PV"
        Et il ne devrait pas y avoir de garanties financières en attente pour le projet "Centrale PV"  
    Exemples:
            | type                      | date d'échéance | format du fichier | contenu du fichier    | date de constitution |
            | avec-date-échéance        | 2027-12-01      | application/pdf   | le contenu du fichier | 2023-06-01           |
            | consignation              |                 | application/pdf   | le contenu du fichier | 2023-06-01           |
            | six-mois-après-achèvement |                 | application/pdf   | le contenu du fichier | 2023-06-01           |       

         
