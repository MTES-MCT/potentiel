# language: fr
@abandon
@rejeter-abandon
Fonctionnalité: Rejeter la demande d'abandon d'un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et un cahier des charges permettant la modification du projet

    Scénario: La DGEC rejette la demande d'abandon d'un projet lauréat
        Etant donné une demande d'abandon en cours pour le projet lauréat
        Quand la dgec rejette la demande d'abandon du projet lauréat
        Alors la demande d'abandon du projet lauréat devrait être rejetée
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - Du boulodrome de Marseille - Demande d'abandon rejetée |
            | nom_projet | Du boulodrome de Marseille                                         |
            | url        | https://potentiel.beta.gouv.fr/laureats/.*/abandon                 |

    Scénario: Le rejet de la demande d'abandon d'un projet lauréat réactive les tâches et tâches planifiées liées au raccordement du projet (projet sans DCR)
        Etant donné le projet lauréat "Du boulodrome de Poitiers" avec :
            | appel d'offres | PPE2 - Petit PV Bâtiment |
            | période        | 1                        |
        Et une demande d'abandon en cours pour le projet lauréat
        Quand la dgec rejette la demande d'abandon du projet lauréat
        Et une tâche "relance transmission de la demande complète raccordement" est planifiée pour le projet lauréat
        Et une tâche indiquant de "mettre à jour le gestionnaire de réseau" est consultable dans la liste des tâches du porteur pour le projet
        Et une tâche indiquant de "transmettre une référence de raccordement" est consultable dans la liste des tâches du porteur pour le projet

    Scénario: Le rejet de la demande d'abandon d'un projet lauréat réactive les tâches et tâches planifiées liées au raccordement du projet (projet avec DCR sans AR)
        Etant donné le projet lauréat "Du boulodrome de Poitiers" avec :
            | appel d'offres | PPE2 - Petit PV Bâtiment |
            | période        | 1                        |
        Et une demande complète de raccordement sans accusé de réception pour le projet lauréat 
        Et une demande d'abandon en cours pour le projet lauréat
        Quand la dgec rejette la demande d'abandon du projet lauréat
        Et une tâche indiquant de "renseigner l'accusé de réception de la demande complète de raccordement" est consultable dans la liste des tâches du porteur pour le projet         

    Scénario: La DGEC rejette la demande d'abandon en instruction d'un projet lauréat
        Etant donné une demande d'abandon en instruction pour le projet lauréat
        Quand la dgec rejette la demande d'abandon du projet lauréat
        Alors la demande d'abandon du projet lauréat devrait être rejetée

    Scénario: La DGEC rejette la demande d'abandon avec signalement de PPA pour le projet lauréat
        Etant donné une demande d'abandon en cours avec signalement de PPA pour le projet lauréat
        Quand la dgec rejette la demande d'abandon du projet lauréat
        Alors la demande d'abandon du projet lauréat devrait être rejetée
        Et l'état PPA ne devrait pas être consultable pour le projet lauréat

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
        Quand la dgec rejette la demande d'abandon du projet lauréat
        Alors la demande d'abandon du projet lauréat devrait être rejetée

    Scénario: Impossible de rejeter une demande d'abandon déjà accordée
        Etant donné une demande d'abandon accordée pour le projet lauréat
        Quand la dgec rejette la demande d'abandon du projet lauréat
        Alors la dgec devrait être informé que "La demande d'abandon a déjà été accordée"

    Scénario: Impossible de rejeter l'abandon d'un projet lauréat sans demande d'abandon
        Quand la dgec rejette la demande d'abandon du projet lauréat
        Alors la dgec devrait être informé que "Aucune demande d'abandon n'est en cours"

    Scénario: Impossible pour une Dreal de rejeter l'abandon si l'autorité compétente est la dgec
        Etant donné le projet lauréat "Du boulodrome de Lyon" avec :
            | appel d'offres | PPE2 - Eolien |
            | période        | 8             |
        Et la dreal "Dreal du sud" associée à la région du projet
        Et une demande d'abandon en cours pour le projet lauréat
        Quand la DREAL rejette la demande d'abandon du projet lauréat
        Alors l'utilisateur devrait être informé que "Vous n'avez pas le rôle requis pour instruire cette demande"

    Scénario: Impossible de rejeter la demande d'abandon pour un abandon déjà annulé
        Etant donné une demande d'abandon annulée pour le projet lauréat
        Quand la dgec rejette la demande d'abandon du projet lauréat
        Alors la dgec devrait être informé que "La demande d'abandon a déjà été annulée"
