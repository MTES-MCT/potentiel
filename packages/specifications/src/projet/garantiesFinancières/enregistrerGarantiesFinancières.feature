#Language: fr-FR
Fonctionnalité: Enregistrer des garanties financières validées

    @select
    Scénario: Enregistrer des garanties financières complètes
        Etant donné le projet "Centrale éolienne 20"
        Quand un utilisateur avec le rôle 'admin' transmet des garanties financières pour le projet "Centrale éolienne 20"
            | type                 | avec date d'échéance |
            | date d'échéance      | 31/12/2027             |        
            | format               | application/pdf        |
            | date de constitution | 01/12/2021             |
        Alors les garanties financières du projet "Centrale éolienne 20" devraient être mises à jour

    Scénario: Enregistrer le type et la date d'échéance de garanties financières
        Etant donné le projet "Centrale éolienne 20" avec des garanties financières incomplète
            | format               | application/pdf |
            | date de constitution | 01/12/2021      |
        Quand un utilisateur avec le rôle 'admin' transmet des garanties financières pour le projet "Centrale éolienne 20"
            | type                 | avec date d'échéance |
            | date d'échéance      | 31/12/2027             |
        Alors les garanties financières du projet "Centrale éolienne 20" devraient être mises à jour

    Scénario: Enregistrer l'attestation de constitution de garanties financières
        Etant donné le projet "Centrale éolienne 20" avec des garanties financières incomplètes
            | type                 | avec date d'échéance |
            | date d'échéance      | 31/12/2027             |
        Quand un utilisateur avec le rôle 'admin' transmet des garanties financières pour le projet "Centrale éolienne 20"
            | format               | application/pdf |
            | date de constitution | 01/12/2021      |
        Alors les garanties financières du projet "Centrale éolienne 20" devraient être mises à jour   

    Scénario: Corriger des garanties financières complètes
        Etant donné le projet "Centrale éolienne 20" avec des garanties financières complètes
            | type                 | avec date d'échéance |
            | date d'échéance      | 31/12/2027             |
            | format               | application/pdf        |
            | date de constitution | 01/12/2021             |            
        Quand un utilisateur avec le rôle 'admin' transmet des garanties financières pour le projet "Centrale éolienne 20"
            | type                 | 'consignation' |     
        Alors les garanties financières du projet "Centrale éolienne 20" devraient être mises à jour         





       