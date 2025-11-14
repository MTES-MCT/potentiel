# language: fr
@achèvement
Fonctionnalité: Transmettre la date d'achèvement

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | date notification | 2025-11-01 |
        Et un cahier des charges permettant la modification du projet
        Et la dreal "Dreal du sud" associée à la région du projet

    Scénario: le co-contractant transmet la date d'achèvement pour le projet lauréat
        Quand le co-contractant transmet la date d'achèvement "2025-11-14" pour le projet lauréat
        Alors la date d'achèvement devrait être consultable pour le projet lauréat
        Et une attestation de conformité devrait être consultable pour le projet lauréat
        Et le statut du projet lauréat devrait être "achevé"

    # Et un email a été envoyé à la dreal avec :
    #     | sujet      | Potentiel - La date d'achèvement a été transmise pour le projet Du boulodrome de Marseille dans le département(.*) |
    #     | nom_projet | Du boulodrome de Marseille                                                                                         |
    #     | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                              |
    # Et un email a été envoyé au porteur avec :
    #     | sujet      | Potentiel - Mise à jour de la date d'achèvement du projet Du boulodrome de Marseille dans le département(.*) |
    #     | nom_projet | Du boulodrome de Marseille                                                                                   |
    #     | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                        |
    Scénario: Impossible de transmettre une date d'achèvement antérieure à la date de désignation du projet
        Quand le co-contractant transmet la date d'achèvement "2025-09-01" pour le projet lauréat
        Alors l'utilisateur devrait être informé que "La date d'achèvement ne peut pas être antérieure à la date de notification du projet"

    Scénario: Impossible de transmettre une date d'achèvement future
        Quand le co-contractant transmet la date d'achèvement "2050-09-01" pour le projet lauréat
        Alors l'utilisateur devrait être informé que "La date d'achèvement ne peut pas être dans le futur"

    Scénario: Impossible de transmettre une date d'achèvement pour un projet déjà achevé
        Etant donné une attestation de conformité transmise pour le projet lauréat
        Quand le co-contractant transmet la date d'achèvement "2025-11-14" pour le projet lauréat
        Alors l'utilisateur devrait être informé que "Le projet est déjà achevé"

    @NotImplemented
    Scénario: Impossible de transmettre une date d'achèvement pour un projet abandonné

