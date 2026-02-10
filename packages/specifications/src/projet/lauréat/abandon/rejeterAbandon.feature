# language: fr
@abandon
Fonctionnalité: Rejeter la demande d'abandon d'un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et un cahier des charges permettant la modification du projet

    Scénario: La DGEC rejette la demande d'abandon d'un projet lauréat
        Etant donné une demande d'abandon en cours pour le projet lauréat
        Quand l'administrateur rejette la demande d'abandon du projet lauréat
        Alors la demande d'abandon du projet lauréat devrait être rejetée
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - Du boulodrome de Marseille - Demande d'abandon rejetée |
            | nom_projet | Du boulodrome de Marseille                                         |
            | url        | https://potentiel.beta.gouv.fr/laureats/.*/abandon                 |

    Scénario: La DGEC rejette la demande d'abandon en instruction d'un projet lauréat
        Etant donné une demande d'abandon en instruction pour le projet lauréat
        Quand l'administrateur rejette la demande d'abandon du projet lauréat
        Alors la demande d'abandon du projet lauréat devrait être rejetée

    Scénario: Une dreal peut rejeter la demande d'abandon d'un projet si elle en a l'autorité
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offres | PPE2 - Petit PV Bâtiment |
            | période        | 1                        |
        Et la dreal "Dreal du sud" associée à la région du projet
        Et une demande d'abandon en cours pour le projet lauréat
        Quand la DREAL rejette la demande d'abandon du projet lauréat
        Alors la demande d'abandon du projet lauréat devrait être rejetée
        Et une tâche "rappel échéance achèvement à trois mois" est planifiée pour le projet lauréat
        Et une tâche "rappel échéance achèvement à deux mois" est planifiée pour le projet lauréat
        Et une tâche "rappel échéance achèvement à un mois" est planifiée pour le projet lauréat

    Scénario: La DGEC peut rejeter la demande d'abandon d'un projet même si l'autorité compétente est la DREAL
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offres | PPE2 - Petit PV Bâtiment |
            | période        | 1                        |
        Et la dreal "Dreal du sud" associée à la région du projet
        Et une demande d'abandon en cours pour le projet lauréat
        Quand l'administrateur rejette la demande d'abandon du projet lauréat
        Alors la demande d'abandon du projet lauréat devrait être rejetée

    Scénario: Impossible de rejetter une demande d'abandon déjà accordée
        Etant donné une demande d'abandon accordée pour le projet lauréat
        Quand l'administrateur rejette la demande d'abandon du projet lauréat
        Alors l'administrateur devrait être informé que "La demande d'abandon a déjà été accordée"

    Scénario: Impossible de rejetter l'abandon d'un projet lauréat sans demande d'abandon
        Quand l'administrateur rejette la demande d'abandon du projet lauréat
        Alors l'administrateur devrait être informé que "Aucune demande d'abandon n'est en cours"

    Scénario: Impossible pour une Dreal de rejeter l'abandon si l'autorité compétente est la DGEC
        Etant donné le projet lauréat "Du boulodrome de Lyon" avec :
            | appel d'offres | PPE2 - Eolien |
            | période        | 8             |
        Et la dreal "Dreal du sud" associée à la région du projet
        Et une demande d'abandon en cours pour le projet lauréat
        Quand la DREAL rejette la demande d'abandon du projet lauréat
        Alors l'utilisateur devrait être informé que "Vous n'avez pas le rôle requis pour instruire cette demande"

    Scénario: Impossible de rejetter la demande d'abandon pour un abandon déjà annulé
        Etant donné une demande d'abandon annulée pour le projet lauréat
        Quand l'administrateur rejette la demande d'abandon du projet lauréat
        Alors l'administrateur devrait être informé que "La demande d'abandon a déjà été annulée"
