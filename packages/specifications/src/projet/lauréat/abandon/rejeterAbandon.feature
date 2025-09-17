# language: fr
@abandon
Fonctionnalité: Rejeter l'abandon d'un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et un cahier des charges permettant la modification du projet

    Scénario: La DGEC rejette l'abandon d'un projet lauréat
        Etant donné une demande d'abandon en cours pour le projet lauréat
        Quand l'administrateur rejette l'abandon pour le projet lauréat
        Alors l'abandon du projet lauréat devrait être rejeté

    Scénario: La DGEC rejette l'abandon en instruction d'un projet lauréat
        Etant donné une demande d'abandon en instruction pour le projet lauréat
        Quand l'administrateur rejette l'abandon pour le projet lauréat
        Alors l'abandon du projet lauréat devrait être rejeté

    Scénario: Une dreal peut rejeter l'abandon si elle en a l'autorité
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offres | PPE2 - Petit PV Bâtiment |
            | période        | 1                        |
        Et la dreal "Dreal du sud" associée à la région du projet
        Et une demande d'abandon en cours pour le projet lauréat
        Quand la DREAL rejette l'abandon pour le projet lauréat
        Alors l'abandon du projet lauréat devrait être rejeté

    Scénario: La DGEC peut rejeter l'abandon si l'autorité compétente est la DREAL
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offres | PPE2 - Petit PV Bâtiment |
            | période        | 1                        |
        Et la dreal "Dreal du sud" associée à la région du projet
        Et une demande d'abandon en cours pour le projet lauréat
        Quand l'administrateur rejette l'abandon pour le projet lauréat
        Alors l'abandon du projet lauréat devrait être rejeté

    Scénario: Impossible de rejetter l'abandon d'un projet lauréat si l'abandon a déjà été accordé
        Etant donné un abandon accordé pour le projet lauréat
        Quand l'administrateur rejette l'abandon pour le projet lauréat
        Alors l'administrateur devrait être informé que "L'abandon a déjà été accordé"

    Scénario: Impossible de rejetter l'abandon d'un projet lauréat si aucun abandon n'a été demandé
        Quand l'administrateur rejette l'abandon pour le projet lauréat
        Alors l'administrateur devrait être informé que "Aucun abandon n'est en cours"

    Scénario: Impossible pour une dreal de rejeter l'abandon si l'autorité compétente est la DGEC
        Etant donné le projet lauréat "Du boulodrome de Lyon" avec :
            | appel d'offres | PPE2 - Eolien |
            | période        | 8             |
        Et la dreal "Dreal du sud" associée à la région du projet
        Et une demande d'abandon en cours pour le projet lauréat
        Quand la DREAL rejette l'abandon pour le projet lauréat
        Alors l'utilisateur devrait être informé que "Vous n'avez pas le rôle requis pour instruire cette demande"
