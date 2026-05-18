# language: fr
@lauréat
@PPA
Fonctionnalité: L'Administration DGEC ou DREAL signale un power purchase agreement pour un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du vignoble de Villeurbanne"
        Et la dreal "Dreal du quasi sud" associée à la région du projet
        Et un cahier des charges permettant la modification du projet

    Plan du scénario: La DGEC/DREAL signale un état PPA pour un projet lauréat actif
        Quand un utilisateur "<Rôle>" signale un état PPA pour le projet lauréat
        Alors l'état PPA devrait être consultable pour le projet lauréat
        Et un email a été envoyé au porteur avec :
            | sujet | Potentiel - Du vignoble de Villeurbanne - Signalement PPA |
            | url   | https://potentiel.beta.gouv.fr/laureats/.*                |
        Et un email a été envoyé à la dreal avec :
            | sujet | Potentiel - Du vignoble de Villeurbanne - Signalement PPA |
            | url   | https://potentiel.beta.gouv.fr/laureats/.*                |

        Exemples:
            | Rôle  |
            | dgec  |
            | dreal |

    Plan du scénario: La DGEC/DREAL signale un état PPA pour un projet lauréat achevé
        Etant donné une date d'achèvement réel transmise pour le projet lauréat
        Quand un utilisateur "<Rôle>" signale un état PPA pour le projet lauréat
        Alors l'état PPA devrait être consultable pour le projet lauréat
        Et un email a été envoyé au porteur avec :
            | sujet | Potentiel - Du vignoble de Villeurbanne - Signalement PPA |
            | url   | https://potentiel.beta.gouv.fr/laureats/.*                |
        Et un email a été envoyé à la dreal avec :
            | sujet | Potentiel - Du vignoble de Villeurbanne - Signalement PPA |
            | url   | https://potentiel.beta.gouv.fr/laureats/.*                |

        Exemples:
            | Rôle  |
            | dgec  |
            | dreal |

    Plan du scénario: La DGEC/DREAL signale un état PPA pour un projet lauréat abandonné
        Etant donné une demande d'abandon accordée pour le projet lauréat
        Quand un utilisateur "<Rôle>" signale un état PPA pour le projet lauréat
        Alors l'état PPA devrait être consultable pour le projet lauréat
        Et un email a été envoyé au porteur avec :
            | sujet | Potentiel - Du vignoble de Villeurbanne - Signalement PPA |
            | url   | https://potentiel.beta.gouv.fr/laureats/.*                |
        Et un email a été envoyé à la dreal avec :
            | sujet | Potentiel - Du vignoble de Villeurbanne - Signalement PPA |
            | url   | https://potentiel.beta.gouv.fr/laureats/.*                |

        Exemples:
            | Rôle  |
            | dgec  |
            | dreal |

    Scénario: Impossible de signaler un état PPA pour un projet lauréat actif déjà signalé comme PPA
        Etant donné le signalement par l'administration d'un PPA pour le projet lauréat
        Quand un utilisateur "dgec" signale un état PPA pour le projet lauréat
        Alors l'utilisateur devrait être informé que "Le projet est déjà signalé comme étant parti en PPA"

    Scénario: Impossible de signaler un état PPA pour un projet non lauréat
        Etant donné le projet éliminé "Du boulodrome de Bordeaux"
        Quand un utilisateur "dgec" signale un état PPA pour le projet éliminé
        Alors l'utilisateur devrait être informé que "Le projet lauréat n'existe pas"
