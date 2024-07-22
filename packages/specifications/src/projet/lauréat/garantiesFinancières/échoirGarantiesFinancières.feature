# language: fr
Fonctionnalité: Échoir les garanties financières d'un projet

    Contexte:
        Etant donné le projet lauréat "Centrale PV"
        Et le porteur pour le projet lauréat "Centrale PV"
            | email | porteur@test.test   |
            | nom   | Porteur Projet Test |
            | role  | porteur-projet      |
        Et la dreal associée au projet lauréat "Centrale PV"
            | email | dreal@test.test |
            | nom   | Dreal Test      |

    Scénario: Échoir les garanties financières d'un projet à J+1 après la date d'échéance
        Etant donné des garanties financières validées pour le projet "Centrale PV" avec :
            | type            | avec-date-échéance |
            | date d'échéance | 2024-07-17         |
        Quand un admin échoie les garanties financières pour le projet "Centrale PV" avec :
            | date d'échéance | 2024-07-17 |
            | date à vérifier | 2024-07-18 |
        Alors les garanties financières du projet "Centrale PV" sont échues
        Et un email a été envoyé à "porteur@test.test" avec :
            | nom_projet         | Centrale PV                                                                                                                          |
            | departement_projet | departementProjet                                                                                                                    |
            | region_projet      | regionProjet                                                                                                                         |
            | nouveau_statut     | en attente de validation                                                                                                             |
            | sujet              | Potentiel - Des garanties financières sont en attente de validation pour le projet Centrale PV dans le département departementProjet |

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

    Scénario: Impossible d'échoir les garanties financières d'un projet si le projet dispose d'un dépôt de garanties financières
        Etant donné des garanties financières validées pour le projet "Centrale PV" avec :
            | type            | avec-date-échéance |
            | date d'échéance | 2024-07-17         |
        Et des garanties financières à traiter pour le projet "Centrale PV"
        Quand un admin échoie les garanties financières pour le projet "Centrale PV" avec :
            | date d'échéance | 2024-07-17 |
            | date à vérifier | 2024-07-18 |
        Alors l'utilisateur devrait être informé que "Le projet dispose d'un dépôt de garanties financières en attente de validation, ce qui empêche de pouvoir échoir ses garanties financières"

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

