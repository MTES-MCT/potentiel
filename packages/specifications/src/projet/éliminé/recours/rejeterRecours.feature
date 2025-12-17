# language: fr
@recours
Fonctionnalité: Rejeter le recours d'un projet éliminé

    Contexte:
        Etant donné le projet éliminé "Du boulodrome de Marseille" avec :
            | appel d'offres | PPE2 - Innovation |

    Scénario: Un DGEC validateur rejette le recours d'un projet éliminé
        Etant donné une demande de recours en cours pour le projet éliminé
        Quand le DGEC validateur rejette le recours pour le projet éliminé
        Alors le recours du projet éliminé devrait être rejeté
        Et un email a été envoyé à la dgec avec :
            | sujet      | Potentiel - Demande de recours rejetée pour le projet Du boulodrome de Marseille .* |
            | nom_projet | Du boulodrome de Marseille                                                          |
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - Demande de recours rejetée pour le projet Du boulodrome de Marseille .* |
            | nom_projet | Du boulodrome de Marseille                                                          |
        Et un email a été envoyé à la cre avec :
            | sujet      | Potentiel - Demande de recours rejetée pour le projet Du boulodrome de Marseille .* |
            | nom_projet | Du boulodrome de Marseille                                                          |

    Scénario: Un DGEC validateur rejette le recours en instruction d'un projet éliminé
        Etant donné une demande de recours en instruction pour le projet éliminé
        Quand le DGEC validateur rejette le recours pour le projet éliminé
        Alors le recours du projet éliminé devrait être rejeté

    Scénario: Impossible de rejetter le recours d'un projet éliminé si le recours a déjà été accordé
        Etant donné une demande de recours accordée pour le projet éliminé
        Quand le DGEC validateur rejette le recours pour le projet éliminé
        Alors le DGEC validateur devrait être informé que "Le recours a déjà été accordé"

    Scénario: Impossible de rejetter le recours d'un projet éliminé si aucun recours n'a été demandé
        Quand le DGEC validateur rejette le recours pour le projet éliminé
        Alors le DGEC validateur devrait être informé que "Aucun recours n'est en cours"
