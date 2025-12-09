# language: fr
@abandon
Fonctionnalité: Demander une confirmation d'abandon d'un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et un cahier des charges permettant la modification du projet

    Scénario: La DGEC demande de confirmer la demande d'abandon d'un projet lauréat
        Etant donné une demande d'abandon en cours pour le projet lauréat
        Quand l'administrateur demande une confirmation de la demande d'abandon pour le projet lauréat
        Alors la demande d'abandon du projet lauréat devrait être en attente de confirmation
        Et une tâche indiquant de "confirmer un abandon" est consultable dans la liste des tâches du porteur pour le projet
        Et un email a été envoyé au porteur avec :
            | sujet          | Potentiel - Demande d'abandon en attente de confirmation pour le projet Du boulodrome de Marseille |
            | nom_projet     | Du boulodrome de Marseille                                                                         |
            | nouveau_statut | en attente de confirmation                                                                         |
            | abandon_url    | https://potentiel.beta.gouv.fr/laureats/.*/abandon                                                 |

    Scénario: La DGEC demande de confirmer la demande d'abandon d'un projet lauréat en instruction
        Etant donné une demande d'abandon en instruction pour le projet lauréat
        Quand l'administrateur demande une confirmation de la demande d'abandon pour le projet lauréat
        Alors la demande d'abandon du projet lauréat devrait être en attente de confirmation
        Et une tâche indiquant de "confirmer un abandon" est consultable dans la liste des tâches du porteur pour le projet

    Scénario: Une dreal peut demander de confirmer une demande d'abandon si elle en a l'autorité
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offres | PPE2 - Petit PV Bâtiment |
            | période        | 1                        |
        Et la dreal "Dreal du sud" associée à la région du projet
        Et une demande d'abandon en cours pour le projet lauréat
        Quand la DREAL demande une confirmation de la demande d'abandon pour le projet lauréat
        Alors la demande d'abandon du projet lauréat devrait être en attente de confirmation

    Scénario: La DGEC peut demander de confirmer une demande d'abandon même si l'autorité compétente est la DREAL
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offres | PPE2 - Petit PV Bâtiment |
            | période        | 1                        |
        Et la dreal "Dreal du sud" associée à la région du projet
        Et une demande d'abandon en cours pour le projet lauréat
        Quand l'administrateur demande une confirmation de la demande d'abandon pour le projet lauréat
        Alors la demande d'abandon du projet lauréat devrait être en attente de confirmation

    Scénario: Impossible de demander de confirmer la demande d'abandon d'un projet lauréat si une demande d'abandon a déjà été accordée
        Etant donné une demande d'abandon accordée pour le projet lauréat
        Quand l'administrateur demande une confirmation de la demande d'abandon pour le projet lauréat
        Alors l'administrateur devrait être informé que "La demande d'abandon a déjà été accordée"

    Scénario: Impossible de demander de confirmer la demande d'abandon d'un projet lauréat si la demande a déjà été rejetée
        Etant donné une demande d'abandon rejetée pour le projet lauréat
        Quand l'administrateur demande une confirmation de la demande d'abandon pour le projet lauréat
        Alors l'administrateur devrait être informé que "La demande d'abandon a déjà été rejetée"

    Scénario: Impossible de demander de nouveau de confirmer la demande d'abandon d'un projet lauréat
        Etant donné une confirmation d'abandon demandée pour le projet lauréat
        Quand l'administrateur demande une confirmation de la demande d'abandon pour le projet lauréat
        Alors l'administrateur devrait être informé que "La demande d'abandon est déjà en attente de confirmation"

    Scénario: Impossible de demander de confirmer une demande d'abandon déjà confirmée
        Etant donné une demande d'abandon confirmée pour le projet lauréat
        Quand l'administrateur demande une confirmation de la demande d'abandon pour le projet lauréat
        Alors l'administrateur devrait être informé que "La demande d'abandon a déjà été confirmée"

    Scénario: Impossible de demander de confirmer la demande d'abandon d'un projet lauréat si aucun abandon n'a été demandé
        Quand l'administrateur demande une confirmation de la demande d'abandon pour le projet lauréat
        Alors l'administrateur devrait être informé que "Aucune demande d'abandon n'est en cours"

    Scénario: Impossible pour une Dreal de demander de confirmer une demande d'abandon si l'autorité compétente est la DGEC
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offres | PPE2 - Eolien |
            | période        | 8             |
        Et la dreal "Dreal du sud" associée à la région du projet
        Et une demande d'abandon en cours pour le projet lauréat
        Quand la DREAL demande une confirmation de la demande d'abandon pour le projet lauréat
        Alors l'utilisateur devrait être informé que "Vous n'avez pas le rôle requis pour instruire cette demande"
