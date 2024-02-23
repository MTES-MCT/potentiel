#Language: fr-FR
@NotImplemented
Fonctionnalité: Accorder le recours d'un projet éliminé
    Contexte:
        Etant donné le projet éliminé "Du boulodrome de Marseille"

    Scénario: Un DGEC validateur accorde le recours d'un projet éliminé
        Etant donné un recours en cours pour le projet éliminé "Du boulodrome de Marseille"
        Quand le DGEC validateur accorde le recours pour le projet éliminé "Du boulodrome de Marseille" avec :
            | Le format de la réponse signée  | application/pdf                                                                 |
            | Le contenu de la réponse signée | Le contenu de la la réponse signée expliquant la raison de l'accord par la DGEC |
        Alors le recours du projet éliminé "Du boulodrome de Marseille" devrait être accordé

    Scénario: Le porteur reçoit une demande de preuve de recandidature quand le recours avec recandidature d'un projet éliminé a été accordé
        Etant donné un recours en cours avec recandidature pour le projet éliminé "Du boulodrome de Marseille"
        Quand le DGEC validateur accorde le recours pour le projet éliminé "Du boulodrome de Marseille" avec :
            | Le format de la réponse signée  | application/pdf                                                                 |
            | Le contenu de la réponse signée | Le contenu de la la réponse signée expliquant la raison de l'accord par la DGEC |
        Alors la preuve de recandidature a été demandée au porteur du projet "Du boulodrome de Marseille"

    Scénario: Impossible d'accorder le recours d'un projet éliminé si le recours a déjà été accordé
        Etant donné un recours accordé pour le projet éliminé "Du boulodrome de Marseille"
        Quand le DGEC validateur accorde le recours pour le projet éliminé "Du boulodrome de Marseille"
        Alors le DGEC validateur devrait être informé que "Le recours a déjà été accordé"

    Scénario: Impossible d'accorder le recours d'un projet éliminé si le recours a déjà été rejeté
        Etant donné un recours rejeté pour le projet éliminé "Du boulodrome de Marseille"
        Quand le DGEC validateur accorde le recours pour le projet éliminé "Du boulodrome de Marseille"
        Alors le DGEC validateur devrait être informé que "Le recours a déjà été rejeté"

    Scénario: Impossible d'accorder le recours d'un projet éliminé si aucun recours n'a été demandé
        Quand le DGEC validateur accorde le recours pour le projet éliminé "Du boulodrome de Marseille"
        Alors le DGEC validateur devrait être informé que "Aucun recours n'est en cours"

    @NotImplemented
    Plan du Scénario: Impossible d'accorder le recours d'un projet éliminé en tant qu'utilisateur n'ayant pas le rôle de validateur ou admin
        Quand le "<Role non autorisé>" accorde le recours pour le projet éliminé "Du boulodrome de Marseille"
        Alors le "<Role non autorisé>" devrait être informé que "L'accés à cette fonctionnalité n'est pas autorisé"
    Exemples:
            | Role non autorisé |
            | porteur-projet    |
            | dreal             |
