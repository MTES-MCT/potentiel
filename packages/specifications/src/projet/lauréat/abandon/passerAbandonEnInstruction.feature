# language: fr
@abandon
Fonctionnalité: Passer un abandon d'un projet lauréat en instruction

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et un cahier des charges permettant la modification du projet

    Scénario: Un administrateur passe l'abandon d'un projet lauréat en instruction
        Etant donné une demande d'abandon en cours pour le projet lauréat
        Quand l'administrateur passe en instruction l'abandon pour le projet lauréat
        Alors la demande d'abandon du projet lauréat devrait être en instruction

    Scénario: Un administrateur reprend l'instruction de l'abandon du projet lauréat
        Etant donné une demande d'abandon en instruction pour le projet lauréat
        Quand un nouvel administrateur passe en instruction l'abandon pour le projet lauréat
        Alors la demande d'abandon du projet lauréat devrait être en instruction

    Scénario: Une dreal peut passer un abandon en instruction si elle en a l'autorité
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offres | PPE2 - Petit PV Bâtiment |
            | période        | 1                        |
        Et la dreal "Dreal du sud" associée à la région du projet
        Et une demande d'abandon en cours pour le projet lauréat
        Quand la DREAL passe en instruction l'abandon pour le projet lauréat
        Alors la demande d'abandon du projet lauréat devrait être en instruction

    Scénario: La DGEC peut passer un abandon en instruction si l'autorité compétente est la DREAL
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offres | PPE2 - Petit PV Bâtiment |
            | période        | 1                        |
        Et la dreal "Dreal du sud" associée à la région du projet
        Et une demande d'abandon en cours pour le projet lauréat
        Quand l'administrateur passe en instruction l'abandon pour le projet lauréat
        Alors la demande d'abandon du projet lauréat devrait être en instruction

    Scénario: Impossible de passer l'abandon d'un projet lauréat en instruction si l'abandon a déjà été accordé
        Etant donné un abandon accordé pour le projet lauréat
        Quand l'administrateur passe en instruction l'abandon pour le projet lauréat
        Alors l'utilisateur devrait être informé que "L'abandon a déjà été accordé"

    Scénario: Impossible de passer l'abandon d'un projet lauréat en instruction si l'abandon a déjà été rejeté
        Etant donné un abandon rejeté pour le projet lauréat
        Quand l'administrateur passe en instruction l'abandon pour le projet lauréat
        Alors l'utilisateur devrait être informé que "L'abandon a déjà été rejeté"

    Scénario: Impossible de passer l'abandon d'un projet lauréat en instruction si l'abandon est en attente de confirmation
        Etant donné une confirmation d'abandon demandée pour le projet lauréat
        Quand l'administrateur passe en instruction l'abandon pour le projet lauréat
        Alors l'utilisateur devrait être informé que "Une demande de confirmation d'abandon est en cours et ne peut être passé en instruction"

    Scénario: Impossible de passer l'abandon d'un projet lauréat en instruction si l'abandon est confirmé
        Etant donné un abandon confirmé pour le projet lauréat
        Quand l'administrateur passe en instruction l'abandon pour le projet lauréat
        Alors l'utilisateur devrait être informé que "L'abandon est confirmé et ne peut être passé en instruction"

    Scénario: Impossible de passer l'abandon d'un projet lauréat en instruction si aucun abandon n'a été demandé
        Quand l'administrateur passe en instruction l'abandon pour le projet lauréat
        Alors l'utilisateur devrait être informé que "Aucun abandon n'est en cours"

    Scénario: Impossible de reprendre l'abandon d'un projet lauréat en instruction si on instruit déjà l'abandon
        Etant donné une demande d'abandon en instruction pour le projet lauréat
        Quand le même administrateur passe en instruction l'abandon pour le projet lauréat
        Alors l'utilisateur devrait être informé que "L'abandon est déjà en instruction avec le même administrateur"

    Scénario: Impossible pour une dreal de passer un abandon en instruction si l'autorité compétente est la DGEC
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offres | PPE2 - Eolien |
            | période        | 8             |
        Et la dreal "Dreal du sud" associée à la région du projet
        Et une demande d'abandon en cours pour le projet lauréat
        Quand la DREAL passe en instruction l'abandon pour le projet lauréat
        Alors l'utilisateur devrait être informé que "Vous n'avez pas le rôle requis pour instruire cette demande"
