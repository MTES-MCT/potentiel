# language: fr
Fonctionnalité: Rejeter la demande de changement de représentant légal d'un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et le porteur "Marcel Patoulatchi" ayant accés au projet lauréat "Du boulodrome de Marseille"
        Et la DREAL associée au projet lauréat

    @NotImplemented
    Plan du scénario: Rejeter le changement de représentant légal d'un projet lauréat
        Etant donné une demande de changement de représentant légal en cours pour le projet lauréat
        Quand <l'utilisateur autorisé> rejette le changement de représentant légal pour le projet lauréat
        Alors la demande de changement de représentant légal du projet lauréat devrait être rejetée
        Et l'historique des changements de représentant légal du projet lauréat devrait être mis à jour
        Mais le représentant légal du projet lauréat ne devrait pas avoir été modifié

        Exemples:
            | l'utilisateur autorisé      |
            | le DGEC validateur          |
            | la DREAL associée au projet |

    @NotImplemented
    Scénario: Impossible de rejeter la demande de changement de représentant légal d'un projet lauréat si le changement a déjà été accordé
        Etant donné une demande de changement de représentant légal accordée pour le projet lauréat
        Quand le DGEC validateur rejette la demande de changement de représentant légal pour le projet lauréat
        Alors le DGEC validateur devrait être informé que "Aucun changement de représentant légal n'est en cours"

    @NotImplemented
    Scénario: Impossible de rejeter la demande de changement de représentant légal d'un projet lauréat si le changement a déjà été rejeté
        Etant donné une demande de changement de représentant légal rejetée pour le projet lauréat
        Quand le DGEC validateur rejette la demande de changement de représentant légal pour le projet lauréat
        Alors le DGEC validateur devrait être informé que "Aucun changement de représentant légal n'est en cours"

    @NotImplemented
    Scénario: Impossible de rejeter la demande de changement de représentant légal d'un projet lauréat si aucun changement n'a été demandé
        Quand le DGEC validateur rejette la demande de changement de représentant légal pour le projet lauréat
        Alors le DGEC validateur devrait être informé que "Aucun changement de représentant légal n'est en cours"
