# language: fr
@abandon
Fonctionnalité: Accorder la demande d'abandon d'un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et un cahier des charges permettant la modification du projet

    Scénario: La DGEC accorde la demande d'abandon d'un projet lauréat
        Etant donné une demande d'abandon en cours pour le projet lauréat
        Quand l'administrateur accorde la demande d'abandon pour le projet lauréat
        Alors la demande d'abandon du projet lauréat devrait être accordée
        Et le statut du projet lauréat devrait être "abandonné"
        Et un email a été envoyé au porteur avec :
            | sujet          | Potentiel - Demande d'abandon accordée pour le projet Du boulodrome de Marseille |
            | nom_projet     | Du boulodrome de Marseille                                                       |
            | nouveau_statut | accordée                                                                         |
            | abandon_url    | https://potentiel.beta.gouv.fr/laureats/.*/abandon                               |

    Scénario: Une dreal peut accorder une demande d'abandon si elle en a l'autorité
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offres | PPE2 - Petit PV Bâtiment |
            | période        | 1                        |
        Et la dreal "Dreal du sud" associée à la région du projet
        Et une demande d'abandon en cours pour le projet lauréat
        Quand la DREAL accorde la demande d'abandon pour le projet lauréat
        Alors la demande d'abandon du projet lauréat devrait être accordée
        Et le statut du projet lauréat devrait être "abandonné"

    Scénario: La DGEC peut accorder l'abandon si l'autorité compétente est la DREAL
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offres | PPE2 - Petit PV Bâtiment |
            | période        | 1                        |
        Et la dreal "Dreal du sud" associée à la région du projet
        Et une demande d'abandon en cours pour le projet lauréat
        Quand l'administrateur accorde la demande d'abandon pour le projet lauréat
        Alors la demande d'abandon du projet lauréat devrait être accordée
        Et le statut du projet lauréat devrait être "abandonné"

    Scénario: Les tâches et tâches planifiées liées aux garanties financières sont annulées lorsque l'abandon d'un projet lauréat est accordé
        Etant donné des garanties financières en attente pour le projet lauréat
        Et une demande d'abandon en cours pour le projet lauréat
        Quand l'administrateur accorde la demande d'abandon pour le projet lauréat
        Alors une tâche indiquant de "transmettre les garanties financières" n'est plus consultable dans la liste des tâches du porteur pour le projet
        Et il n'y a pas de tâche "rappel des garanties financières à transmettre" planifiée pour le projet lauréat

    # TODO : Vérifier avec le métier pour supprimer carrément la partie recandidature
    # Scénario: Le porteur reçoit une demande de preuve de recandidature quand l'abandon avec recandidature d'un projet lauréat a été accordé
    #     Etant donné une demande d'abandon en cours avec recandidature pour le projet lauréat
    #     Quand le DGEC validateur accorde la demande d'abandon pour le projet lauréat
    #     Alors la preuve de recandidature a été demandée au porteur du projet lauréat
    #     Et une tâche indiquant de "transmettre la preuve de recandidature" est consultable dans la liste des tâches du porteur pour le projet
    Scénario: Impossible d'accorder l'abandon d'un projet lauréat si l'abandon a déjà été accordé
        Etant donné une demande d'abandon accordée pour le projet lauréat
        Quand l'administrateur accorde la demande d'abandon pour le projet lauréat
        Alors l'administrateur devrait être informé que "La demande d'abandon a déjà été accordée"

    Scénario: Impossible d'accorder l'abandon d'un projet lauréat si l'abandon a déjà été rejeté
        Etant donné une demande d'abandon rejetée pour le projet lauréat
        Quand l'administrateur accorde la demande d'abandon pour le projet lauréat
        Alors l'administrateur devrait être informé que "La demande d'abandon a déjà été rejetée"

    Scénario: Impossible d'accorder l'abandon d'un projet lauréat si l'abandon a déjà été annulé
        Etant donné une demande d'abandon annulée pour le projet lauréat
        Quand l'administrateur accorde la demande d'abandon pour le projet lauréat
        Alors l'administrateur devrait être informé que "La demande d'abandon a déjà été annulée"

    Scénario: Impossible d'accorder l'abandon d'un projet lauréat si aucun abandon n'a été demandé
        Quand l'administrateur accorde la demande d'abandon pour le projet lauréat
        Alors l'administrateur devrait être informé que "Aucune demande d'abandon n'est en cours"

    Scénario: Impossible pour une DREAL d'accorder l'abandon si l'autorité compétente est la DGEC
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offres | PPE2 - Eolien |
            | période        | 8             |
        Et la dreal "Dreal du sud" associée à la région du projet
        Et une demande d'abandon en cours pour le projet lauréat
        Quand la DREAL accorde la demande d'abandon pour le projet lauréat
        Alors l'utilisateur devrait être informé que "Vous n'avez pas le rôle requis pour instruire cette demande"
