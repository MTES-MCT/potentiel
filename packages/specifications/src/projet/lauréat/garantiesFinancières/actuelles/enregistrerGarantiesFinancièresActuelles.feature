# language: fr
Fonctionnalité: Enregistrer des garanties financières actuelles

    Contexte:
        Etant donné le projet lauréat sans garanties financières importées "Du boulodrome de Marseille"

    Plan du Scénario: Un admin enregistre des garanties financières actuelles pour un projet ayant des garanties financières en attente
        Etant donné des garanties financières en attente pour le projet "Du boulodrome de Marseille" avec :
            | date limite de soumission | 2023-11-01 |
            | date de notification      | 2023-09-01 |
            | motif                     | <motif>    |
        Quand un admin enregistre les garanties financières actuelles pour le projet "Du boulodrome de Marseille" avec :
            | type GF              | <type GF>         |
            | date d'échéance      | <date d'échéance> |
            | format               | application/pdf   |
            | contenu fichier      | contenu fichier   |
            | date de constitution | 2023-06-12        |
            | date mise à jour     | 2024-03-01        |
            | enregistré par       | admin@test.test   |
        Alors les garanties financières actuelles devraient être consultables pour le projet "Du boulodrome de Marseille" avec :
            | type GF              | <type GF>         |
            | date d'échéance      | <date d'échéance> |
            | format               | application/pdf   |
            | contenu fichier      | contenu fichier   |
            | date de constitution | 2023-06-12        |
            | date de soumission   | 2023-11-01        |
            | soumis par           | porteur@test.test |
        Et les garanties financières en attente du projet "Du boulodrome de Marseille" ne devraient plus être consultables

        Exemples:
            | type GF                   | date d'échéance | motif                                    |
            | avec-date-échéance        | 2027-12-01      | motif-inconnu                            |
            | consignation              |                 | recours-accordé                          |
            | six-mois-après-achèvement |                 | changement-producteur                    |
            | consignation              |                 | échéance-garanties-financières-actuelles |

    Plan du Scénario: Un admin enregistre des garanties financières actuelles
        Quand un admin enregistre les garanties financières actuelles pour le projet "Du boulodrome de Marseille" avec :
            | type GF              | <type GF>         |
            | date d'échéance      | <date d'échéance> |
            | format               | application/pdf   |
            | contenu fichier      | contenu fichier   |
            | date de constitution | 2023-06-12        |
            | date mise à jour     | 2024-03-01        |
            | enregistré par       | admin@test.test   |
        Alors les garanties financières actuelles devraient être consultables pour le projet "Du boulodrome de Marseille" avec :
            | type GF              | <type GF>         |
            | date d'échéance      | <date d'échéance> |
            | format               | application/pdf   |
            | contenu fichier      | contenu fichier   |
            | date de constitution | 2023-06-12        |
            | date de soumission   | 2023-11-01        |
            | soumis par           | porteur@test.test |

        Exemples:
            | type GF                   | date d'échéance |
            | avec-date-échéance        | 2027-12-01      |
            | consignation              |                 |
            | six-mois-après-achèvement |                 |

    # Règles métier à confirmer
    @NotImplemented
    Scénario: Un admin enregistre des garanties financières actuelles ayant initialement un statut échu
        Etant donné des garanties financières actuelles échues pour le projet "Du boulodrome de Marseille" avec :
            | date d'échéance | 2024-07-17 |
        Quand un admin enregistre les garanties financières actuelles pour le projet "Du boulodrome de Marseille" avec :
            | type GF              | consignation    |
            | format               | application/pdf |
            | contenu fichier      | contenu fichier |
            | date de constitution | 2023-06-12      |
            | date mise à jour     | 2024-03-01      |
            | enregistré par       | admin@test.test |
        Alors les garanties financières actuelles devraient être consultables pour le projet "Du boulodrome de Marseille" avec :
            | type GF              | consignation      |
            | format               | application/pdf   |
            | contenu fichier      | contenu fichier   |
            | date de constitution | 2023-06-12        |
            | date de soumission   | 2023-11-01        |
            | soumis par           | porteur@test.test |

    Scénario: Une tâche du type "échoir les garanties financières" est planifiée quand des garanties financières sont enregisrées par l'administration
        Quand un admin enregistre les garanties financières actuelles pour le projet "Du boulodrome de Marseille" avec :
            | type GF          | avec-date-échéance |
            | date d'échéance  | 2024-12-02         |
            | date mise à jour | 2024-11-02         |
        Alors une tâche "échoir les garanties financières" est planifiée à la date du "2024-12-03" pour le projet "Du boulodrome de Marseille"

    Scénario: Des tâches de la catégorie "rappel échéance garanties financières" sont planifiées à M-1 et M-2 de la date d'échéance en cas de garanties financières enregistrées
        Quand un admin enregistre les garanties financières actuelles pour le projet "Du boulodrome de Marseille" avec :
            | type GF         | avec-date-échéance |
            | date d'échéance | 2024-10-01         |
        Alors une tâche "rappel échéance garanties financières à un mois" est planifiée à la date du "2024-09-01" pour le projet "Du boulodrome de Marseille"
        Et une tâche "rappel échéance garanties financières à deux mois" est planifiée à la date du "2024-08-01" pour le projet "Du boulodrome de Marseille"

    Plan du Scénario: Impossible d'enregister des garanties financières actuelles si le type renseigné n'est pas compatible avec une date d'échéance
        Quand un admin enregistre les garanties financières actuelles pour le projet "Du boulodrome de Marseille" avec :
            | type GF         | <type GF>         |
            | date d'échéance | <date d'échéance> |
            | enregistré par  | admin@test.test   |
        Alors l'utilisateur devrait être informé que "Vous ne pouvez pas renseigner de date d'échéance pour ce type de garanties financières"

        Exemples:
            | type GF                   | date d'échéance |
            | consignation              | 2027-12-01      |
            | six-mois-après-achèvement | 2027-12-01      |

    Scénario: Impossible d'enregister des garanties financières actuelles si la date d'échéance est manquante
        Quand un admin enregistre les garanties financières actuelles pour le projet "Du boulodrome de Marseille" avec :
            | type GF         | avec-date-échéance |
            | date d'échéance |                    |
            | enregistré par  | admin@test.test    |
        Alors l'utilisateur devrait être informé que "Vous devez renseigner la date d'échéance pour ce type de garanties financières"

    Scénario: Impossible d'enregister des garanties financières actuelles si la date de constitution est dans le futur
        Quand un admin enregistre les garanties financières actuelles pour le projet "Du boulodrome de Marseille" avec :
            | date de constitution | 2050-01-01      |
            | enregistré par       | admin@test.test |
        Alors l'utilisateur devrait être informé que "La date de constitution des garanties financières ne peut pas être une date future"

    Scénario: Impossible d'enregister des garanties financières s'il y a déjà des garanties financières actuelles
        Etant donné des garanties financières actuelles pour le projet "Du boulodrome de Marseille" avec :
            | type GF              | type-inconnu      |
            | date d'échéance      |                   |
            | format               | application/pdf   |
            | contenu fichier      | contenu fichier 1 |
            | date de constitution | 2023-06-10        |
            | date de soumission   | 2023-11-01        |
            | soumis par           | porteur@test.test |
            | date de validation   | 2023-11-03        |
        Quand un admin enregistre les garanties financières actuelles pour le projet "Du boulodrome de Marseille" avec :
            | date de constitution | 2020-01-01      |
            | enregistré par       | admin@test.test |
        Alors l'utilisateur devrait être informé que "Il y a déjà des garanties financières pour ce projet"
