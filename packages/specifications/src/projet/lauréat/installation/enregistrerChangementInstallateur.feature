# language: fr
@installateur
@installation
Fonctionnalité: Enregistrer un changement d'installateur d'un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de la Villette" avec :
            | appel d'offres | PPE2 - Petit PV Bâtiment |
            | installateur   | Installateur.Inc         |
        Et la dreal "Dreal du sud" associée à la région du projet
        Et un cahier des charges permettant la modification du projet

    Scénario: Enregistrer un changement d'installateur pour un projet lauréat en tant que porteur
        Quand le porteur enregistre un changement d'installateur du projet lauréat
        Alors l'installateur du projet lauréat devrait être mis à jour
        Et le changement d'installateur enregistré devrait être consultable
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - Déclaration de changement d'installateur pour le projet Du boulodrome de la Villette dans le département(.*) |
            | nom_projet | Du boulodrome de la Villette                                                                                             |
            | url        | https://potentiel.beta.gouv.fr/laureats/.*/installation/installateur/changement/.*                                       |

        Et un email a été envoyé à la dreal avec :
            | sujet      | Potentiel - Déclaration de changement d'installateur pour le projet Du boulodrome de la Villette dans le département(.*) |
            | nom_projet | Du boulodrome de la Villette                                                                                             |
            | url        | https://potentiel.beta.gouv.fr/laureats/.*/installation/installateur/changement/.*                                       |

    Scénario: Impossible d'enregistrer un changement d'installateur pour un projet lauréat abandonné
        Etant donné un abandon accordé pour le projet lauréat
        Quand le porteur enregistre un changement d'installateur du projet lauréat
        Alors le porteur devrait être informé que "Impossible de faire un changement pour un projet abandonné"

    Scénario: Impossible d'enregistrer un changement d'installateur pour un projet lauréat achevé
        Etant donné une attestation de conformité transmise pour le projet lauréat
        Quand le porteur enregistre un changement d'installateur du projet lauréat
        Alors le porteur devrait être informé que "Impossible de faire un changement pour un projet achevé"

    Scénario: Impossible d'enregistrer un changement d'installateur avec une valeur identique
        Quand le porteur enregistre un changement d'installateur du projet lauréat avec une valeur identique
        Alors l'utilisateur devrait être informé que "Le nouvel installateur est identique à celui associé au projet"

    Scénario: Impossible d'enregistrer un changement d'installateur si le champ n'est pas disponible dans l'appel d'offres du projet
        Etant donné le projet lauréat "Du boulodrome de la Villette" avec :
            | appel d'offres | PPE2 - Bâtiment |
            | période        | 11              |
        Quand le porteur enregistre un changement d'installateur du projet lauréat avec une valeur identique
        Alors l'utilisateur devrait être informé que "Le cahier des charges de ce projet ne permet pas ce changement"
