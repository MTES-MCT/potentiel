# language: fr
@recours
@rejeter-recours
Fonctionnalité: Rejeter le recours d'un projet éliminé

    Contexte:
        Etant donné le projet éliminé "Du boulodrome de Marseille" avec :
            | appel d'offre | PPE2 - Innovation |

    Scénario: Un DGEC validateur rejette le recours d'un projet éliminé
        Etant donné une demande de recours en cours pour le projet éliminé
        Quand le DGEC validateur rejette le recours pour le projet éliminé
        Alors le recours du projet éliminé devrait être rejeté

    Scénario: Un DGEC validateur rejette le recours en instruction d'un projet éliminé
        Etant donné une demande de recours en instruction pour le projet éliminé
        Quand le DGEC validateur rejette le recours pour le projet éliminé
        Alors le recours du projet éliminé devrait être rejeté

    Scénario: Impossible de rejetter le recours d'un projet éliminé si le recours a déjà été accordé
        Etant donné un recours accordé pour le projet éliminé
        Quand le DGEC validateur rejette le recours pour le projet éliminé
        Alors le DGEC validateur devrait être informé que "Le recours a déjà été accordé"

    Scénario: Impossible de rejetter le recours d'un projet éliminé si aucun recours n'a été demandé
        Quand le DGEC validateur rejette le recours pour le projet éliminé
        Alors le DGEC validateur devrait être informé que "Aucun recours n'est en cours"
