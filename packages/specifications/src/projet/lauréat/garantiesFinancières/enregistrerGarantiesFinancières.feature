# language: fr
Fonctionnalité: Enregistrer des garanties financières validées

    Contexte:
        Etant donné le projet lauréat "Centrale PV"

    Plan du Scénario: Un admin enregistre des garanties financières validées pour un projet ayant des garanties financières en attente
        Etant donné des garanties financières en attente pour le projet "Centrale PV" avec :
            | date limite de soumission | 2023-11-01 |
            | date de notification      | 2023-09-01 |
            | motif                     | <motif>    |
        Quand un admin enregistre les garanties financières validées pour le projet "Centrale PV" avec :
            | type                 | <type>            |
            | date d'échéance      | <date d'échéance> |
            | format               | application/pdf   |
            | contenu fichier      | contenu fichier   |
            | date de constitution | 2023-06-12        |
            | date mise à jour     | 2024-03-01        |
        Alors les garanties financières validées devraient consultables pour le projet "Centrale PV" avec :
            | type                 | <type>            |
            | date d'échéance      | <date d'échéance> |
            | format               | application/pdf   |
            | contenu fichier      | contenu fichier   |
            | date de constitution | 2023-06-12        |
            | date de soumission   | 2023-11-01        |
            | soumis par           | porteur@test.test |
        Et les garanties financières en attente du projet "Centrale PV" ne devraient plus être consultable dans la liste des garanties financières en attente

        Exemples:
            | type                      | date d'échéance | motif                                    |
            | avec-date-échéance        | 2027-12-01      | motif-inconnu                            |
            | consignation              |                 | recours-accordé                          |
            | six-mois-après-achèvement |                 | changement-producteur                    |
            | consignation              |                 | échéance-garanties-financières-actuelles |

    Plan du Scénario: Un admin enregistre des garanties financières validées
        Quand un admin enregistre les garanties financières validées pour le projet "Centrale PV" avec :
            | type                 | <type>            |
            | date d'échéance      | <date d'échéance> |
            | format               | application/pdf   |
            | contenu fichier      | contenu fichier   |
            | date de constitution | 2023-06-12        |
            | date mise à jour     | 2024-03-01        |
        Alors les garanties financières validées devraient consultables pour le projet "Centrale PV" avec :
            | type                 | <type>            |
            | date d'échéance      | <date d'échéance> |
            | format               | application/pdf   |
            | contenu fichier      | contenu fichier   |
            | date de constitution | 2023-06-12        |
            | date de soumission   | 2023-11-01        |
            | soumis par           | porteur@test.test |

        Exemples:
            | type                      | date d'échéance |
            | avec-date-échéance        | 2027-12-01      |
            | consignation              |                 |
            | six-mois-après-achèvement |                 |

    Plan du Scénario: Impossible d'enregister des garanties financières validées si le type renseigné n'est pas compatible avec une date d'échéance
        Quand un admin enregistre les garanties financières validées pour le projet "Centrale PV" avec :
            | type            | <type>            |
            | date d'échéance | <date d'échéance> |
        Alors l'utilisateur devrait être informé que "Vous ne pouvez pas renseigner de date d'échéance pour ce type de garanties financières"

        Exemples:
            | type                      | date d'échéance |
            | consignation              | 2027-12-01      |
            | six-mois-après-achèvement | 2027-12-01      |

    Scénario: Impossible d'enregister des garanties financières validées si la date d'échéance est manquante
        Quand un admin enregistre les garanties financières validées pour le projet "Centrale PV" avec :
            | type            | avec-date-échéance |
            | date d'échéance |                    |
        Alors l'utilisateur devrait être informé que "Vous devez renseigner la date d'échéance pour ce type de garanties financières"

    Scénario: Impossible d'enregister des garanties financières validées si la date de constitution est dans le futur
        Quand un admin enregistre les garanties financières validées pour le projet "Centrale PV" avec :
            | date de constitution | 2050-01-01 |
        Alors l'utilisateur devrait être informé que "La date de constitution des garanties financières ne peut pas être une date future"

    Scénario: Impossible d'enregister des garanties financières validées s'il y a déjà des garanties financières validées
        Etant donné des garanties financières validées pour le projet "Centrale PV"
            | type                 | type-inconnu      |
            | date d'échéance      |                   |
            | format               | application/pdf   |
            | contenu fichier      | contenu fichier 1 |
            | date de constitution | 2023-06-10        |
            | date de soumission   | 2023-11-01        |
            | soumis par           | porteur@test.test |
            | date validation      | 2023-11-03        |
        Quand un admin enregistre les garanties financières validées pour le projet "Centrale PV" avec :
            | date de constitution | 2020-01-01 |
        Alors l'utilisateur devrait être informé que "Il y a déjà des garanties financières pour ce projet"
