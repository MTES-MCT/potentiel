# language: fr
Fonctionnalité: Accorder le changement de représentant légal d'un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et le porteur "Marcel Patoulatchi" ayant accés au projet lauréat "Du boulodrome de Marseille"
        Et le DGEC validateur "Robert Robichet"
        Et la DREAL associée au projet lauréat

    @NotImplemented
    Plan du scénario: Accorder le changement de représentant légal d'un projet lauréat
        Etant donné une demande de changement de représentant légal en cours pour le projet lauréat
        Quand <l'utilisateur autorisé> accorde le changement de représentant légal pour le projet lauréat
        Alors le changement de représentant légal du projet lauréat devrait être accordé
        Et le représentant légal du projet lauréat devrait être mis à jour
        Et l'historique des changements de représentant légal du projet lauréat devrait être mis à jour

        Exemples:
            | l'utilisateur autorisé      |
            | le DGEC validateur          |
            | la DREAL associée au projet |

    @NotImplemented
    Scénario: Impossible d'accorder le changement de représentant légal d'un projet lauréat si le changement a déjà été accordé
        Etant donné une demande de changement de représentant légal acordée pour le projet lauréat
        Quand le DGEC validateur accorde le changement de représentant légal pour le projet lauréat
        Alors le DGEC validateur devrait être informé que "Aucun changement de représentant légal n'est en cours"

    @NotImplemented
    Scénario: Impossible d'accorder le changement de représentant légal d'un projet lauréat si le changement a déjà été rejeté
        Etant donné une demande de changement de représentant légal rejetée pour le projet lauréat
        Quand le DGEC validateur accorde le changement de représentant légal pour le projet lauréat
        Alors le DGEC validateur devrait être informé que "Aucun changement de représentant légal n'est en cours"

    @NotImplemented
    Scénario: Impossible d'accorder le changement de représentant légal d'un projet lauréat si aucun changement n'a été demandé
        Quand le DGEC validateur accorde le changement de représentant légal pour le projet l
        Alors le DGEC validateur devrait être informé que "Aucun changement de représentant légal n'est en cours"
