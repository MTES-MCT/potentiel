#Language: fr-FR
Fonctionnalité: Enregistrer des garanties financières validées

    Scénario: Enregistrer des garanties financières complètes avec date d'échéance
        Etant donné le projet "Centrale éolienne 20"
        Quand un utilisateur avec le rôle 'admin' transmet des garanties financières pour le projet "Centrale éolienne 20"
            | type                 | avec date d'échéance   |
            | date d'échéance      | 2027-12-01             |        
            | format               | application/pdf        |
            | date de constitution | 2021-12-02             |
        Alors les garanties financières du projet "Centrale éolienne 20" devraient être consultable dans le projet
            | type                 | avec date d'échéance   |
            | date d'échéance      | 2027-12-01             |        
            | format               | application/pdf        |
            | date de constitution | 2021-12-02             |
  
    Scénario: Enregistrer des garanties financières complètes sans date d'échéance
        Etant donné le projet "Centrale éolienne 20"
        Quand un utilisateur avec le rôle 'admin' transmet des garanties financières pour le projet "Centrale éolienne 20"
            | type                 | consignation           |
            | format               | application/pdf        |
            | date de constitution | 2021-12-02             |
        Alors les garanties financières du projet "Centrale éolienne 20" devraient être consultable dans le projet
            | type                 | consignation   |
            | format               | application/pdf        |
            | date de constitution | 2021-12-02             |

    @select
    Scénario: Enregistrer seulement le type et la date d'échéance de garanties financières
        Etant donné le projet "Centrale éolienne 20"
        Quand un utilisateur avec le rôle 'admin' transmet des garanties financières pour le projet "Centrale éolienne 20"
            | type                 | avec date d'échéance |
            | date d'échéance      | 2027-12-01           |
        Alors les garanties financières du projet "Centrale éolienne 20" devraient être consultable dans le projet
            | type                 | avec date d'échéance |
            | date d'échéance      | 2027-12-01           |       

    Scénario: Compléter des garanties financières avec leur type et date d'échéance 
        Etant donné le projet "Centrale éolienne 20" avec des garanties financières
            | format               | application/pdf |
            | date de constitution | 2021-12-02      |
        Quand un utilisateur avec le rôle 'admin' transmet des garanties financières pour le projet "Centrale éolienne 20"
            | type                 | avec date d'échéance |
            | date d'échéance      | 2027-12-01           |
        Alors les garanties financières du projet "Centrale éolienne 20" devraient être consultable dans le projet
            | type                 | avec date d'échéance |
            | date d'échéance      | 2027-12-01           |       
            | format               | application/pdf      |
            | date de constitution | 2021-12-02           |            

    Scénario: Enregistrer l'attestation de constitution de garanties financières
        Etant donné le projet "Centrale éolienne 20" avec des garanties financièress
            | type                 | avec date d'échéance |
            | date d'échéance      | 2027-12-01             |
        Quand un utilisateur avec le rôle 'admin' transmet des garanties financières pour le projet "Centrale éolienne 20"
            | format               | application/pdf |
            | date de constitution | 2021-12-02      |
        Alors les garanties financières du projet "Centrale éolienne 20" devraient être mises à jour   

    Scénario: Corriger des garanties financières complètes
        Etant donné le projet "Centrale éolienne 20" avec des garanties financières
            | type                 | avec date d'échéance |
            | date d'échéance      | 2027-12-01             |
            | format               | application/pdf        |
            | date de constitution | 2021-12-02             |            
        Quand un utilisateur avec le rôle 'admin' transmet des garanties financières pour le projet "Centrale éolienne 20"
            | type                 | 'consignation' |     
        Alors les garanties financières du projet "Centrale éolienne 20" devraient être mises à jour         





       