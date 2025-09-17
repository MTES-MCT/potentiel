# language: fr
@abandon
Fonctionnalité: Accorder l'abandon d'un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et un cahier des charges permettant la modification du projet

    Scénario: La DGEC accorde l'abandon d'un projet lauréat
        Etant donné une demande d'abandon en cours pour le projet lauréat
        Quand l'administrateur accorde l'abandon pour le projet lauréat
        Alors l'abandon du projet lauréat devrait être accordé

    Scénario: Une dreal peut accorder l'abandon si elle en a l'autorité
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offres | PPE2 - Petit PV Bâtiment |
            | période        | 1                        |
        Et la dreal "Dreal du sud" associée à la région du projet
        Et une demande d'abandon en cours pour le projet lauréat
        Quand la DREAL accorde l'abandon pour le projet lauréat
        Alors l'abandon du projet lauréat devrait être accordé

    Scénario: La DGEC peut accorder l'abandon si l'autorité compétente est la DREAL
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offres | PPE2 - Petit PV Bâtiment |
            | période        | 1                        |
        Et la dreal "Dreal du sud" associée à la région du projet
        Et une demande d'abandon en cours pour le projet lauréat
        Quand l'administrateur accorde l'abandon pour le projet lauréat
        Alors l'abandon du projet lauréat devrait être accordé

    # TODO : Vérifier avec le métier pour supprimer carrément la partie recandidature
    # Scénario: Le porteur reçoit une demande de preuve de recandidature quand l'abandon avec recandidature d'un projet lauréat a été accordé
    #     Etant donné une demande d'abandon en cours avec recandidature pour le projet lauréat
    #     Quand le DGEC validateur accorde l'abandon pour le projet lauréat
    #     Alors la preuve de recandidature a été demandée au porteur du projet lauréat
    #     Et une tâche indiquant de "transmettre la preuve de recandidature" est consultable dans la liste des tâches du porteur pour le projet
    Scénario: Impossible d'accorder l'abandon d'un projet lauréat si l'abandon a déjà été accordé
        Etant donné un abandon accordé pour le projet lauréat
        Quand l'administrateur accorde l'abandon pour le projet lauréat
        Alors l'administrateur devrait être informé que "L'abandon a déjà été accordé"

    Scénario: Impossible d'accorder l'abandon d'un projet lauréat si l'abandon a déjà été rejeté
        Etant donné un abandon rejeté pour le projet lauréat
        Quand l'administrateur accorde l'abandon pour le projet lauréat
        Alors l'administrateur devrait être informé que "L'abandon a déjà été rejeté"

    Scénario: Impossible d'accorder l'abandon d'un projet lauréat si aucun abandon n'a été demandé
        Quand l'administrateur accorde l'abandon pour le projet lauréat
        Alors l'administrateur devrait être informé que "Aucun abandon n'est en cours"

    Scénario: Impossible pour une DREAL d'accorder l'abandon si l'autorité compétente est la DGEC
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offres | PPE2 - Eolien |
            | période        | 8             |
        Et la dreal "Dreal du sud" associée à la région du projet
        Et une demande d'abandon en cours pour le projet lauréat
        Quand la DREAL accorde l'abandon pour le projet lauréat
        Alors l'utilisateur devrait être informé que "Vous n'avez pas le rôle requis pour instruire cette demande"
