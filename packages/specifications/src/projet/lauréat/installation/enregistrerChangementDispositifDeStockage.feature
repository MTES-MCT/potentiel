# language: fr
@dispositif-de-stockage
@installation
Fonctionnalité: Enregistrer un changement de dispositif de stockage d'un projet lauréat en tant que porteur

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offres                           | PPE2 - Petit PV Bâtiment |
            | installation avec dispositif de stockage | oui                      |
            | capacité du dispositif                   | 1                        |
            | puissance du dispositif                  | 2                        |

        Et la dreal "Dreal du sud" associée à la région du projet

    Scénario: Enregistrer un changement de dispositif de stockage d'un projet lauréat
        Quand le porteur enregistre un changement de dispositif de stockage du projet lauréat avec :
            | installation avec dispositif de stockage | non |
        Alors le dispositif de stockage du projet lauréat devrait être mise à jour
        Et l'installation du projet lauréat devrait être mise à jour
        Et le changement de dispositif de stockage devrait être consultable
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - Du boulodrome de Marseille - Déclaration de changement du couplage avec un dispositif de stockage |
            | nom_projet | Du boulodrome de Marseille                                                                                    |
            | url        | https://potentiel.beta.gouv.fr/laureats/.*/installation/dispositif-de-stockage/changement/.*                  |
        Et un email a été envoyé à la dreal avec :
            | sujet      | Potentiel - Du boulodrome de Marseille - Déclaration de changement du couplage avec un dispositif de stockage |
            | nom_projet | Du boulodrome de Marseille                                                                                    |
            | url        | https://potentiel.beta.gouv.fr/laureats/.*/installation/dispositif-de-stockage/changement/.*                  |

    Scénario: Impossible d'enregistrer un changement de dispositif de stockage d'un projet abandonné
        Etant donné une demande d'abandon accordée pour le projet lauréat
        Quand le porteur enregistre un changement de dispositif de stockage du projet lauréat avec :
            | installation avec dispositif de stockage | non |
        Alors le porteur devrait être informé que "Impossible de faire un changement pour un projet abandonné"

    Scénario: Impossible d'enregistrer un changement de dispositif de stockage d'un projet achevé
        Etant donné une attestation de conformité transmise pour le projet lauréat
        Quand le porteur enregistre un changement de dispositif de stockage du projet lauréat avec :
            | installation avec dispositif de stockage | non |
        Alors le porteur devrait être informé que "Impossible de faire un changement pour un projet achevé"

    Scénario: Impossible d'enregistrer un changement de dispositif de stockage avec une valeur identique à l'actuelle
        Quand le porteur enregistre un changement de dispositif de stockage du projet lauréat avec une valeur identique
        Alors l'utilisateur devrait être informé que "Les informations relatives au dispositif de stockage sont identiques à celles du projet"

    Scénario: Impossible d'enregistrer un changement pour un projet avec dispositif de stockage avec des valeurs invalides
        Quand le porteur enregistre un changement de dispositif de stockage du projet lauréat avec :
            | installation avec dispositif de stockage | oui |
            | capacité du dispositif                   |     |
            | puissance du dispositif                  |     |
        Alors l'utilisateur devrait être informé que "La capacité et la puissance du dispositif de stockage sont requises"

    Scénario: Impossible d'enregistrer un changement pour un projet  sans dispositif de stockage avec des valeurs invalides
        Quand le porteur enregistre un changement de dispositif de stockage du projet lauréat avec :
            | appel d'offres                           | PPE2 - Petit PV Bâtiment |
            | installation avec dispositif de stockage | non                      |
            | capacité du dispositif                   | 4                        |
            | puissance du dispositif                  | 5                        |
        Alors l'utilisateur devrait être informé que "La capacité et la puissance du dispositif de stockage ne peuvent être renseignées en l'absence de dispositif de stockage"

    Scénario: Impossible d'enregistrer un changement de dispositif de stockage si ce champ n'est pas disponible dans l'appel d'offres du projet
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offres | PPE2 - Bâtiment |
        Quand le porteur enregistre un changement de dispositif de stockage du projet lauréat avec :
            | installation avec dispositif de stockage | non |
        Alors l'utilisateur devrait être informé que "Le cahier des charges de ce projet ne permet pas ce changement"
