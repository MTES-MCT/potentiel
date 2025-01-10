# language: fr
Fonctionnalité: Modifier l'actionnaire d'un projet lauréat

    Scénario: Modifier l'actionnaire d'un projet lauréat
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et le porteur "Marcel Patoulatchi" ayant accés au projet lauréat "Du boulodrome de Marseille"
        Et la dreal "DREAL" associée à la région du projet
        Quand le DGEC validateur modifie l'actionnaire pour le projet lauréat
        Alors l'actionnaire du projet lauréat devrait être mis à jour
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - Modification de l'actionnaire pour le projet Du boulodrome de Marseille dans le département(.*) |
            | nom_projet | Du boulodrome de Marseille                                                                                  |
            | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                       |
        Et un email a été envoyé à la dreal avec :
            | sujet      | Potentiel - Modification de l'actionnaire pour le projet Du boulodrome de Marseille dans le département(.*) |
            | nom_projet | Du boulodrome de Marseille                                                                                  |
            | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                       |
        Quand la DREAL modifie l'actionnaire pour le projet lauréat
        Alors l'actionnaire du projet lauréat devrait être mis à jour
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - Modification de l'actionnaire pour le projet Du boulodrome de Marseille dans le département(.*) |
            | nom_projet | Du boulodrome de Marseille                                                                                  |
            | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                       |
        Et un email a été envoyé à la dreal avec :
            | sujet      | Potentiel - Modification de l'actionnaire pour le projet Du boulodrome de Marseille dans le département(.*) |
            | nom_projet | Du boulodrome de Marseille                                                                                  |
            | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                       |
        Quand le porteur modifie l'actionnaire pour le projet lauréat
        Alors l'actionnaire du projet lauréat devrait être mis à jour
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - Modification de l'actionnaire pour le projet Du boulodrome de Marseille dans le département(.*) |
            | nom_projet | Du boulodrome de Marseille                                                                                  |
            | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                       |
        Et un email a été envoyé à la dreal avec :
            | sujet      | Potentiel - Modification de l'actionnaire pour le projet Du boulodrome de Marseille dans le département(.*) |
            | nom_projet | Du boulodrome de Marseille                                                                                  |
            | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                       |

    Scénario: Impossible de modifier l'actionnaire si l'actionnaire est inexistant
        Quand le DGEC validateur modifie l'actionnaire pour le projet lauréat
        Alors l'utilisateur devrait être informé que "L'actionnaire n'existe pas"

    Scénario: Impossible de modifier l'actionnaire avec une valeur identique
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Quand le DGEC validateur modifie l'actionnaire avec la même valeur pour le projet lauréat
        Alors l'utilisateur devrait être informé que "Le nouvel actionnaire est identique à celui associé au projet"

    Scénario: Impossible de modifier l'actionnaire d'un projet lauréat alors qu'un changement d'actionnaire est en cours
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et une demande de changement d'actionnaire en cours pour le projet lauréat
        Quand le DGEC validateur modifie l'actionnaire pour le projet lauréat
        Alors l'utilisateur devrait être informé que "Une demande de changement est déjà en cours"
