# language: fr
Fonctionnalité: Accorder le recours d'un projet éliminé

    Contexte:
        Etant donné le projet éliminé "Du boulodrome de Marseille"
        Et le porteur "Marcel Patoulatchi" ayant accés au projet éliminé "Du boulodrome de Marseille"

    @NotImplemented
    Scénario: Un DGEC validateur accorde le recours d'un projet éliminé
        Etant donné un recours en cours pour le projet éliminé
        Quand le DGEC validateur accorde le recours pour le projet éliminé
        Alors le recours du projet éliminé devrait être accordé
        Et les garanties financières actuelles devraient être consultables pour le projet "Du boulodrome de Marseille"
        Et des garanties financières devraient être attendues pour le projet lauréat "Du boulodrome de Marseille" avec :
            | motif | recours-accordé |

    Scénario: Impossible d'accorder le recours d'un projet éliminé si le recours a déjà été accordé
        Etant donné un recours accordé pour le projet éliminé
        Quand le DGEC validateur accorde le recours pour le projet éliminé
        Alors le DGEC validateur devrait être informé que "Le recours a déjà été accordé"

    Scénario: Impossible d'accorder le recours d'un projet éliminé si le recours a déjà été rejeté
        Etant donné un recours rejeté pour le projet éliminé
        Quand le DGEC validateur accorde le recours pour le projet éliminé
        Alors le DGEC validateur devrait être informé que "Le recours a déjà été rejeté"

    Scénario: Impossible d'accorder le recours d'un projet éliminé si aucun recours n'a été demandé
        Quand le DGEC validateur accorde le recours pour le projet éliminé
        Alors le DGEC validateur devrait être informé que "Aucun recours n'est en cours"
