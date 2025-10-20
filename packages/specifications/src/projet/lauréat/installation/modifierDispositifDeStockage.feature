# language: fr
@dispositif-de-stockage
@installation
Fonctionnalité: Modifier le dispositif de stockage d'un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offres                           | PPE2 - Petit PV Bâtiment |
            | installation avec dispositif de stockage | oui                      |
            | capacité du dispositif                   | 1                        |
            | puissance du dispositif                  | 1                        |

        Et la dreal "Dreal du sud" associée à la région du projet

    Scénario: Modifier le dispositif de stockage d'un projet lauréat
        Quand un admin modifie le dispositif de stockage du projet lauréat avec :
            | appel d'offres                           | PPE2 - Petit PV Bâtiment |
            | installation avec dispositif de stockage | non                      |
        Alors le dispositif de stockage du projet lauréat devrait être mise à jour
        Et l'installation du projet lauréat devrait être mise à jour
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - Modification du couplage avec un dispositif de stockage pour le projet Du boulodrome de Marseille dans le département (.*) |
            | nom_projet | Du boulodrome de Marseille                                                                                                             |
            | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                                                  |
        Et un email a été envoyé à la dreal avec :
            | sujet      | Potentiel - Modification du couplage avec un dispositif de stockage pour le projet Du boulodrome de Marseille dans le département (.*) |
            | nom_projet | Du boulodrome de Marseille                                                                                                             |
            | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                                                  |

    Scénario: Modifier le dispositif de stockage d'un projet abandonné
        Etant donné un abandon accordé pour le projet lauréat
        Quand un admin modifie le dispositif de stockage du projet lauréat avec :
            | appel d'offres                           | PPE2 - Petit PV Bâtiment |
            | installation avec dispositif de stockage | oui                      |
            | capacité du dispositif                   | 3                        |
            | puissance du dispositif                  | 3                        |
        Alors le dispositif de stockage du projet lauréat devrait être mise à jour
        Et l'installation du projet lauréat devrait être mise à jour
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - Modification du couplage avec un dispositif de stockage pour le projet Du boulodrome de Marseille dans le département (.*) |
            | nom_projet | Du boulodrome de Marseille                                                                                                             |
            | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                                                  |
        Et un email a été envoyé à la dreal avec :
            | sujet      | Potentiel - Modification du couplage avec un dispositif de stockage pour le projet Du boulodrome de Marseille dans le département (.*) |
            | nom_projet | Du boulodrome de Marseille                                                                                                             |
            | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                                                  |

    Scénario: Modifier le dispositif de stockage d'un projet achevé
        Etant donné une attestation de conformité transmise pour le projet lauréat
        Quand un admin modifie le dispositif de stockage du projet lauréat avec :
            | appel d'offres                           | PPE2 - Petit PV Bâtiment |
            | installation avec dispositif de stockage | non                      |
        Alors le dispositif de stockage du projet lauréat devrait être mise à jour
        Et l'installation du projet lauréat devrait être mise à jour
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - Modification du couplage avec un dispositif de stockage pour le projet Du boulodrome de Marseille dans le département (.*) |
            | nom_projet | Du boulodrome de Marseille                                                                                                             |
            | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                                                  |
        Et un email a été envoyé à la dreal avec :
            | sujet      | Potentiel - Modification du couplage avec un dispositif de stockage pour le projet Du boulodrome de Marseille dans le département (.*) |
            | nom_projet | Du boulodrome de Marseille                                                                                                             |
            | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                                                  |

    Scénario: Impossible de modifier le dispositif de stockage avec une valeur identique à l'actuelle
        Quand un admin modifie le dispositif de stockage du projet lauréat avec :
            | appel d'offres                           | PPE2 - Petit PV Bâtiment |
            | installation avec dispositif de stockage | oui                      |
            | capacité du dispositif                   | 1                        |
            | puissance du dispositif                  | 1                        |
        Alors l'utilisateur devrait être informé que "Les informations relatives au dispositif de stockage sont identiques à celles du projet"

    Scénario: Impossible de modifier un projet avec dispositif de stockage avec des valeurs invalides
        Quand un admin modifie le dispositif de stockage du projet lauréat avec :
            | appel d'offres                           | PPE2 - Petit PV Bâtiment |
            | installation avec dispositif de stockage | oui                      |
            | capacité du dispositif                   |                          |
            | puissance du dispositif                  |                          |
        Alors l'utilisateur devrait être informé que "La capacité et la puissance du dispositif de stockage sont requises"

    Scénario: Impossible de modifier un projet sans dispositif de stockage avec des valeurs invalides
        Quand un admin modifie le dispositif de stockage du projet lauréat avec :
            | appel d'offres                           | PPE2 - Petit PV Bâtiment |
            | installation avec dispositif de stockage | non                      |
            | capacité du dispositif                   | 4                        |
            | puissance du dispositif                  | 5                        |
        Alors l'utilisateur devrait être informé que "La capacité et la puissance du dispositif de stockage ne peuvent être renseignées en l'absence de dispositif de stockage"
