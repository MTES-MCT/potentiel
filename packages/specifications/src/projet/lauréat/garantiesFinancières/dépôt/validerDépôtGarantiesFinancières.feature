# language: fr
Fonctionnalité: Valider un dépôt de garanties financières

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"

    Plan du Scénario: Un utilisateur dreal valide un dépôt de garanties financières
        Etant donné des garanties financières en attente pour le projet "Du boulodrome de Marseille" avec :
            | date limite de soumission | 2023-11-01    |
            | date de notification      | 2023-09-01    |
            | motif                     | motif-inconnu |
        Et un dépôt de garanties financières pour le projet "Du boulodrome de Marseille" avec :
            | type                 | <type>                 |
            | date d'échéance      | <date d'échéance>      |
            | format               | <format du fichier>    |
            | contenu fichier      | <contenu du fichier>   |
            | date de constitution | <date de constitution> |
            | date de soumission   | 2023-10-01             |
            | soumis par           | porteur@test.test      |
        Quand l'utilisateur dreal valide un dépôt de garanties financières pour le projet "Du boulodrome de Marseille" avec :
            | date de validation | <date de validation> |
        Alors les garanties financières actuelles devraient être consultables pour le projet "Du boulodrome de Marseille" avec :
            | type                 | <type>                 |
            | date d'échéance      | <date d'échéance>      |
            | format               | <format du fichier>    |
            | contenu fichier      | <contenu du fichier>   |
            | date de constitution | <date de constitution> |
            | date de validation   | <date de validation>   |
        Et il ne devrait pas y avoir de dépôt de garanties financières pour le projet "Du boulodrome de Marseille"

        Exemples:
            | type                      | date d'échéance | format du fichier | contenu du fichier    | date de constitution | date de validation |
            | avec-date-échéance        | 2027-12-01      | application/pdf   | le contenu du fichier | 2023-06-01           | 2023-10-10         |
            | consignation              |                 | application/pdf   | le contenu du fichier | 2023-06-01           | 2023-10-10         |
            | six-mois-après-achèvement |                 | application/pdf   | le contenu du fichier | 2023-06-01           | 2023-10-10         |

    Scénario: Impossible de valider un dépôt de garanties financières si aucune dépôt n'est trouvé
        Etant donné des garanties financières en attente pour le projet "Du boulodrome de Marseille" avec :
            | date limite de soumission | 2023-11-01    |
            | date de notification      | 2023-09-01    |
            | motif                     | motif-inconnu |
        Quand l'utilisateur dreal valide un dépôt de garanties financières pour le projet "Du boulodrome de Marseille" avec :
            | date de validation | 2023-09-02 |
        Alors l'utilisateur devrait être informé que "Il n'y a aucun dépôt de garanties financières en cours pour ce projet"
