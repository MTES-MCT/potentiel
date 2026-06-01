# language: fr
@lauréat
@PPA
@annuler-signalement-PPA
Fonctionnalité: L'Administration DGEC ou DREAL annule le signalement d'un power purchase agreement pour un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Corse"
        Et la dreal "Dreal de Corse" associée à la région du projet
        Et un cahier des charges permettant la modification du projet

    Plan du scénario: La DGEC/DREAL annule le signament du PPA pour un projet lauréat actif
        Etant donné le signalement par l'administration d'un PPA pour le projet lauréat
        Quand un utilisateur "<Rôle>" annule un état PPA pour le projet lauréat
        Alors l'état PPA ne devrait pas être consultable pour le projet lauréat
        Et un email a été envoyé au porteur avec :
            | sujet | Potentiel - Du boulodrome de Corse - Annulation signalement PPA |
            | url   | https://potentiel.beta.gouv.fr/laureats/.*                      |
        Et un email a été envoyé à la dreal avec :
            | sujet | Potentiel - Du boulodrome de Corse - Annulation signalement PPA |
            | url   | https://potentiel.beta.gouv.fr/laureats/.*                      |

        Exemples:
            | Rôle  |
            | dgec  |
            | dreal |

    Scénario: Le raccordement d'un projet abandonné n'est plus consultable en cas d'annulation d'un état PPA
        Etant donné une demande complète de raccordement pour le projet lauréat
        Et une demande d'abandon accordée avec déclaration de PPA
        Quand un utilisateur "dgec" annule un état PPA pour le projet lauréat
        Alors aucun raccordement ni dossier de raccordement ne devrait être consultable pour le projet

    Scénario: L'annulation d'un état PPA pour un projet abandonné doit supprimer les tâches et tâches planifiées liées au raccordement
        Etant donné le projet lauréat "Du boulodrome de Pantin" avec :
            | appel d'offres | PPE2 - Petit PV Bâtiment |
            | période        | 1                        |
        Et une demande d'abandon accordée avec déclaration de PPA
        Quand un utilisateur "dgec" annule un état PPA pour le projet lauréat
        Alors aucune tâche ou tâche planifiée raccordement n'est consultable pour le projet

    Scénario: L'annulation d'un état PPA pour un projet en cours d'abandon doit supprimer les tâches et tâches planifiées liées au raccordement
        Etant donné le projet lauréat "Du boulodrome de Pantin" avec :
            | appel d'offres | PPE2 - Petit PV Bâtiment |
            | période        | 1                        |
        Et une demande d'abandon en cours avec signalement de PPA pour le projet lauréat
        Quand un utilisateur "dgec" annule un état PPA pour le projet lauréat
        Alors aucune tâche ou tâche planifiée raccordement n'est consultable pour le projet

    Scénario: Annuler un état PPA pour un projet lauréat en cours d'abandon, ayant fait l'objet d'un signalement PPA pendant la demande d'abandon
        Etant donné une demande d'abandon en cours avec signalement de PPA pour le projet lauréat
        Quand un utilisateur "dgec" annule un état PPA pour le projet lauréat
        Alors l'état PPA ne devrait pas être consultable pour le projet lauréat

    Scénario: Impossible d'annuler un état PPA pour un projet lauréat actif non signalé comme PPA
        Quand un utilisateur "dgec" annule un état PPA pour le projet lauréat
        Alors l'utilisateur devrait être informé que "Le projet n'a pas été signalé comme étant parti en PPA"

    Scénario: Impossible d'annuler un état PPA pour un projet non lauréat
        Etant donné le projet éliminé "Du boulodrome de Bordeaux"
        Quand un utilisateur "dgec" annule un état PPA pour le projet éliminé
        Alors l'utilisateur devrait être informé que "Le projet lauréat n'existe pas"
