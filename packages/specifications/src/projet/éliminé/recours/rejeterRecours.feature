# language: fr
Fonctionnalité: Rejeter le recours d'un projet éliminé

    Contexte:
        Etant donné le projet éliminé "Du boulodrome de Marseille"

    Scénario: Un DGEC validateur rejette le recours d'un projet éliminé
        Etant donné un recours en cours pour le projet éliminé "Du boulodrome de Marseille"
        Quand le DGEC validateur rejette le recours pour le projet éliminé "Du boulodrome de Marseille" avec :
            | Le format de la réponse signée  | application/pdf                                                              |
            | Le contenu de la réponse signée | Le contenu de la la réponse signée expliquant la raison du rejet par la DGEC |
        Alors le recours du projet éliminé "Du boulodrome de Marseille" devrait être rejeté

    Scénario: Impossible de rejetter le recours d'un projet éliminé si le recours a déjà été accordé
        Etant donné un recours accordé pour le projet éliminé "Du boulodrome de Marseille"
        Quand le DGEC validateur rejette le recours pour le projet éliminé "Du boulodrome de Marseille"
        Alors le DGEC validateur devrait être informé que "Le recours a déjà été accordé"

    Scénario: Impossible de rejetter le recours d'un projet éliminé si aucun recours n'a été demandé
        Quand le DGEC validateur rejette le recours pour le projet éliminé "Du boulodrome de Marseille"
        Alors le DGEC validateur devrait être informé que "Aucun recours n'est en cours"
