# language: fr
@installation-avec-dispositif-de-stockage
Fonctionnalité: Modifier l'information relative au couplage de l'installation avec un dispositif de stockage

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offre                            | PPE2 - Petit PV Bâtiment |
            | installation avec dispositif de stockage | oui                      |
        Et la dreal "Dreal du sud" associée à la région du projet

    Scénario: Modifier l'information relative au couplage de l'installation avec un dispositif de stockage d'un projet lauréat
        Quand un admin modifie l'information concernant l'installation avec dispositif de stockage du projet lauréat avec :
            | appel d'offre                            | PPE2 - Petit PV Bâtiment |
            | installation avec dispositif de stockage | non                      |
        Alors l'information concernant le couplage de l'installation avec un dispositif de stockage pour le  projet lauréat devrait être mise à jour
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - Modification du couplage avec un dispositif de stockage pour le projet Du boulodrome de Marseille dans le département (.*) |
            | nom_projet | Du boulodrome de Marseille                                                                                                             |
            | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                                                  |
        Et un email a été envoyé à la dreal avec :
            | sujet      | Potentiel - Modification du couplage avec un dispositif de stockage pour le projet Du boulodrome de Marseille dans le département (.*) |
            | nom_projet | Du boulodrome de Marseille                                                                                                             |
            | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                                                  |

    Scénario: Modifier l'information relative au couplage de l'installation avec un dispositif de stockage d'un projet abandonné
        Etant donné un abandon accordé pour le projet lauréat
        Quand un admin modifie l'information concernant l'installation avec dispositif de stockage du projet lauréat avec :
            | appel d'offre                            | PPE2 - Petit PV Bâtiment |
            | installation avec dispositif de stockage | non                      |
        Alors l'information concernant le couplage de l'installation avec un dispositif de stockage pour le  projet lauréat devrait être mise à jour
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - Modification du couplage avec un dispositif de stockage pour le projet Du boulodrome de Marseille dans le département (.*) |
            | nom_projet | Du boulodrome de Marseille                                                                                                             |
            | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                                                  |
        Et un email a été envoyé à la dreal avec :
            | sujet      | Potentiel - Modification du couplage avec un dispositif de stockage pour le projet Du boulodrome de Marseille dans le département (.*) |
            | nom_projet | Du boulodrome de Marseille                                                                                                             |
            | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                                                  |

    Scénario: Modifier l'information relative au couplage de l'installation avec un dispositif de stockage d'un projet achevé
        Etant donné une attestation de conformité transmise pour le projet lauréat
        Quand un admin modifie l'information concernant l'installation avec dispositif de stockage du projet lauréat avec :
            | appel d'offre                            | PPE2 - Petit PV Bâtiment |
            | installation avec dispositif de stockage | non                      |
        Alors l'information concernant le couplage de l'installation avec un dispositif de stockage pour le  projet lauréat devrait être mise à jour
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - Modification du couplage avec un dispositif de stockage pour le projet Du boulodrome de Marseille dans le département (.*) |
            | nom_projet | Du boulodrome de Marseille                                                                                                             |
            | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                                                  |
        Et un email a été envoyé à la dreal avec :
            | sujet      | Potentiel - Modification du couplage avec un dispositif de stockage pour le projet Du boulodrome de Marseille dans le département (.*) |
            | nom_projet | Du boulodrome de Marseille                                                                                                             |
            | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                                                  |

    Scénario: Impossible de modifier l'information relative au couplage de l'installation avec un dispositif de stockage avec une valeur identique à l'actuelle
        Quand un admin modifie l'information concernant l'installation avec dispositif de stockage du projet lauréat avec :
            | appel d'offre                            | PPE2 - Petit PV Bâtiment |
            | installation avec dispositif de stockage | oui                      |
        Alors l'utilisateur devrait être informé que "Pour enregistrer une modification vous devez renseigner une valeur différente de la valeur actuelle"
