#Language: fr-FR

Fonctionnalité: Enregistrer des garanties financières validées
    Contexte: 
        Etant donné le projet "Centrale éolienne 20"

    Plan du scénario: Importer le type de garanties financières
        Quand un utilisateur avec le rôle 'admin' importe le type des garanties financières pour le projet "Centrale éolienne 20" avec :
            | type                 | <type>             |
            | date d'échéance      | <date d'échéance>  |
        Alors les garanties financières devraient être consultables pour le projet "Centrale éolienne 20" avec :
            | type                 | <type>             |
            | date d'échéance      | <date d'échéance>  | 
    Exemples:
            | type                    | date d'échéance | 
            | avec date d'échéance    | 2027-12-01      | 
            | consignation            |                 | 
            | 6 mois après achèvement |                 |               
    
    Plan du scénario: Compléter des garanties financières incomplètes avec l'attestation de constitution
        Etant donné des garanties financières importées pour le projet "Centrale éolienne 20" avec :
            | type                 | <type>             |
            | date d'échéance      | <date d'échéance>  |
        Quand un utilisateur avec le rôle 'admin' enregistre des garanties financières pour le projet "Centrale éolienne 20" avec :
            | type                 | <type>                 |
            | date d'échéance      | <date d'échéance>      |
            | format               | <format du fichier>    |
            | contenu fichier      | <contenu du fichier>   |
            | date de constitution | <date de constitution> |
        Alors les garanties financières complètes devraient être mises à jour pour le projet "Centrale éolienne 20" avec :
            | type                 | <type>                 |
            | date d'échéance      | <date d'échéance>      |
            | format               | <format du fichier>    |
            | date de constitution | <date de constitution> |
        Et le fichier de l'attestation de garanties financières devrait être téléchargeable pour le projet "Centrale éolienne 20" avec :
            | format               | <format du fichier>    |
            | contenu fichier      | <contenu du fichier>   |
        Exemples:
            | type                    | date d'échéance | format du fichier | contenu du fichier    | date de constitution |
            | avec date d'échéance    | 2027-12-01      | application/pdf   | le contenu du fichier | 2021-12-02           |
            | consignation            |                 | application/pdf   | le contenu du fichier | 2021-12-02           |
            | 6 mois après achèvement |                 | application/pdf   | le contenu du fichier | 2021-12-02           |      

    Scénario: Migrer des garanties financières legacy vers le nouveau socle technique
        Quand un développeur migre des garanties financières legacy pour le projet "Centrale éolienne 20" avec :
            | type                 | avec date d'échéance   |
            | date d'échéance      | 2027-12-01             |        
            | format               | application/pdf        |
            | date de constitution | 2021-12-02             |
            | contenu fichier      | le contenu             |
        Alors les garanties financières devraient être consultables pour le projet "Centrale éolienne 20" avec :
            | type                 | avec date d'échéance   |
            | date d'échéance      | 2027-12-01             |        
            | format               | application/pdf        |
            | date de constitution | 2021-12-02             |
        Et le fichier de l'attestation de garanties financières devrait être téléchargeable pour le projet "Centrale éolienne 20" avec :
            | contenu fichier      | le contenu             |  
            | format               | application/pdf        | 

    Scénario: Corriger le type de garanties financières migrées sans type : changer type et retirer date d'échéance
        Etant donné des garanties financières migrées pour le projet "Centrale éolienne 20" avec :
            | date d'échéance      | 2027-12-01             |        
            | format               | application/pdf        |
            | date de constitution | 2021-12-02             |
            | contenu fichier      | le contenu             |
        Quand un utilisateur avec le rôle 'admin' enregistre des garanties financières pour le projet "Centrale éolienne 20" avec :
            | type                 | consignation           |
            | format               | application/pdf        |
            | date de constitution | 2021-12-02             |
            | contenu fichier      | le contenu             |
        Alors les garanties financières devraient être mises à jour pour le projet "Centrale éolienne 20" avec :
            | type                 | consignation           |
            | format               | application/pdf        |
            | date de constitution | 2021-12-02             |

    Plan du scénario: Enregistrer des garanties financières complètes
        Quand un utilisateur avec le rôle 'admin' enregistre des garanties financières pour le projet "Centrale éolienne 20" avec : 
            | type                 | <type>                 |
            | date d'échéance      | <date d'échéance>      |
            | format               | <format du fichier>    |
            | contenu fichier      | <contenu du fichier>   |
            | date de constitution | <date de constitution> |
        Alors les garanties financières devraient être consultables pour le projet "Centrale éolienne 20" avec :
            | type                 | <type>                 |
            | date d'échéance      | <date d'échéance>      |
            | format               | <format du fichier>    |
            | date de constitution | <date de constitution> |
        Et le fichier de l'attestation de garanties financières devrait être téléchargeable pour le projet "Centrale éolienne 20" avec :
            | format               | <format du fichier>    |
            | contenu fichier      | <contenu du fichier>   | 
        Exemples:
            | type                    | date d'échéance | format du fichier | contenu du fichier    | date de constitution |
            | avec date d'échéance    | 2027-12-01      | application/pdf   | le contenu du fichier | 2021-12-02           |
            | consignation            |                 | application/pdf   | le contenu du fichier | 2021-12-02           |
            | 6 mois après achèvement |                 | application/pdf   | le contenu du fichier | 2021-12-02           |                 
    
    # Cas d'erreurs
    Scénario: Erreur si le type de garanties financières est inconnu
        Quand un utilisateur enregistre des garanties financières avec un type inexistant pour le projet "Centrale éolienne 20"
        Alors l'utilisateur devrait être informé que "Le type de garanties financières saisi n'est pas accepté"    
    
    Scénario: Erreur si la date de constitution est dans le futur
        Quand un utilisateur avec le rôle 'admin' enregistre des garanties financières pour le projet "Centrale éolienne 20" avec :
            | type                 | consignation           |
            | format               | application/pdf        |
            | date de constitution | 2050-12-02             |
            | contenu fichier      | le contenu             |
        Alors l'utilisateur devrait être informé que "La date de constitution des garanties financières ne peut pas être une date future"           
    
    Plan du scénario: Erreur si date d'échéance saisie avec un type de garanties financières non compatible
        Quand un utilisateur enregistre des garanties financières avec un type et une date d'échéance incompatibles pour le projet "Centrale éolienne 20" avec :
            | type                 |  <type>         |
        Alors l'utilisateur devrait être informé que "Vous ne pouvez pas ajouter une date d'échéance pour le type de garanties financières renseigné"
        Exemples: 
            | type                    |
            | consignation            |
            | 6 mois après achèvement |    

    Scénario: Erreur si date d'échéance manquante le type "avec date d'échéance"
        Quand un utilisateur enregistre des garanties financières de type avec date d'échéance sans préciser la date pour le projet "Centrale éolienne 20"
        Alors l'utilisateur devrait être informé que "La date d'échéance est requise pour ce type de garanties financières"         
   
    Scénario: Erreur si un porteur tente de modifier le type de garanties financières
        Etant donné des garanties financières pour le projet "Centrale éolienne 20" avec :
            | type                 | avec date d'échéance   |
            | date d'échéance      | 2027-12-01             |
            | format               | application/pdf        |
            | date de constitution | 2021-12-02             | 
            | contenu fichier      | le contenu             |         
        Quand un utilisateur avec le rôle 'porteur-projet' enregistre des garanties financières pour le projet "Centrale éolienne 20" avec :
            | type                 | consignation           |
            | format               | application/pdf        |
            | date de constitution | 2021-12-02             | 
            | contenu fichier      | le contenu             | 
        Alors l'utilisateur devrait être informé que "Vous ne pouvez pas modifier des données de garanties financières déjà validées" 

     Scénario: Erreur si un porteur tente d'enregistrer des garanties financières alors qu'il devrait faire un dépôt 
        Etant donné des garanties financières à déposer pour le projet "Centrale éolienne 20" avec :
            | date limite de dépôt | 2023-11-01             |
        Quand un utilisateur avec le rôle 'porteur-projet' enregistre des garanties financières pour le projet "Centrale éolienne 20" avec : 
            | type                 | avec date d'échéance   |
            | date d'échéance      | 2027-12-01             |        
            | format               | application/pdf        |
            | date de constitution | 2021-12-02             |
            | contenu fichier      | le contenu             |
        Alors l'utilisateur devrait être informé que "Vous ne pouvez pas enregistrer des garanties financières mais vous devez faire un dépôt pour validation de nouvelles garanties financières" 
       

 