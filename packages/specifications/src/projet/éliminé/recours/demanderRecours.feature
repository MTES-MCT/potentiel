# language: fr
@recours
Fonctionnalité: Demander le recours d'un projet éliminé

    Contexte:
        Etant donné le projet éliminé "Du boulodrome de Marseille" avec :
            | appel d'offres | PPE2 - Bâtiment |

    Scénario: Un porteur demande le recours d'un projet éliminé
        Quand le porteur demande le recours pour le projet éliminé
        Alors le recours du projet éliminé devrait être demandé
        Et un email a été envoyé à la dgec avec :
            | sujet      | Potentiel - Nouvelle demande de recours pour le projet Du boulodrome de Marseille .* |
            | nom_projet | Du boulodrome de Marseille                                                           |
            | url        | https://potentiel.beta.gouv.fr/elimines/.*/recours                                   |
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - Nouvelle demande de recours pour le projet Du boulodrome de Marseille .* |
            | nom_projet | Du boulodrome de Marseille                                                           |
            | url        | https://potentiel.beta.gouv.fr/elimines/.*/recours                                   |

    Scénario: Un porteur demande le recours d'un projet éliminé
        Quand le porteur demande le recours pour le projet éliminé
        Alors le recours du projet éliminé devrait être demandé

    Scénario: Un porteur demande le recours d'un projet éliminé après un rejet
        Etant donné une demande de recours rejetée pour le projet éliminé
        Quand le porteur demande le recours pour le projet éliminé
        Alors le recours du projet éliminé devrait être de nouveau demandé

    Scénario: Impossible de demander un recours pour un projet si le recours est déjà demandé
        Etant donné une demande de recours en cours pour le projet éliminé
        Quand le porteur demande le recours pour le projet éliminé
        Alors le porteur devrait être informé que "Un recours est déjà en cours"

    Scénario: Impossible de demander un recours pour un projet si le recours est déjà en instruction
        Etant donné une demande de recours en instruction pour le projet éliminé
        Quand le porteur demande le recours pour le projet éliminé
        Alors le porteur devrait être informé que "Un recours est déjà en cours"

    Scénario: Impossible de demander un recours pour un projet si le recours est accordé
        Etant donné une demande de recours accordée pour le projet éliminé
        Quand le porteur demande le recours pour le projet éliminé
        Alors le porteur devrait être informé que "Le recours a déjà été accordé"

    Scénario: Impossible de demander un recours pour un projet d'une période nécessitant le choix d'un cahier des charges
        Etant donné le projet éliminé "MIOS" avec :
            | appel d'offres | CRE4 - Autoconsommation métropole |
            | période        | 10                                |
        Quand le porteur demande le recours pour le projet éliminé
        Alors le porteur devrait être informé que "Le cahier des charges de ce projet ne permet pas ce changement"

    @NotImplemented
    Scénario: Impossible de demander un recours pour un projet éliminé inexistant
        Etant donné le projet lauréat "MIOS"
        Quand le porteur demande le recours pour le projet lauréat
        Alors le porteur devrait être informé que "Il est impossible de demander un recours pour un projet lauréat"
