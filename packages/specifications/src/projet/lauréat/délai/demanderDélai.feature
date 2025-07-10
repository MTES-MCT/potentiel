# language: fr
@délai
@demander-délai
Fonctionnalité: Demander un délai pour un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et un cahier des charges modificatif choisi

    Scénario: Un porteur demande un délai pour un projet lauréat
        Quand le porteur demande un délai pour le projet lauréat
        Alors la demande de délai devrait être consultable

    # Scénario: Un porteur demande un délai pour un projet lauréat après un rejet
    #     Etant donné délai rejeté pour le projet lauréat
    #     Quand le porteur demande un délai pour le projet lauréat
    #     Alors un délai du projet lauréat devrait être de nouveau demandé
    #
    Scénario: Impossible de demander un délai pour un projet si un délai est en cours
        Etant donné une demande de délai en cours pour le projet lauréat
        Quand le porteur demande un délai pour le projet lauréat
        Alors le porteur devrait être informé que "Une demande de délai est déjà en cours"

    # Scénario: Impossible de demander un délai pour un projet si un délai est en instruction
    #     Etant donné une demande de délai en instruction pour le projet lauréat
    #     Quand le porteur demande un délai pour le projet lauréat
    #     Alors le porteur devrait être informé que "Une demande de délai est déjà en cours"
    #
    Scénario: Impossible de demander un délai pour un projet achevé
        Etant donné une attestation de conformité transmise pour le projet lauréat
        Quand le porteur demande un délai pour le projet lauréat
        Alors le porteur devrait être informé que "Impossible de faire un changement pour un projet achevé"

    Scénario: Impossible de demander un délai pour un projet dont le cahier des charges ne le permet pas
        Etant donné le projet lauréat "Du bouchon lyonnais" avec :
            | appel d'offre | CRE4 - Sol |
            | période       | 10         |
        Quand le porteur demande un délai pour le projet lauréat
        Alors le porteur devrait être informé que "Impossible de faire un changement pour ce cahier des charges"
