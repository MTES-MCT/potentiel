#Language: fr-FR

Fonctionnalité: Compléter des garanties financières validées
    Contexte: 
        Etant donné le projet lauréat "Centrale PV"
   @select
    Plan du Scénario: Un admin complète des garanties financières validées : type et date d'échéance
        Etant donné des garanties financières validées pour le projet "Centrale PV" avec :
            | type                 | type-inconnu           |
            | date d'échéance      |                        |
            | format               | application/pdf        |
            | contenu fichier      | contenu fichier        |
            | date de constitution | 2023-06-12             |
            | date de soumission   | 2023-11-01             |
            | soumis par           | porteur@test.test      |
            | date validation      | 2023-11-03             |
        Et un utilisateur admin "admin@test.test"    
        Quand l'admin "admin@test.test" complète les garanties financières validées pour le projet "Centrale PV" avec : 
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
            # | consignation              |                   |
            # | six-mois-après-achèvement |                   |  
@NotImplemented
    Plan du Scénario: Un porteur complète des garanties financières validées : attestation de désignation
@NotImplemented
    Scénario: Erreur si le porteur tente de compléter le type le type
@NotImplemented
    Plan du Scénario: Erreur si le type renseigné n'est pas compatible avec une date d'échéance
        Alors l'utilisateur devrait être informé que "Vous ne pouvez pas renseigner de date d'échéance pour ce type de garanties financières"
    Exemples:
            | type                      | date d'échéance   |
            | consignation              |  2027-12-01       |
            | six-mois-après-achèvement |  2027-12-01       |       
@NotImplemented
    Scénario: Erreur si la date d'échéance est manquante
        Alors l'utilisateur devrait être informé que "Vous devez renseigner la date d'échéance pour ce type de garanties financières"    
@NotImplemented
    Scénario: Erreur si la date de constitution est dans le futur
        Alors l'utilisateur devrait être informé que "La date de constitution des garanties financières ne peut pas être une date future"                     
@NotImplemented
    Scénario: Erreur si aucunes garanties financières à traiter ne sont trouvées    
        Alors l'utilisateur devrait être informé que "Il n'y a aucunes garanties financières à traiter pour ce projet"          
