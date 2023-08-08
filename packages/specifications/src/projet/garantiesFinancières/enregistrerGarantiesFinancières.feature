#Language: fr-FR
Fonctionnalité: Enregistrer des garanties financières validées
    Contexte: 
        Etant donné le projet "Centrale éolienne 20"

    # Cas nominal : 
        # import du type (et date d'échéance) avec le csv de candidats 
        # et ajout de l'attestation par un utilisateur
    Scénario: Enregistrer seulement le type et la date d'échéance de garanties financières
        Quand un utilisateur avec le rôle 'admin' enregistre des garanties financières pour le projet "Centrale éolienne 20" avec :
            | type                 | avec date d'échéance |
            | date d'échéance      | 2027-12-01           |
        Alors les garanties financières devraient être consultables pour le projet "Centrale éolienne 20" avec :
            | type                 | avec date d'échéance |
            | date d'échéance      | 2027-12-01           |   

    Scénario: Enregistrer seulement le type de garanties financières
        Quand un utilisateur avec le rôle 'admin' enregistre des garanties financières pour le projet "Centrale éolienne 20" avec :
            | type                 | 6 mois après achèvement |
        Alors les garanties financières devraient être consultables pour le projet "Centrale éolienne 20" avec :
            | type                 | 6 mois après achèvement |            
    
    Scénario: Compléter des garanties financières incomplètes avec l'attestation de constitution
        Etant donné des garanties financières avec un type et une date d'échéance pour le projet "Centrale éolienne 20" avec :
            | type                 | avec date d'échéance |
            | date d'échéance      | 2027-12-01           |
        Quand un utilisateur avec le rôle 'admin' enregistre l'attestation des garanties financières pour le projet "Centrale éolienne 20" avec :
            | format               | application/pdf |
            | date de constitution | 2021-12-02      |
            | contenu fichier      | le contenu      |
        Alors les garanties financières complètes devraient être mises à jour pour le projet "Centrale éolienne 20" avec :
            | type                 | avec date d'échéance |
            | date d'échéance      | 2027-12-01           |
            | format               | application/pdf      |
            | date de constitution | 2021-12-02           |
        Et le fichier de l'attestation de garanties financières devrait être téléchargeable pour le projet "Centrale éolienne 20" avec :
            | contenu fichier      | le contenu             |  
            | format               | application/pdf        |             
    
    # Rattrapage de l'historique des garanties financières de l'ancien socle technique
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

    Scénario: Corriger le type de garanties financières legacy migrées sans type : changer type et retirer date d'échéance
        Etant donné des garanties financières migrées pour le projet "Centrale éolienne 20" avec :
            | date d'échéance      | 2027-12-01             |        
            | format               | application/pdf        |
            | date de constitution | 2021-12-02             |
            | contenu fichier      | le contenu             |
        Quand un utilisateur avec le rôle 'admin' enregistre des garanties financières pour le projet "Centrale éolienne 20" avec :
            | type                 | consignation           |
        Alors les garanties financières devraient être mises à jour pour le projet "Centrale éolienne 20" avec :
            | type                 | consignation           |
            | format               | application/pdf        |
            | date de constitution | 2021-12-02             | 

    # Rattrapage pour les projets notifiés avant la mise en place de l'import des types de GF avec les csv. de candidats 
    Scénario: Enregistrer des garanties financières complètes avec date d'échéance
        Quand un utilisateur avec le rôle 'admin' enregistre des garanties financières complètes pour le projet "Centrale éolienne 20" avec : 
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
    
    Scénario: Enregistrer des garanties financières complètes sans date d'échéance
        Quand un utilisateur avec le rôle 'admin' enregistre des garanties financières complètes pour le projet "Centrale éolienne 20" avec :
            | type                 | consignation           |
            | format               | application/pdf        |
            | date de constitution | 2021-12-02             |
            | contenu fichier      | le contenu             |
        Alors les garanties financières devraient être consultables pour le projet "Centrale éolienne 20" avec :
            | type                 | consignation           |
            | format               | application/pdf        |
            | date de constitution | 2021-12-02             |
        Et le fichier de l'attestation de garanties financières devrait être téléchargeable pour le projet "Centrale éolienne 20" avec :
            | contenu fichier      | le contenu             |  
            | format               | application/pdf        |     

     Scénario: Compléter des garanties financières incomplètes avec leur type et date d'échéance 
        Etant donné des garanties financières avec une attestation pour le projet "Centrale éolienne 20" avec :
            | format               | application/pdf      |
            | date de constitution | 2021-12-02           |
            | contenu fichier      | le contenu           |
        Quand un utilisateur avec le rôle 'admin' enregistre le type et la date d'échéance des garanties financières pour le projet "Centrale éolienne 20" avec :
            | type                 | avec date d'échéance |
            | date d'échéance      | 2027-12-01           |
        Alors les garanties financières complètes devraient être mises à jour pour le projet "Centrale éolienne 20" avec :
            | type                 | avec date d'échéance |
            | date d'échéance      | 2027-12-01           |       
            | format               | application/pdf      |
            | date de constitution | 2021-12-02           |   
        Et le fichier de l'attestation de garanties financières devrait être téléchargeable pour le projet "Centrale éolienne 20" avec : 
            | contenu fichier      | le contenu           |  
            | format               | application/pdf      |             
    
    # Corrections de garanties financières enregistrées
    Scénario: Corriger des garanties financières complètes : changer l'attestation, le type et retirer la date d'échéance
        Etant donné des garanties financières complètes pour le projet "Centrale éolienne 20" avec :
            | type                 | avec date d'échéance   |
            | date d'échéance      | 2027-12-01             |
            | format               | application/pdf        |
            | date de constitution | 2021-12-02             | 
            | contenu fichier      | le contenu             |           
        Quand un utilisateur avec le rôle 'admin' enregistre des garanties financières complètes pour le projet "Centrale éolienne 20" avec :
            | type                 | consignation           |   
            | format               | application/pdf        |
            | date de constitution | 2020-12-02             | 
            | contenu fichier      | le nouveau contenu     |      
        Alors les garanties financières complètes devraient être mises à jour pour le projet "Centrale éolienne 20" avec :
            | type                 | consignation           |
            | format               | application/pdf        |
            | date de constitution | 2020-12-02             | 
        Et le fichier de l'attestation de garanties financières devrait être téléchargeable pour le projet "Centrale éolienne 20" avec :
            | contenu fichier      | le nouveau contenu     |  
            | format               | application/pdf        |                
    
    # Cas d'erreurs
    Scénario: Erreur si le type de garanties financières est inconnu
        Quand un utilisateur avec le rôle 'admin' enregistre des garanties financières pour le projet "Centrale éolienne 20" avec :
            | type                 | type de GF totalement inconnu   |
        Alors l'utilisateur devrait être informé que "Le type de garanties financières saisi n'est pas accepté"    
    
    Scénario: Erreur si la date de constitution est dans le futur
        Quand un utilisateur avec le rôle 'admin' enregistre des garanties financières pour le projet "Centrale éolienne 20" avec :
            | format               | application/pdf      |
            | date de constitution | 2050-12-02           |
            | contenu fichier      | le contenu           |
        Alors l'utilisateur devrait être informé que "La date de constitution des garanties financières ne peut pas être une date future"           
    
    Scénario: Erreur si date d'échéance saisie avec un type de garanties financières non compatible
        Quand un utilisateur avec le rôle 'admin' enregistre des garanties financières pour le projet "Centrale éolienne 20" avec :
            | type                 | consignation         |
            | date d'échéance      | 2027-12-01           |
        Alors l'utilisateur devrait être informé que "Vous ne pouvez pas ajouter une date d'échéance pour le type de garanties financières renseigné"
    
    Scénario: Erreur si date d'échéance manquante le type "avec date d'échéance"
        Quand un utilisateur avec le rôle 'admin' enregistre des garanties financières pour le projet "Centrale éolienne 20" avec :
            | type                 | avec date d'échéance   |
        Alors l'utilisateur devrait être informé que "La date d'échéance est requise pour ce type de garanties financières"         
    
    Scénario: Erreur si un porteur tente de modifier le type de garanties financières
        Etant donné des garanties financières complètes pour le projet "Centrale éolienne 20" avec :
            | type                 | avec date d'échéance   |
            | date d'échéance      | 2027-12-01             |
            | format               | application/pdf        |
            | date de constitution | 2021-12-02             | 
            | contenu fichier      | le contenu             |         
        Quand un utilisateur avec le rôle 'porteur-projet' enregistre des garanties financières pour le projet "Centrale éolienne 20" avec :
            | type                 | avec date d'échéance   |
            | date d'échéance      | 2030-12-01             |
        Alors l'utilisateur devrait être informé que "Vous ne pouvez pas modifier des données de garanties financières déjà validées" 
       

 