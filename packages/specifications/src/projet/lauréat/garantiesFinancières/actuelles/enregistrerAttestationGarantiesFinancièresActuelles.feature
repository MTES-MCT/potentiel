# language: fr
Fonctionnalité: Enregistrer l'attestation des garanties financières actuelles

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"

    Scénario: Un porteur enregistre l'attestation des garanties financières actuelles
        Etant donné des garanties financières actuelles importées avec l'attestation manquante pour le projet "Du boulodrome de Marseille" avec :
            | type            | consignation |
            | date d'échéance |              |
        Quand un porteur enregistre l'attestation des garanties financières actuelles pour le projet "Du boulodrome de Marseille" avec :
            | format               | application/pdf |
            | contenu fichier      | contenu fichier |
            | date de constitution | 2023-06-12      |
            | date mise à jour     | 2024-03-01      |
        Alors les garanties financières actuelles devraient être consultables pour le projet "Du boulodrome de Marseille" avec :
            | type                 | consignation      |
            | date d'échéance      |                   |
            | format               | application/pdf   |
            | contenu fichier      | contenu fichier   |
            | date de constitution | 2023-06-12        |
            | date de soumission   | 2023-11-01        |
            | soumis par           | porteur@test.test |

    Scénario: Impossible d'enregistrer l'attestation des garanties financières si l'attestation est déjà présente
        Etant donné des garanties financières actuelles pour le projet "Du boulodrome de Marseille" avec :
            | format               | application/pdf |
            | contenu fichier      | contenu fichier |
            | date de constitution | 2023-06-12      |
        Quand un porteur enregistre l'attestation des garanties financières actuelles pour le projet "Du boulodrome de Marseille" avec :
            | date de constitution | 2020-01-01 |
        Alors l'utilisateur devrait être informé que "Il y a déjà une attestation pour ces garanties financières"

    Scénario: Impossible d'enregistrer l'attestation des garanties financières si la date de constitution est dans le futur
        Etant donné des garanties financières actuelles importées avec l'attestation manquante pour le projet "Du boulodrome de Marseille" avec :
            | type | consignation |
        Quand un porteur enregistre l'attestation des garanties financières actuelles pour le projet "Du boulodrome de Marseille" avec :
            | date de constitution | 2050-01-01 |
        Alors l'utilisateur devrait être informé que "La date de constitution des garanties financières ne peut pas être une date future"

    Scénario: Impossible d'enregistrer l'attestation des garanties financières si aucunes garanties financières actuelles ne sont trouvées
        Quand un porteur enregistre l'attestation des garanties financières actuelles pour le projet "Du boulodrome de Marseille" avec :
            | date de constitution | 2020-01-01 |
        Alors l'utilisateur devrait être informé que "Il n'y a aucunes garanties financières actuelles pour ce projet"

    # À vérifier côté métier
    @NotImplemented
    Scénario: Impossible d'enregistrer l'attestation des garanties financières actuelles si celles-ci sont échues

