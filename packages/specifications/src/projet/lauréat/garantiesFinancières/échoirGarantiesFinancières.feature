# language: fr
Fonctionnalité: Échoir les garanties financières d'un projet

    Contexte:
        Etant donné le projet lauréat "Centrale PV"

    Scénario: Échoir les garanties financières d'un projet à J+1 après la date d'échéance
        Etant donné des garanties financières validées pour le projet "Centrale PV" avec :
            | type            | avec-date-échéance |
            | date d'échéance | 2024-07-17         |
        Quand un admin échoie les garanties financières pour le projet "Centrale PV" avec :
            | date d'échéance | 2024-07-17 |
            | date à vérifier | 2024-07-18 |
        Alors les garanties financières du projet "Centrale PV" sont échues

    Scénario: Impossible d'échoir les garanties financières d'un projet si il n'y a pas de garanties financières validées pour ce projet
        Quand un admin échoie les garanties financières pour le projet "Centrale PV" avec :
            | date d'échéance | 2024-07-17 |
            | date à vérifier | 2024-07-18 |
        Alors l'utilisateur devrait être informé que "Il n'y a aucunes garanties financières validées pour ce projet"

    Scénario: Impossible d'échoir les garanties financières d'un projet si la date d'échéance est dans le futur
        Etant donné des garanties financières validées pour le projet "Centrale PV" avec :
            | type            | avec-date-échéance |
            | date d'échéance | 2024-07-17         |
        Quand un admin échoie les garanties financières pour le projet "Centrale PV" avec :
            | date d'échéance | 2024-07-17 |
            | date à vérifier | 2024-07-16 |
        Alors l'utilisateur devrait être informé que "La date d'échéance des garanties financières n'est pas encore passée"

    Scénario: Impossible d'échoir les garanties financières d'un projet si la vérification est le jour de la date d'échéance
        Etant donné des garanties financières validées pour le projet "Centrale PV" avec :
            | type            | avec-date-échéance |
            | date d'échéance | 2024-07-17         |
        Quand un admin échoie les garanties financières pour le projet "Centrale PV" avec :
            | date d'échéance | 2024-07-17 |
            | date à vérifier | 2024-07-17 |
        Alors l'utilisateur devrait être informé que "La date d'échéance des garanties financières n'est pas encore passée"

    Scénario: Impossible d'échoir les garanties financières d'un projet si les garanties financières sont déjà échues
        Etant donné des garanties financières échues pour le projet "Centrale PV" avec :
            | date d'échéance | 2024-07-17 |
        Quand un admin échoie les garanties financières pour le projet "Centrale PV" avec :
            | date d'échéance | 2024-07-17 |
            | date à vérifier | 2024-07-18 |
        Alors l'utilisateur devrait être informé que "Les garanties financières du projet sont déjà échues"

    @NotImplemented
    Scénario: Impossible d'échoir les garanties financières d'un projet si le projet dispose d'un dépôt de garanties financières
        Etant donné des garanties financières validées pour le projet "Centrale PV" avec :
            | type            | avec-date-échéance |
            | date d'échéance | 2024-07-17         |
        Et des garanties financières à traiter pour le projet "Centrale PV"
        Quand un admin échoie les garanties financières pour le projet "Centrale PV" avec :
            | date d'échéance | 2024-07-17 |
            | date à vérifier | 2024-07-18 |
        Alors l'utilisateur devrait être informé que "Le projet dispose d'un dépôt de garanties financières en attente de validation, ce qui empêche de pouvoir échoir ses garanties financières"

    @NotImplemented
    Scénario: Impossible d'échoir les garanties financières d'un projet si le projet a transmis l'attestation de conformité
        Etant donné des garanties financières validées pour le projet "Centrale PV" avec :
            | type            | avec-date-échéance |
            | date d'échéance | 2024-07-17         |
        Et une attestation de conformité transmise pour le projet "Centrale PV"
        Quand un admin échoie les garanties financières pour le projet "Centrale PV" avec :
            | date d'échéance | 2024-07-17 |
            | date à vérifier | 2024-07-18 |
        Alors l'utilisateur devrait être informé que "Le projet dispose d'une attestation de conformité, ce qui empêche de pouvoir échoir ses garanties financières"

    # À vérifier côté métier
    @NotImplemented
    Scénario: Impossible d'échoir les garanties financières d'un projet abandonné

