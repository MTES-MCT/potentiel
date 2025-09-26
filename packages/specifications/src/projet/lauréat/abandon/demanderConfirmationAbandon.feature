# language: fr
@abandon
Fonctionnalité: Demander une confirmation d'abandon d'un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et un cahier des charges permettant la modification du projet

    Scénario: La DGEC demande une confirmation d'abandon d'un projet lauréat
        Etant donné une demande d'abandon en cours pour le projet lauréat
        Quand l'administrateur demande une confirmation d'abandon pour le projet lauréat
        Alors la confirmation d'abandon du projet lauréat devrait être demandée
        Et une tâche indiquant de "confirmer un abandon" est consultable dans la liste des tâches du porteur pour le projet
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - Demande d'abandon en attente de confirmation pour le projet Du boulodrome de Marseille |
            | nom_projet | Du boulodrome de Marseille                                                                         |

    Scénario: La DGEC demande une confirmation d'abandon d'un projet lauréat en instruction
        Etant donné une demande d'abandon en instruction pour le projet lauréat
        Quand l'administrateur demande une confirmation d'abandon pour le projet lauréat
        Alors la confirmation d'abandon du projet lauréat devrait être demandée
        Et une tâche indiquant de "confirmer un abandon" est consultable dans la liste des tâches du porteur pour le projet

    Scénario: Une dreal peut demande une confirmation l'abandon si elle en a l'autorité
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offres | PPE2 - Petit PV Bâtiment |
            | période        | 1                        |
        Et la dreal "Dreal du sud" associée à la région du projet
        Et une demande d'abandon en cours pour le projet lauréat
        Quand la DREAL demande une confirmation d'abandon pour le projet lauréat
        Alors la confirmation d'abandon du projet lauréat devrait être demandée

    Scénario: La DGEC peut demande une confirmation l'abandon si l'autorité compétente est la DREAL
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offres | PPE2 - Petit PV Bâtiment |
            | période        | 1                        |
        Et la dreal "Dreal du sud" associée à la région du projet
        Et une demande d'abandon en cours pour le projet lauréat
        Quand l'administrateur demande une confirmation d'abandon pour le projet lauréat
        Alors la confirmation d'abandon du projet lauréat devrait être demandée

    Scénario: Impossible de demande une confirmation d'abandon d'un projet lauréat si l'abandon a déjà été accordé
        Etant donné un abandon accordé pour le projet lauréat
        Quand l'administrateur demande une confirmation d'abandon pour le projet lauréat
        Alors l'administrateur devrait être informé que "L'abandon a déjà été accordé"

    Scénario: Impossible de demande une confirmation d'abandon d'un projet lauréat si l'abandon a déjà été rejeté
        Etant donné un abandon rejeté pour le projet lauréat
        Quand l'administrateur demande une confirmation d'abandon pour le projet lauréat
        Alors l'administrateur devrait être informé que "L'abandon a déjà été rejeté"

    Scénario: Impossible de demande une confirmation d'abandon d'un projet lauréat si la confirmation d'abandon a déjà été demandé
        Etant donné une confirmation d'abandon demandée pour le projet lauréat
        Quand l'administrateur demande une confirmation d'abandon pour le projet lauréat
        Alors l'administrateur devrait être informé que "La confirmation de l'abandon a déjà été demandée"

    Scénario: Impossible de demande une confirmation d'abandon d'un projet lauréat si l'abandon a déjà été confirmé
        Etant donné un abandon confirmé pour le projet lauréat
        Quand l'administrateur demande une confirmation d'abandon pour le projet lauréat
        Alors l'administrateur devrait être informé que "L'abandon a déjà été confirmé"

    Scénario: Impossible de demande une confirmation d'abandon d'un projet lauréat si aucun abandon n'a été demandé
        Quand l'administrateur demande une confirmation d'abandon pour le projet lauréat
        Alors l'administrateur devrait être informé que "Aucun abandon n'est en cours"

    Scénario: Impossible pour une dreal de demande une confirmation d'abandon si l'autorité compétente est la DGEC
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offres | PPE2 - Eolien |
            | période        | 8             |
        Et la dreal "Dreal du sud" associée à la région du projet
        Et une demande d'abandon en cours pour le projet lauréat
        Quand la DREAL demande une confirmation d'abandon pour le projet lauréat
        Alors l'utilisateur devrait être informé que "Vous n'avez pas le rôle requis pour instruire cette demande"
