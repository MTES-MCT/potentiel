#Language: fr-FR
Fonctionnalité: Déposer des garanties financières pour validation dans Potentiel
    Contexte: 
        Etant donné le projet "Centrale éolienne 20"

    @select
    Plan du Scénario: Déposer de nouvelles garanties financières pour un projet
        Quand un utilisateur avec le rôle 'porteur-projet' dépose des garanties financières pour le projet "Centrale éolienne 20" avec :
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
    Exemples:
            | type                    | date d'échéance | format du fichier | contenu du fichier    | date de constitution |
            | avec date d'échéance    | 2027-12-01      | application/pdf   | le contenu du fichier | 2021-12-02           |
            | consignation            |                 | application/pdf   | le contenu du fichier | 2021-12-02           |
            | 6 mois après achèvement |                 | application/pdf   | le contenu du fichier | 2021-12-02           |                                         