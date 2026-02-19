# language: fr
@représentant-légal
Fonctionnalité: Accorder la demande de changement de représentant légal d'un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et la dreal "Dreal du sud-ouest" associée à la région du projet
        Et un cahier des charges permettant la modification du projet

    Plan du scénario: Accorder la demande de changement de représentant légal d'un projet lauréat
        Etant donné une demande de changement de représentant légal en cours pour le projet lauréat
        Quand <l'utilisateur autorisé> accorde la demande de changement de représentant légal pour le projet lauréat
        Alors la demande de changement de représentant légal du projet lauréat devrait être consultable
        Et le représentant légal du projet lauréat devrait être mis à jour
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - La demande de modification du représentant légal pour le projet Du boulodrome de Marseille dans le département(.*) a été accordée |
            | nom_projet | Du boulodrome de Marseille                                                                                                                    |
            | url        | https://potentiel.beta.gouv.fr/laureats/.*                                                                                                    |
            | type       | accord                                                                                                                                        |
        Et il n'y a pas de tâche "gestion automatique de la demande de changement de représentant légal" planifiée pour le projet lauréat
        Et il n'y a pas de tâche "rappel d'instruction de la demande de changement de représentant légal à deux mois" planifiée pour le projet lauréat

        Exemples:
            | l'utilisateur autorisé      |
            | le DGEC validateur          |
            | la DREAL associée au projet |

    Plan du scénario: Corriger et accorder la demande de changement de représentant légal d'un projet lauréat
        Etant donné une demande de changement de représentant légal en cours pour le projet lauréat
        Quand <l'utilisateur autorisé> corrige puis accorde la demande de changement de représentant légal pour le projet lauréat
        Alors la demande de changement de représentant légal du projet lauréat devrait être consultable
        Et le représentant légal du projet lauréat devrait être mis à jour
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - Correction et accord de la demande de modification du représentant légal pour le projet Du boulodrome de Marseille dans le département(.*) |
            | nom_projet | Du boulodrome de Marseille                                                                                                                             |
            | url        | https://potentiel.beta.gouv.fr/laureats/.*                                                                                                             |

        Exemples:
            | l'utilisateur autorisé      |
            | le DGEC validateur          |
            | la DREAL associée au projet |

    Scénario: Accord automatique de la demande de changement de représentant légal d'un projet lauréat
        Etant donné le projet lauréat "Du boulodrome de Bordeaux" sur une période d'appel d'offres avec accord automatique du changement de représentant légal
        Et la dreal "Dreal du sud-ouest" associée à la région du projet
        Et une demande de changement de représentant légal en cours pour le projet lauréat
        Quand le système accorde automatiquement la demande de changement de représentant légal pour le projet lauréat
        Alors la demande de changement de représentant légal du projet lauréat devrait être accordée automatiquement
        Et le représentant légal du projet lauréat devrait être mis à jour
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - La demande de modification du représentant légal pour le projet Du boulodrome de Bordeaux dans le département(.*) a été accordée |
            | nom_projet | Du boulodrome de Bordeaux                                                                                                                    |
            | url        | https://potentiel.beta.gouv.fr/laureats/.*                                                                                                   |
            | type       | accord                                                                                                                                       |
        Et un email a été envoyé à la dreal avec :
            | type       | accord                                                                                                                                                       |
            | sujet      | Potentiel - La demande de modification du représentant légal pour le projet Du boulodrome de Bordeaux dans le département(.*) a été accordée automatiquement |
            | nom_projet | Du boulodrome de Bordeaux                                                                                                                                    |
            | url        | https://potentiel.beta.gouv.fr/laureats/.*                                                                                                                   |

    Scénario: Impossible d'accorder la demande de changement de représentant légal d'un projet lauréat si le changement a déjà été accordé
        Etant donné une demande de changement de représentant légal accordée pour le projet lauréat
        Quand le DGEC validateur accorde la demande de changement de représentant légal pour le projet lauréat
        Alors le DGEC validateur devrait être informé que "Aucun changement de représentant légal n'est en cours"

    Scénario: Impossible d'accorder la demande de changement de représentant légal d'un projet lauréat si aucun changement n'a été demandé
        Quand le DGEC validateur accorde la demande de changement de représentant légal pour le projet lauréat
        Alors le DGEC validateur devrait être informé que "Aucun changement de représentant légal n'est en cours"

    Scénario: Impossible d'accorder la demande de changement de représentant légal d'un projet lauréat si le changement a déjà été rejeté
        Etant donné une demande de changement de représentant légal rejetée pour le projet lauréat
        Quand le DGEC validateur accorde la demande de changement de représentant légal pour le projet lauréat
        Alors le DGEC validateur devrait être informé que "Aucun changement de représentant légal n'est en cours"
