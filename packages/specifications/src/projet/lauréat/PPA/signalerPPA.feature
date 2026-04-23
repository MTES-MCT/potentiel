# language: fr
@select
@lauréat
@PPA
Fonctionnalité: L'Administration DGEC ou DREAL signale un état PPA pour un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et la dreal "Dreal du sud" associée à la région du projet

    Plan du scénario: La DGEC/DREAL signale un état PPA pour un projet lauréat actif
        Quand un utilisateur "<Rôle>" signale un état PPA pour le projet lauréat
        Alors l'état PPA devrait être consultable pour le projet lauréat

        Exemples:
            | Rôle  |
            | dgec  |
            | dreal |

    Plan du scénario: La DGEC/DREAL signale un état PPA pour un projet lauréat achevé
        Et une date d'achèvement réel transmise pour le projet lauréat
        Quand un utilisateur "<Rôle>" signale un état PPA pour le projet lauréat
        Alors l'état PPA devrait être consultable pour le projet lauréat

        Exemples:
            | Rôle  |
            | dgec  |
            | dreal |

    Plan du scénario: La DGEC/DREAL signale un état PPA pour un projet lauréat abandonné
        Et une demande d'abandon accordée pour le projet lauréat
        Quand un utilisateur "<Rôle>" signale un état PPA pour le projet lauréat
        Alors l'état PPA devrait être consultable pour le projet lauréat

        Exemples:
            | Rôle  |
            | dgec  |
            | dreal |


#Impossible de signaler un état PPA pour un projet déjà PPA
#Imposible de signaler un état PPA pour un projet éliminé
#Imposible de signaler un état PPA pour un rôle non autorisé