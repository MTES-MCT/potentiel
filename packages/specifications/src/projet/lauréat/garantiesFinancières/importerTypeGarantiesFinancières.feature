#Language: fr-FR
Fonctionnalité: Importer le type (et la date d'échéance selon le cas) des garanties financières d'un projet
    Contexte: 
        Etant donné le projet lauréat "Centrale PV"

    Plan du Scénario: Un admin importe le type des garanties financières d'un projet
        Quand l'admin importe le type des garanties financières pour le projet "Centrale PV" avec :
            | type                      | <type>                 |
            | date d'échéance           | <date d'échéance>      |
            | date d'import             | <date import>          |
        Alors les garanties financières validées devraient consultables pour le projet "Centrale PV" avec :
            | type                      | <type>                 |
            | date d'échéance           | <date d'échéance>      |
            | date dernière mise à jour | <date import>          |
    Exemples:
            | type                      | date d'échéance   | date import |
            | avec-date-échéance        | 2027-12-01        | 2024-01-01  |
            | consignation              |                   | 2024-01-01  |
            | six-mois-après-achèvement |                   | 2024-01-01  |
    
    Scénario: Impossible d'importer le type (et la date d'échéance selon le cas) des garanties financières d'un projet si date d'échéance manquante
        Quand l'admin importe le type des garanties financières pour le projet "Centrale PV" avec :
            | type                 | avec-date-échéance     |
            | date d'échéance      |                        |    
        Alors l'utilisateur devrait être informé que "Vous devez renseigner la date d'échéance pour ce type de garanties financières" 
    
    Plan du Scénario: Impossible d'importer le type (et la date d'échéance selon le cas) des garanties financières d'un projet si date d'échéance non compatible avec le type
        Quand l'admin importe le type des garanties financières pour le projet "Centrale PV" avec :
            | type            | <type>     |   
            | date d'échéance | 2028-01-01 |   
        Alors l'utilisateur devrait être informé que "Vous ne pouvez pas renseigner de date d'échéance pour ce type de garanties financières"
    Exemples:
            | type                         |
            | consignation                 |
            | six-mois-après-achèvement    |         
