# language: fr
Fonctionnalité: Échoir les garanties financières d'un projet

    Contexte:
        Etant donné le projet lauréat "Centrale PV"

    @NotImplemented
    Scénario: Échoir les garanties financières d'un projet à J+1 après la date d'échéance
        Etant donné des garanties financières validées pour le projet "Centrale PV" avec :
            | type            | avec-date-échéance |
            | date d'échéance | 17/07/2024         |
        Quand un admin échoie les garanties financières pour le projet "Centrale PV" à la date du 18/07/2024
        Alors les garanties financières du projet "Centrale PV" sont échues

    @NotImplemented
    Scénario: Impossible d'échoir les garanties financières non validées d'un projet
        Quand un admin échoie les garanties financières pour le projet "Centrale PV" à la date du 18/07/2024
        Alors l'utilisateur devrait être informé que "Les garanties financières du projet ne sont pas validées"

    @NotImplemented
    Scénario: Impossible d'échoir les garanties financières d'un projet si la date d'échéance est dans le futur
        Etant donné des garanties financières validées pour le projet "Centrale PV" avec :
            | type            | avec-date-échéance |
            | date d'échéance | 17/07/2024         |
        Quand un admin échoie les garanties financières pour le projet "Centrale PV" à la date du 16/07/2024
        Alors l'utilisateur devrait être informé que "La date d'échéance des garanties financières n'est pas encore passée"

    @NotImplemented
    Scénario: Impossible d'échoir les garanties financières d'un projet si les garanties financières sont déjà échues
        Etant donné des garanties financières échues pour le projet "Centrale PV" avec :
            | type            | avec-date-échéance |
            | date d'échéance | 17/07/2024         |
        Quand un admin échoie les garanties financières pour le projet "Centrale PV" à la date du 19/07/2024
        Alors l'utilisateur devrait être informé que "Les garanties financières du projet sont déjà échues"

    @NotImplemented
    Scénario: Impossible d'échoir les garanties financières d'un projet si le projet dispose d'un dépôt de garanties financières
        Etant donné des garanties financières validées pour le projet "Centrale PV" avec :
            | type            | avec-date-échéance |
            | date d'échéance | 17/07/2024         |
        Et des garanties financières à traiter pour le projet "Centrale PV"
        Quand un admin échoie les garanties financières pour le projet "Centrale PV" à la date du 18/07/2024
        Alors l'utilisateur devrait être informé que "Le projet dispose d'un dépôt de garanties financières en attente de validation, ce qui empêche de pouvoir échoir ses garanties financières"

    @NotImplemented
    Scénario: Impossible d'échoir les garanties financières d'un projet si le projet a transmis l'attesation de conformité
        Etant donné des garanties financières validées pour le projet "Centrale PV" avec :
            | type            | avec-date-échéance |
            | date d'échéance | 17/07/2024         |
        Et le projet "Centrale PV" avec une attestation de conformité transmise
        Quand un admin échoie les garanties financières pour le projet "Centrale PV" à la date du 18/07/2024
        Alors l'utilisateur devrait être informé que "Le projet dispose d'une attestation de conformité, ce qui empêche de pouvoir échoir ses garanties financières"
