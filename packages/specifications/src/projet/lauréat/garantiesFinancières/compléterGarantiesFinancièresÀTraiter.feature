#Language: fr-FR
@NotImplemented
Fonctionnalité: Compléter des garanties financières en attente de validation avec leur type
    Contexte: 
        Etant donné le projet lauréat "Centrale PV"
    
    Plan du Scénario: Un porteur complète des garanties financières à traiter avec leur type
       Etant donné des garanties financières à traiter pour le projet "Centrale PV" avec :
            | type                      | inconnu           |
        Quand le porteur complète les garanties financières à traiter pour le projet "Centrale PV" avec : 
            | type                      | <type>            |
            | date d'échéance           | <date d'échéance> |
        Alors des garanties financières devraient être à traiter pour le projet "Centrale PV" avec :
            | type                      | <type>            |
            | date d'échéance           | <date d'échéance> | 
    Exemples:
            | type                      | date d'échéance   |
            | avec-date-échéance        | 2027-12-01        |
            | consignation              |                   |
            | six-mois-après-achèvement |                   |     

    Plan du Scénario: Erreur si le type renseigné n'est pas compatible avec une date d'échéance
       Etant donné des garanties financières à traiter pour le projet "Centrale PV" avec :
            | type                      | inconnu           |
        Quand le porteur complète les garanties financières à traiter pour le projet "Centrale PV" avec : 
            | type                      | <type>            |
            | date d'échéance           | <date d'échéance> |
        Alors l'utilisateur devrait être informé que "Vous ne pouvez pas renseigner de date d'échéance pour ce type de garanties financières"
    Exemples:
            | type                      | date d'échéance   |
            | consignation              |  2027-12-01       |
            | six-mois-après-achèvement |  2027-12-01       |       

    Scénario: Erreur si la date d'échéance est manquante
       Etant donné des garanties financières à traiter pour le projet "Centrale PV" avec :
            | type                      | inconnu           |
        Quand le porteur complète les garanties financières à traiter pour le projet "Centrale PV" avec : 
            | type                      | date d'échéance   |
            | avec-date-échéance        |                   |
        Alors l'utilisateur devrait être informé que "Il y a déjà des garanties financières en attente de validation pour ce projet"               

         
