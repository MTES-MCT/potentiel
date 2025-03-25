# language: fr
@NotImplemented
Fonctionnalité: Modifier la puissance d'un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et le porteur "Marcel Patoulatchi" ayant accés au projet lauréat "Du boulodrome de Marseille"
        Et la dreal "Dreal du sud" associée à la région du projet

    # pour la fixture
    # pour la modification, la raison est optionnelle et il n'y a pas besoin de pièce justificative
    Scénario: Modifier la puissance d'un projet lauréat par une dreal ou un admin
        Quand <l'utilisateur autorisé> modifie la puissance pour le projet lauréat
        Alors la puissance du projet lauréat devrait être mis à jour
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - Modification de la puissance pour le projet Du boulodrome de Marseille dans le département(.*) |
            | nom_projet | Du boulodrome de Marseille                                                                                 |
            | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                      |
        Et un email a été envoyé à la dreal avec :
            | sujet      | Potentiel - Modification de la puissance pour le projet Du boulodrome de Marseille dans le département(.*) |
            | nom_projet | Du boulodrome de Marseille                                                                                 |
            | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                      |

        Exemples:
            | l'utilisateur autorisé      |
            | le DGEC validateur          |
            | la DREAL associée au projet |

    Scénario: Modifier la puissance d'un projet lauréat achevé par une dreal ou un admin
        Etant donné un abandon accordé pour le projet lauréat
        Quand <l'utilisateur autorisé> modifie la puissance pour le projet lauréat
        Alors la puissance du projet lauréat devrait être mis à jour
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - Modification de la puissance pour le projet Du boulodrome de Marseille dans le département(.*) |
            | nom_projet | Du boulodrome de Marseille                                                                                 |
            | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                      |
        Et un email a été envoyé à la dreal avec :
            | sujet      | Potentiel - Modification de la puissance pour le projet Du boulodrome de Marseille dans le département(.*) |
            | nom_projet | Du boulodrome de Marseille                                                                                 |
            | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                      |

        Exemples:
            | l'utilisateur autorisé      |
            | le DGEC validateur          |
            | la DREAL associée au projet |

    Scénario: Modifier la puissance d'un projet lauréat abandonné par une dreal ou un admin
        Etant donné une attestation de conformité transmise pour le projet lauréat
        Quand <l'utilisateur autorisé> modifie la puissance pour le projet lauréat
        Alors la puissance du projet lauréat devrait être mis à jour
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - Modification de la puissance pour le projet Du boulodrome de Marseille dans le département(.*) |
            | nom_projet | Du boulodrome de Marseille                                                                                 |
            | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                      |
        Et un email a été envoyé à la dreal avec :
            | sujet      | Potentiel - Modification de la puissance pour le projet Du boulodrome de Marseille dans le département(.*) |
            | nom_projet | Du boulodrome de Marseille                                                                                 |
            | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                      |

        Exemples:
            | l'utilisateur autorisé      |
            | le DGEC validateur          |
            | la DREAL associée au projet |

    Scénario: Modifier la puissance avec une valeur identique
        Quand le DGEC validateur modifie la puissance avec la même valeur pour le projet lauréat
        Alors l'utilisateur devrait être informé que "La puissance doit avoir une valeur différente"

    Scénario: Impossible de demander le changement de puissance si la nouvelle valeur est nulle ou négative
        Quand le DGEC validateur demande le changement de puissance pour le projet lauréat avec :
            | ratio puissance | <Ratio> |
        Alors l'utilisateur devrait être informé que "La puissance d'un projet doit être une valeur positive"

        Exemples:
            | Ratio |
            | 0     |
            | -1    |

    Scénario: Impossible de modifier la puissance si la puissance est inexistante
        Etant donné le projet éliminé "Du boulodrome de Lyon"
        Quand le DGEC validateur modifie la puissance pour le projet éliminé
        Alors l'utilisateur devrait être informé que "La puissance n'existe pas"

    Scénario: Impossible de modifier la puissance d'un projet lauréat alors qu'un changement de puissance est en cours
        Etant donné une demande de changement de puissance à la baisse en cours pour le projet lauréat
        Quand la DREAL modifie la puissance pour le projet lauréat
        Alors l'utilisateur devrait être informé que "Une demande de changement est déjà en cours"
