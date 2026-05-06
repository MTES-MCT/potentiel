# language: fr
@lauréat
@PPA
Fonctionnalité: L'Administration DGEC ou DREAL annule le signalement d'un power purchase agreement pour un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Corse"
        Et la dreal "Dreal de Corse" associée à la région du projet
        Et un cahier des charges permettant la modification du projet

    Plan du scénario: La DGEC/DREAL signale un état PPA pour un projet lauréat actif
        Etant donné le projet lauréat avec un état PPA signalé
        Quand un utilisateur "<Rôle>" annule un état PPA pour le projet lauréat
        Alors l'état PPA ne devrait plus être consultable pour le projet lauréat
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

    Scénario: Impossible d'annuler un état PPA pour un projet lauréat actif non signalé comme PPA
        Quand un utilisateur "dgec" annule un état PPA pour le projet lauréat
        Alors l'utilisateur devrait être informé que "Le projet n'a pas été signalé comme étant parti en PPA"

    Scénario: Impossible d'annuler' un état PPA pour un projet non lauréat
        Etant donné le projet éliminé "Du boulodrome de Bordeaux"
        Quand un utilisateur "dgec" annule un état PPA pour le projet éliminé
        Alors l'utilisateur devrait être informé que "Le projet lauréat n'existe pas"
