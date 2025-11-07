# language: fr
@garanties-financières
Fonctionnalité: Enregistrer l'attestation des garanties financières actuelles

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Lyon"
        Et la dreal "Dreal du sud" associée à la région du projet

    Scénario: Un porteur enregistre l'attestation des garanties financières actuelles
        Quand un porteur enregistre l'attestation des garanties financières actuelles pour le projet lauréat
        Alors les garanties financières actuelles devraient être consultables pour le projet lauréat
        Et un email a été envoyé à la dreal avec :
            | sujet              | Potentiel - Attestation de constitution des garanties financières enregistrée pour le projet Du boulodrome de Lyon dans le département .* |
            | nom_projet         | Du boulodrome de Lyon                                                                                                                     |
            | departement_projet | .*                                                                                                                                        |
            | region_projet      | .*                                                                                                                                        |
            | url                | https://potentiel.beta.gouv.fr/laureats/.*/garanties-financieres                                                                          |

    Scénario: Un porteur enregistre l'attestation des garanties financières actuelles d'un projet en attente de garanties financières
        Etant donné des garanties financières en attente pour le projet lauréat
        Quand un porteur enregistre l'attestation des garanties financières actuelles pour le projet lauréat
        Alors les garanties financières actuelles devraient être consultables pour le projet lauréat
        Et des garanties financières devraient être attendues pour le projet lauréat

    Scénario: Impossible d'enregistrer l'attestation des garanties financières si l'attestation est déjà présente
        Etant donné le projet lauréat sans garanties financières importées "Du boulodrome de Marseille"
        Et des garanties financières actuelles pour le projet lauréat
        Quand un porteur enregistre l'attestation des garanties financières actuelles pour le projet lauréat
        Alors l'utilisateur devrait être informé que "Il y a déjà une attestation pour ces garanties financières"

    Scénario: Impossible d'enregistrer l'attestation des garanties financières si aucunes garanties financières actuelles ne sont trouvées
        Etant donné le projet lauréat sans garanties financières importées "Du boulodrome de Marseille"
        Quand un porteur enregistre l'attestation des garanties financières actuelles pour le projet lauréat
        Alors l'utilisateur devrait être informé que "Il n'y a aucunes garanties financières actuelles pour ce projet"
