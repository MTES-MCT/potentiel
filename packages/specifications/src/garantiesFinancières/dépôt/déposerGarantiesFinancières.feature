#Language: fr-FR
Fonctionnalité: Déposer des garanties financières pour validation dans Potentiel
    Contexte: 
        Etant donné le projet "classé" "Centrale éolienne 20" de la région "Nouvelle-Aquitaine"
    
    Plan du Scénario: Déposer de nouvelles garanties financières pour un projet
        Etant donné des garanties financières à déposer pour le projet "Centrale éolienne 20" avec :
            | date limite de dépôt | 2023-11-01             |
        Quand un utilisateur avec le rôle porteur-projet dépose des garanties financières pour le projet "Centrale éolienne 20" avec :
            | type                 | <type>                 |
            | date d'échéance      | <date d'échéance>      |
            | format               | <format du fichier>    |
            | contenu fichier      | <contenu du fichier>   |
            | date de constitution | <date de constitution> |
            | date de dépôt        | 2023-08-11             |
        Alors le dépôt de garanties financières devrait être consultable pour le projet "Centrale éolienne 20" avec :
            | type                 | <type>                 |
            | date d'échéance      | <date d'échéance>      |
            | format               | <format du fichier>    |
            | contenu fichier      | <contenu du fichier>   |
            | date de constitution | <date de constitution> |
            | date de dépôt        | 2023-08-11             |
            | région               | Nouvelle-Aquitaine     |
        Et il devrait y avoir un dépôt de garanties financières "en cours" pour le projet "Centrale éolienne 20" avec :
            | date limite de dépôt | 2023-11-01            |
            | région               | Nouvelle-Aquitaine    |
    Exemples:
            | type                    | date d'échéance | format du fichier | contenu du fichier    | date de constitution |
            | avec date d'échéance    | 2027-12-01      | application/pdf   | le contenu du fichier | 2021-12-02           |
            | consignation            |                 | application/pdf   | le contenu du fichier | 2021-12-02           |
            | 6 mois après achèvement |                 | application/pdf   | le contenu du fichier | 2021-12-02           |         

    Plan du Scénario: Migrer les garanties financières legacy 
        Quand un développeur migre un dépôt de garanties financières sans type pour le projet "Centrale éolienne 20" avec :
            | date d'échéance      | <date d'échéance>      |
            | format               | <format du fichier>    |
            | contenu fichier      | <contenu du fichier>   |
            | date de constitution | <date de constitution> |
            | date de dépôt        | 2023-08-11             |
        Alors le dépôt de garanties financières devrait être consultable pour le projet "Centrale éolienne 20" avec :
            | date d'échéance      | <date d'échéance>      |
            | format               | <format du fichier>    |
            | contenu fichier      | <contenu du fichier>   |
            | date de constitution | <date de constitution> |
            | date de dépôt        | 2023-08-11             | 
            | région               | Nouvelle-Aquitaine     |           
    Exemples:
            | date d'échéance | format du fichier | contenu du fichier    | date de constitution |
            | 2027-12-01      | application/pdf   | le contenu du fichier | 2021-12-02           |
            |                 | application/pdf   | le contenu du fichier | 2021-12-02           |

     Scénario: Déposer de nouvelle garanties financières après validation d'un premier dépôt 
        Etant donné des garanties financières à déposer pour le projet "Centrale éolienne 20" avec :
            | date limite de dépôt | 2023-11-01            |
        Et un dépôt de garanties financières pour le projet "Centrale éolienne 20" avec :
            | type                 | consignation          |
            | format               | application/pdf       |
            | contenu fichier      | contenu               |
            | date de constitution | 2023-01-01            |
            | date de dépôt        | 2023-10-01            |     
        Et une validation du dépôt de garanties financières par la Dreal pour le projet "Centrale éolienne 20" avec :
            | type                 | consignation          |
            | format               | application/pdf       |
            | contenu fichier      | contenu               |
            | date de constitution | 2023-01-01            |
        Quand un utilisateur avec le rôle porteur-projet dépose des garanties financières pour le projet "Centrale éolienne 20" avec :
            | type                 | avec date d'échéance  |
            | date d'échéance      | 2025-01-01            |
            | format               |  application/pdf      |
            | contenu fichier      | nouveau contenu       |
            | date de constitution | 2023-09-01            |
            | date de dépôt        | 2023-09-20            |    
        Alors le dépôt de garanties financières devrait être consultable pour le projet "Centrale éolienne 20" avec :
            | type                 | avec date d'échéance  |
            | date d'échéance      | 2025-01-01            |
            | format               | application/pdf       |
            | contenu fichier      | nouveau contenu       |
            | date de constitution | 2023-09-01            |
            | région               | Nouvelle-Aquitaine    |  
            | date de dépôt        | 2023-09-20            |           
         Et il devrait y avoir un dépôt de garanties financières "en cours" pour le projet "Centrale éolienne 20" avec :
            | région               | Nouvelle-Aquitaine    |        

    Scénario: Erreur si date de constitution dans le futur
        Quand un utilisateur avec le rôle porteur-projet dépose des garanties financières pour le projet "Centrale éolienne 20" avec une date de constitution dans le futur      
        Alors l'utilisateur devrait être informé que "La date de constitution des garanties financières ne peut pas être une date future" 
  
    Scénario: Erreur si date de d'échéance manquante
        Quand un utilisateur avec le rôle porteur-projet dépose des garanties financières de type avec date d'échéance pour le projet "Centrale éolienne 20" sans préciser cette date       
        Alors l'utilisateur devrait être informé que "La date d'échéance est requise pour ce type de garanties financières" 
 
    Plan du Scénario: Erreur si date de d'échéance non compatible avec le type
        Quand un utilisateur avec le rôle porteur-projet dépose des garanties financières pour le projet "Centrale éolienne 20" avec un type non compatible avec une date d'échéance, avec : 
        | type | <type> |   
        Alors l'utilisateur devrait être informé que "Vous ne pouvez pas ajouter une date d'échéance pour le type de garanties financières renseigné"
    Exemples:
            | type                    |
            | consignation            |
            | 6 mois après achèvement |

    Scénario: Erreur si un dépôt a déjà été soumis
        Etant donné un dépôt de garanties financières pour le projet "Centrale éolienne 20" avec :
            | type                 | avec date d'échéance          |
            | date d'échéance      | 2027-12-01                    |
            | format               | application/pdf               |
            | contenu fichier      | le contenu du fichier         |
            | date de constitution | 2021-12-01                    |
            | date de dépôt        | 2023-08-11                    | 
        Quand un utilisateur avec le rôle porteur-projet dépose des garanties financières pour le projet "Centrale éolienne 20" avec :
            | type                 | consignation                  |
            | format               | application/pdf               |
            | contenu fichier      | le contenu du fichier         |
            | date de constitution | 2021-12-02                    |
            | date de dépôt        | 2023-08-12                    |             
        Alors l'utilisateur devrait être informé que "Vous avez déjà des déposé des garanties financières en attente de validation"
                       