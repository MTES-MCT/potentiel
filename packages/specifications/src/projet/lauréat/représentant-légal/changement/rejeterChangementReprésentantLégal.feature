# language: fr
@select
Fonctionnalité: Rejeter la demande de changement de représentant légal d'un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et le porteur "Marcel Patoulatchi" ayant accés au projet lauréat "Du boulodrome de Marseille"
        Et la dreal "Dreal du sud-ouest" associée à la région du projet

    Plan du scénario: Rejeter la demande de changement de représentant légal d'un projet lauréat
        Etant donné une demande de changement de représentant légal en cours pour le projet lauréat
        Quand <l'utilisateur autorisé> rejete la demande de changement de représentant légal pour le projet lauréat
        Alors la demande de changement de représentant légal du projet lauréat devrait être rejetée
        Mais le représentant légal du projet lauréat ne devrait pas être mis à jour

        Exemples:
            | l'utilisateur autorisé      |
            | le DGEC validateur          |
            | la DREAL associée au projet |

    Scénario: Impossible de rejeter la demande de changement de représentant légal d'un projet lauréat si le changement a déjà été rejeté
        Etant donné une demande de changement de représentant légal rejetée pour le projet lauréat
        Quand le DGEC validateur rejete la demande de changement de représentant légal pour le projet lauréat
        Alors le DGEC validateur devrait être informé que "Aucun changement de représentant légal n'est en cours"

    Scénario: Impossible de rejeter la demande de changement de représentant légal d'un projet lauréat si aucun changement n'a été demandé
        Quand le DGEC validateur rejete la demande de changement de représentant légal pour le projet lauréat
        Alors le DGEC validateur devrait être informé que "Aucun changement de représentant légal n'est en cours"

    Scénario: Impossible de rejeter la demande de changement de représentant légal d'un projet lauréat si le changement a déjà été accordé
        Etant donné une demande de changement de représentant légal accordée pour le projet lauréat
        Quand le DGEC validateur rejete la demande de changement de représentant légal pour le projet lauréat
        Alors le DGEC validateur devrait être informé que "Aucun changement de représentant légal n'est en cours"
