#Language: fr-FR

Fonctionnalité: Enregistrer des garanties financières validées
    Contexte: 
        Etant donné le projet lauréat "Centrale PV"
    
    Plan du Scénario: Un admin enregistre des garanties financières validées
        Quand un admin enregistre les garanties financières validées pour le projet "Centrale PV" avec : 
            | type                 | <type>                 |
            | date d'échéance      | <date d'échéance>      |
            | format               | application/pdf        |
            | contenu fichier      | contenu fichier        |
            | date de constitution | 2023-06-12             |
            | date mise à jour     | 2024-03-01             |
        Alors les garanties financières validées devraient consultables pour le projet "Centrale PV" avec :
            | type                 | <type>                 |
            | date d'échéance      | <date d'échéance>      |
            | format               | application/pdf        |
            | contenu fichier      | contenu fichier        |
            | date de constitution | 2023-06-12             |
            | date de soumission   | 2023-11-01             |
            | soumis par           | porteur@test.test      |
    Exemples:
            | type                      | date d'échéance   |
            | avec-date-échéance        | 2027-12-01        |
            | consignation              |                   |
            | six-mois-après-achèvement |                   |  

    Plan du Scénario: Erreur si le type renseigné n'est pas compatible avec une date d'échéance
        Quand un admin enregistre les garanties financières validées pour le projet "Centrale PV" avec : 
            | type                 | <type>                 |
            | date d'échéance      | <date d'échéance>      |
        Alors l'utilisateur devrait être informé que "Vous ne pouvez pas renseigner de date d'échéance pour ce type de garanties financières"
    Exemples:
            | type                      | date d'échéance   |
            | consignation              |  2027-12-01       |
            | six-mois-après-achèvement |  2027-12-01       |       

    Scénario: Erreur si la date d'échéance est manquante
        Quand un admin enregistre les garanties financières validées pour le projet "Centrale PV" avec : 
            | type                 | avec-date-échéance     |
            | date d'échéance      |                        |
        Alors l'utilisateur devrait être informé que "Vous devez renseigner la date d'échéance pour ce type de garanties financières" 

    Scénario: Erreur si la date de constitution est dans le futur
        Quand un admin enregistre les garanties financières validées pour le projet "Centrale PV" avec : 
            | date de constitution | 2050-01-01             |
        Alors l'utilisateur devrait être informé que "La date de constitution des garanties financières ne peut pas être une date future"                     

    Scénario: Erreur s'il y a déjà des garanties financières validées 
        Etant donné des garanties financières validées pour le projet "Centrale PV" avec :
            | type                 | type-inconnu           |
            | date d'échéance      |                        |
            | format               | application/pdf        |
            | contenu fichier      | contenu fichier 1      |
            | date de constitution | 2023-06-10             |
            | date de soumission   | 2023-11-01             |
            | soumis par           | porteur@test.test      |
            | date validation      | 2023-11-03             |
        Quand un admin enregistre les garanties financières validées pour le projet "Centrale PV" avec : 
            | date de constitution | 2020-01-01             |
        Alors l'utilisateur devrait être informé que "Il y a déjà des garanties financières pour ce projet"          
