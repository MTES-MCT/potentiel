#Language: fr-FR
@select
Fonctionnalité: Enregistrer des garanties financières validées
    Contexte: 
        Etant donné le projet "Centrale éolienne 20"

    Scénario: Migrer des garanties financières legacy
        Quand un utilisateur avec le rôle 'admin' migre des garanties financières pour le projet "Centrale éolienne 20"
            | type                 | avec date d'échéance   |
            | date d'échéance      | 2027-12-01             |        
            | format               | application/pdf        |
            | date de constitution | 2021-12-02             |
            | contenu fichier      | le contenu             |
        Alors les garanties financières devraient être consultables dans le projet "Centrale éolienne 20" 
            | type                 | avec date d'échéance   |
            | date d'échéance      | 2027-12-01             |        
            | format               | application/pdf        |
            | date de constitution | 2021-12-02             |
        Et le fichier de l'attestation de garanties financières devrait être téléchargeable pour le projet "Centrale éolienne 20" 
            | contenu fichier      | le contenu             |  
            | format               | application/pdf        | 

    Scénario: Enregistrer des garanties financières complètes avec date d'échéance
        Quand un utilisateur avec le rôle 'admin' transmet des garanties financières pour le projet "Centrale éolienne 20"
            | type                 | avec date d'échéance   |
            | date d'échéance      | 2027-12-01             |        
            | format               | application/pdf        |
            | date de constitution | 2021-12-02             |
            | contenu fichier      | le contenu             |
        Alors les garanties financières devraient être consultables dans le projet "Centrale éolienne 20" 
            | type                 | avec date d'échéance   |
            | date d'échéance      | 2027-12-01             |        
            | format               | application/pdf        |
            | date de constitution | 2021-12-02             |
        Et le fichier de l'attestation de garanties financières devrait être téléchargeable pour le projet "Centrale éolienne 20" 
            | contenu fichier      | le contenu             |  
            | format               | application/pdf        | 
    
    Scénario: Enregistrer des garanties financières complètes sans date d'échéance
        Quand un utilisateur avec le rôle 'admin' transmet des garanties financières pour le projet "Centrale éolienne 20"
            | type                 | consignation           |
            | format               | application/pdf        |
            | date de constitution | 2021-12-02             |
            | contenu fichier      | le contenu             |
        Alors les garanties financières devraient être consultables dans le projet "Centrale éolienne 20" 
            | type                 | consignation           |
            | format               | application/pdf        |
            | date de constitution | 2021-12-02             |
        Et le fichier de l'attestation de garanties financières devrait être téléchargeable pour le projet "Centrale éolienne 20" 
            | contenu fichier      | le contenu             |  
            | format               | application/pdf        |     
    
    Scénario: Enregistrer seulement le type et la date d'échéance de garanties financières
        Quand un utilisateur avec le rôle 'admin' transmet des garanties financières pour le projet "Centrale éolienne 20"
            | type                 | avec date d'échéance |
            | date d'échéance      | 2027-12-01           |
        Alors les garanties financières devraient être consultables dans le projet "Centrale éolienne 20" 
            | type                 | avec date d'échéance |
            | date d'échéance      | 2027-12-01           |   

    Scénario: Enregistrer seulement le type de garanties financières
        Quand un utilisateur avec le rôle 'admin' transmet des garanties financières pour le projet "Centrale éolienne 20"
            | type                 | 6 mois après achèvement |
        Alors les garanties financières devraient être consultables dans le projet "Centrale éolienne 20" 
            | type                 | 6 mois après achèvement |
    
    Scénario: Compléter des garanties financières incomplètes avec leur type et date d'échéance 
        Etant donné des garanties financières avec une attestation pour le projet "Centrale éolienne 20"
            | format               | application/pdf      |
            | date de constitution | 2021-12-02           |
            | contenu fichier      | le contenu           |
        Quand un utilisateur avec le rôle 'admin' transmet le type et la date d'échéance des garanties financières pour le projet "Centrale éolienne 20"
            | type                 | avec date d'échéance |
            | date d'échéance      | 2027-12-01           |
        Alors les garanties financières complètes devraient être mises à jour dans le projet "Centrale éolienne 20" 
            | type                 | avec date d'échéance |
            | date d'échéance      | 2027-12-01           |       
            | format               | application/pdf      |
            | date de constitution | 2021-12-02           |   
        Et le fichier de l'attestation de garanties financières devrait être téléchargeable pour le projet "Centrale éolienne 20" 
            | contenu fichier      | le contenu           |  
            | format               | application/pdf      |              
    
    Scénario: Compléter des garanties financières avec l'attestation de constitution avec leur attestation
        Etant donné des garanties financières avec un type et une date d'échéance pour le projet "Centrale éolienne 20"
            | type                 | avec date d'échéance |
            | date d'échéance      | 2027-12-01           |
        Quand un utilisateur avec le rôle 'admin' transmet l'attestation des garanties financières pour le projet "Centrale éolienne 20"
            | format               | application/pdf |
            | date de constitution | 2021-12-02      |
            | contenu fichier      | le contenu      |
        Alors les garanties financières complètes devraient être mises à jour dans le projet "Centrale éolienne 20" 
            | type                 | avec date d'échéance |
            | date d'échéance      | 2027-12-01           |
            | format               | application/pdf      |
            | date de constitution | 2021-12-02           |
        Et le fichier de l'attestation de garanties financières devrait être téléchargeable pour le projet "Centrale éolienne 20" 
            | contenu fichier      | le contenu             |  
            | format               | application/pdf        |     
    
    Scénario: Corriger des garanties financières complètes
        Etant donné des garanties financières complètes pour le projet "Centrale éolienne 20"
            | type                 | avec date d'échéance   |
            | date d'échéance      | 2027-12-01             |
            | format               | application/pdf        |
            | date de constitution | 2021-12-02             | 
            | contenu fichier      | le contenu             |           
        Quand un utilisateur avec le rôle 'admin' transmet des garanties financières complètes pour le projet "Centrale éolienne 20"
            | type                 | consignation           |   
            | format               | application/pdf        |
            | date de constitution | 2020-12-02             | 
            | contenu fichier      | le nouveau contenu     |      
        Alors les garanties financières complètes devraient être mises à jour dans le projet "Centrale éolienne 20" 
            | type                 | consignation           |
            | format               | application/pdf        |
            | date de constitution | 2020-12-02             | 
        Et le fichier de l'attestation de garanties financières devrait être téléchargeable pour le projet "Centrale éolienne 20" 
            | contenu fichier      | le nouveau contenu     |  
            | format               | application/pdf        |  

    Scénario: Corriger le type de garanties financières legacy migrées sans type
        Etant donné des garanties financières migrées pour le projet "Centrale éolienne 20"
            | date d'échéance      | 2027-12-01             |        
            | format               | application/pdf        |
            | date de constitution | 2021-12-02             |
            | contenu fichier      | le contenu             |
        Quand un utilisateur avec le rôle 'admin' transmet des garanties financières pour le projet "Centrale éolienne 20"
            | type                 | consignation           |
        Alors les garanties financières devraient être mises à jour dans le projet "Centrale éolienne 20" 
            | type                 | consignation           |
            | format               | application/pdf        |
            | date de constitution | 2021-12-02             |               
    
    Scénario: Erreur si le type de garanties financières est inconnu
        Quand un utilisateur avec le rôle 'admin' transmet des garanties financières pour le projet "Centrale éolienne 20"
            | type                 | type de GF totalement inconnu   |
            | format               | application/pdf                 |
            | date de constitution | 2021-12-02                      |
            | contenu fichier      | le contenu                      |
        Alors l'utilisateur devrait être informé que "Le type de garanties financières saisi n'est pas accepté"    
    
    Scénario: Erreur si la date de constitution est dans le futur
        Quand un utilisateur avec le rôle 'admin' transmet des garanties financières pour le projet "Centrale éolienne 20"
            | type                 | consignation         |
            | format               | application/pdf      |
            | date de constitution | 2050-12-02           |
            | contenu fichier      | le contenu           |
        Alors l'utilisateur devrait être informé que "La date de constitution des garanties financières ne peut pas être une date future"           
    
    Scénario: Erreur si date d'échéance saisie avec un type de garanties financières non compatible
        Quand un utilisateur avec le rôle 'admin' transmet des garanties financières pour le projet "Centrale éolienne 20"
            | type                 | consignation         |
            | date d'échéance      | 2027-12-01           |
            | format               | application/pdf      |
            | date de constitution | 2020-12-02           |
            | contenu fichier      | le contenu           |
        Alors l'utilisateur devrait être informé que "Vous ne pouvez pas ajouter une date d'échéance pour le type de garanties financières renseigné"
    
    Scénario: Erreur si date d'échéance manquante le type "avec date d'échéance"
        Quand un utilisateur avec le rôle 'admin' transmet des garanties financières pour le projet "Centrale éolienne 20"
            | type                 | avec date d'échéance   |
            | format               | application/pdf        |
            | date de constitution | 2020-12-02             |
            | contenu fichier      | le contenu             |
        Alors l'utilisateur devrait être informé que "La date d'échéance est requise pour ce type de garanties financières"         
    
    Scénario: Erreur si un porteur tente de modifier le type de garanties financières
        Etant donné des garanties financières complètes pour le projet "Centrale éolienne 20"
            | type                 | avec date d'échéance   |
            | date d'échéance      | 2027-12-01             |
            | format               | application/pdf        |
            | date de constitution | 2021-12-02             | 
            | contenu fichier      | le contenu             |         
        Quand un utilisateur avec le rôle 'porteur-projet' transmet des garanties financières pour le projet "Centrale éolienne 20"
            | type                 | avec date d'échéance   |
            | date d'échéance      | 2030-12-01             |
        Alors l'utilisateur devrait être informé que "Vous ne pouvez pas modifier des données de garanties financières déjà validées" 
       

 