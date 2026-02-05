# language: fr
@actionnaire
Fonctionnalité: Modifier l'actionnaire d'un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et la dreal "DREAL" associée à la région du projet
        Et un cahier des charges permettant la modification du projet

    Scénario: Modifier l'actionnaire d'un projet lauréat par une dreal ou un admin
        Quand <l'utilisateur autorisé> modifie l'actionnaire pour le projet lauréat
        Alors l'actionnaire du projet lauréat devrait être mis à jour
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - Du boulodrome de Marseille - Actionnaire modifié |
            | nom_projet | Du boulodrome de Marseille                                   |
            | url        | https://potentiel.beta.gouv.fr/projets/.*                    |
        Et un email a été envoyé à la dreal avec :
            | sujet      | Potentiel - Du boulodrome de Marseille - Actionnaire modifié |
            | nom_projet | Du boulodrome de Marseille                                   |
            | url        | https://potentiel.beta.gouv.fr/projets/.*                    |

        Exemples:
            | l'utilisateur autorisé      |
            | le DGEC validateur          |
            | la DREAL associée au projet |

    Scénario: Modifier l'actionnaire d'un projet lauréat achevé par une dreal ou un admin
        Etant donné une demande d'abandon accordée pour le projet lauréat
        Quand <l'utilisateur autorisé> modifie l'actionnaire pour le projet lauréat
        Alors l'actionnaire du projet lauréat devrait être mis à jour
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - Du boulodrome de Marseille - Actionnaire modifié |
            | nom_projet | Du boulodrome de Marseille                                   |
            | url        | https://potentiel.beta.gouv.fr/projets/.*                    |
        Et un email a été envoyé à la dreal avec :
            | sujet      | Potentiel - Du boulodrome de Marseille - Actionnaire modifié |
            | nom_projet | Du boulodrome de Marseille                                   |
            | url        | https://potentiel.beta.gouv.fr/projets/.*                    |

        Exemples:
            | l'utilisateur autorisé      |
            | le DGEC validateur          |
            | la DREAL associée au projet |

    Scénario: Modifier l'actionnaire d'un projet lauréat abandonné par une dreal ou un admin
        Etant donné une attestation de conformité transmise pour le projet lauréat
        Quand <l'utilisateur autorisé> modifie l'actionnaire pour le projet lauréat
        Alors l'actionnaire du projet lauréat devrait être mis à jour
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - Du boulodrome de Marseille - Actionnaire modifié |
            | nom_projet | Du boulodrome de Marseille                                   |
            | url        | https://potentiel.beta.gouv.fr/projets/.*                    |
        Et un email a été envoyé à la dreal avec :
            | sujet      | Potentiel - Du boulodrome de Marseille - Actionnaire modifié |
            | nom_projet | Du boulodrome de Marseille                                   |
            | url        | https://potentiel.beta.gouv.fr/projets/.*                    |

        Exemples:
            | l'utilisateur autorisé      |
            | le DGEC validateur          |
            | la DREAL associée au projet |

    Scénario: Modifier l'actionnaire avec une valeur identique
        Quand le DGEC validateur modifie l'actionnaire avec la même valeur pour le projet lauréat
        Alors l'actionnaire du projet lauréat devrait être mis à jour

    Scénario: Impossible de modifier l'actionnaire si l'actionnaire est inexistant
        Etant donné le projet éliminé "Du boulodrome de Lyon"
        Quand le DGEC validateur modifie l'actionnaire pour le projet éliminé
        Alors l'utilisateur devrait être informé que "Le projet lauréat n'existe pas"

    Scénario: Impossible de modifier l'actionnaire d'un projet lauréat alors qu'un changement d'actionnaire est en cours
        Etant donné le projet lauréat "Du boulodrome de Lyon" avec :
            | appel d'offres | Eolien                      |
            | période        | 6                           |
            | actionnariat   | investissement-participatif |
        Et une demande de changement d'actionnaire en cours pour le projet lauréat
        Quand le DGEC validateur modifie l'actionnaire pour le projet lauréat
        Alors l'utilisateur devrait être informé que "Une demande de changement est déjà en cours"
