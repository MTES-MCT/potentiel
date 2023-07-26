#Language: fr-FR
Fonctionnalité: Enregistrer des garanties financières validées
@select
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
@select
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
@select
    Scénario: Enregistrer seulement le type de garanties financières
        Etant donné le projet "Centrale éolienne 20"
        Quand un utilisateur avec le rôle 'admin' transmet des garanties financières pour le projet "Centrale éolienne 20"
            | type                 | 6 mois après achèvement |
        Alors les garanties financières du projet "Centrale éolienne 20" devraient être consultable dans le projet
            | type                 | 6 mois après achèvement |
@select
    Scénario: Compléter des garanties financières avec leur type et date d'échéance 
        Etant donné le projet "Centrale éolienne 20"
        Quand un utilisateur avec le rôle 'admin' transmet des garanties financières pour le projet "Centrale éolienne 20"
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
@select
    Scénario: Compléter des garanties financières avec l'attestation de constitution
        Etant donné le projet "Centrale éolienne 20"
        Quand un utilisateur avec le rôle 'admin' transmet des garanties financières pour le projet "Centrale éolienne 20"
            | type                 | avec date d'échéance |
            | date d'échéance      | 2027-12-01           |
        Quand un utilisateur avec le rôle 'admin' transmet des garanties financières pour le projet "Centrale éolienne 20"
            | format               | application/pdf |
            | date de constitution | 2021-12-02      |
        Alors les garanties financières du projet "Centrale éolienne 20" devraient être consultable dans le projet
            | type                 | avec date d'échéance |
            | date d'échéance      | 2027-12-01           |
            | format               | application/pdf      |
            | date de constitution | 2021-12-02           |

@select
    Scénario: Corriger des garanties financières complètes : changer type et retirer date d'échéance
        Etant donné le projet "Centrale éolienne 20"
        Quand un utilisateur avec le rôle 'admin' transmet des garanties financières pour le projet "Centrale éolienne 20"
            | type                 | avec date d'échéance   |
            | date d'échéance      | 2027-12-01             |
            | format               | application/pdf        |
            | date de constitution | 2021-12-02             |            
        Quand un utilisateur avec le rôle 'admin' transmet des garanties financières pour le projet "Centrale éolienne 20"
            | type                 | consignation |     
        Alors les garanties financières du projet "Centrale éolienne 20" devraient être consultable dans le projet
            | type                 | consignation           |
            | format               | application/pdf        |
            | date de constitution | 2021-12-02             | 

@select
    Scénario: Erreur si le type de garanties financières est inconnu
        Etant donné le projet "Centrale éolienne 20"
        Quand un utilisateur avec le rôle 'admin' transmet des garanties financières pour le projet "Centrale éolienne 20"
            | type                 | type de GF totalement inconnu   |
            | format               | application/pdf                 |
            | date de constitution | 2021-12-02                      |
        Alors l'utilisateur devrait être informé que "Le type de garanties financières saisi n'est pas accepté"    




       