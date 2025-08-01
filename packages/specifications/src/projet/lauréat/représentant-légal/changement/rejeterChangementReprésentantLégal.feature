# language: fr
@représentant-légal
Fonctionnalité: Rejeter la demande de changement de représentant légal d'un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et la dreal "Dreal du sud-ouest" associée à la région du projet
        Et un cahier des charges permettant la modification du projet

    Plan du scénario: Rejeter la demande de changement de représentant légal d'un projet lauréat
        Etant donné une demande de changement de représentant légal en cours pour le projet lauréat
        Quand <l'utilisateur autorisé> rejette la demande de changement de représentant légal pour le projet lauréat
        Alors la demande de changement de représentant légal du projet lauréat devrait être rejetée
        Mais le représentant légal du projet lauréat ne devrait pas être mis à jour
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - La demande de modification du représentant légal pour le projet Du boulodrome de Marseille dans le département(.*) a été rejetée |
            | nom_projet | Du boulodrome de Marseille                                                                                                                   |
            | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                                                        |
            | type       | rejet                                                                                                                                        |
        Et une tâche "gestion automatique de la demande de changement de représentant légal" n'est plus planifiée pour le projet lauréat
        Et une tâche "rappel d'instruction de la demande de changement de représentant légal à deux mois" n'est plus planifiée pour le projet lauréat

        Exemples:
            | l'utilisateur autorisé      |
            | le DGEC validateur          |
            | la DREAL associée au projet |

    Scénario: Rejet automatique de la demande de changement de représentant légal d'un projet lauréat
        Etant donné le projet lauréat "Du boulodrome de Besançon" sur une période d'appel d'offre avec rejet automatique du changement de représentant légal
        Et la dreal "Dreal du nord-est" associée à la région du projet
        Et une demande de changement de représentant légal en cours pour le projet lauréat
        Quand le système rejette automatiquement la demande de changement de représentant légal pour le projet lauréat
        Alors la demande de changement de représentant légal du projet lauréat devrait être rejetée automatiquement
        Mais le représentant légal du projet lauréat ne devrait pas être mis à jour
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - La demande de modification du représentant légal pour le projet Du boulodrome de Besançon dans le département(.*) a été rejetée |
            | nom_projet | Du boulodrome de Besançon                                                                                                                   |
            | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                                                       |
            | type       | rejet                                                                                                                                       |
        Et un email a été envoyé à la dreal avec :
            | type       | rejet                                                                                                                                                       |
            | sujet      | Potentiel - La demande de modification du représentant légal pour le projet Du boulodrome de Besançon dans le département(.*) a été rejetée automatiquement |
            | nom_projet | Du boulodrome de Besançon                                                                                                                                   |
            | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                                                                       |

    Scénario: Impossible de rejeter la demande de changement de représentant légal d'un projet lauréat si le changement a déjà été rejeté
        Etant donné une demande de changement de représentant légal rejetée pour le projet lauréat
        Quand le DGEC validateur rejette la demande de changement de représentant légal pour le projet lauréat
        Alors le DGEC validateur devrait être informé que "Aucun changement de représentant légal n'est en cours"

    Scénario: Impossible de rejeter la demande de changement de représentant légal d'un projet lauréat si aucun changement n'a été demandé
        Quand le DGEC validateur rejette la demande de changement de représentant légal pour le projet lauréat
        Alors le DGEC validateur devrait être informé que "Aucun changement de représentant légal n'est en cours"

    Scénario: Impossible de rejeter la demande de changement de représentant légal d'un projet lauréat si le changement a déjà été accordé
        Etant donné une demande de changement de représentant légal accordée pour le projet lauréat
        Quand le DGEC validateur rejette la demande de changement de représentant légal pour le projet lauréat
        Alors le DGEC validateur devrait être informé que "Aucun changement de représentant légal n'est en cours"
