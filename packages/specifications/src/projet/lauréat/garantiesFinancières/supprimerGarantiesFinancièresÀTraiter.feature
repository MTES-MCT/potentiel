#Language: fr-FR

Fonctionnalité: Supprimer des garanties financières en attente de validation
    Contexte:
        Etant donné le projet lauréat "Centrale PV"

    Plan du Scénario: Un porteur supprime des garanties financières avec une date limite de soumission après les avoir soumises
        Etant donné des garanties financières en attente pour le projet "Centrale PV" avec :
            | date limite de soumission | 2023-11-01 |
            | date de notification      | 2023-09-01 |
            | motif                     | <motif>    |
        Et des garanties financières à traiter pour le projet "Centrale PV" avec :
            | type                 | <type>                 |
            | date d'échéance      | <date d'échéance>      |
            | format               | <format du fichier>    |
            | contenu fichier      | <contenu du fichier>   |
            | date de constitution | <date de constitution> |
            | date de soumission   | 2023-10-01             |
            | soumis par           | porteur@test.test      |
        Quand le porteur supprime les garanties financières à traiter pour le projet "Centrale PV"
        Alors il ne devrait pas y avoir de garanties financières à traiter pour le projet "Centrale PV"
        Et la liste des garanties financières à traiter devrait être vide
        Et des garanties financières devraient être attendues pour le projet "Centrale PV" avec :
            | date limite de soumission | 2023-11-01 |
            | motif                     | <motif>    |
    Exemples:
            | type                      | date d'échéance | format du fichier | contenu du fichier    | date de constitution | motif                                    |
            | avec-date-échéance        | 2027-12-01      | application/pdf   | le contenu du fichier | 2023-06-01           | motif-inconnu                            |
            | consignation              |                 | application/pdf   | le contenu du fichier | 2023-06-01           | recours-accordé                          |
            | six-mois-après-achèvement |                 | application/pdf   | le contenu du fichier | 2023-06-01           | changement-producteur                    |
            | consignation              |                 | application/pdf   | le contenu du fichier | 2023-06-01           | échéance-garanties-financières-actuelles |

    Plan du Scénario: Un porteur supprime des garanties financières sans une date limite de soumission après les avoir soumises
        Etant donné des garanties financières à traiter pour le projet "Centrale PV" avec :
            | type                 | <type>                 |
            | date d'échéance      | <date d'échéance>      |
            | format               | <format du fichier>    |
            | contenu fichier      | <contenu du fichier>   |
            | date de constitution | <date de constitution> |
            | date de soumission   | 2023-10-01             |
            | soumis par           | porteur@test.test      |
        Quand le porteur supprime les garanties financières à traiter pour le projet "Centrale PV"
        Alors il ne devrait pas y avoir de garanties financières à traiter pour le projet "Centrale PV"
        Et la liste des garanties financières à traiter devrait être vide
    Exemples:
            | type                      | date d'échéance | format du fichier | contenu du fichier    | date de constitution |
            | avec-date-échéance        | 2027-12-01      | application/pdf   | le contenu du fichier | 2023-06-01           |
            | consignation              |                 | application/pdf   | le contenu du fichier | 2023-06-01           |
            | six-mois-après-achèvement |                 | application/pdf   | le contenu du fichier | 2023-06-01           |


    Scénario: Impossible de supprimer des garanties financières en attente de validation s'il n'y a pas de garanties financières à traiter
        Etant donné des garanties financières en attente pour le projet "Centrale PV" avec :
            | date limite de soumission | 2023-11-01                      |
            | date de notification      | 2023-09-01                      |
            | motif                     | motif-inconnu                   |
        Quand le porteur supprime les garanties financières à traiter pour le projet "Centrale PV"
        Alors l'utilisateur devrait être informé que "Il n'y a aucun dépôt de garanties financières en cours pour ce projet"


