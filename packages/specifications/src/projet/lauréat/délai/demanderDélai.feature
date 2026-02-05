# language: fr
@délai
Fonctionnalité: Demander un délai pour un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offres | PPE2 - Eolien |
        Et un cahier des charges permettant la modification du projet
        Et la dreal "Dreal du sud" associée à la région du projet

    Scénario: Un porteur demande un délai pour un projet lauréat
        Quand le porteur demande un délai pour le projet lauréat
        Alors la demande de délai devrait être consultable
        Et un email a été envoyé à l'autorité instructrice avec :
            | sujet      | Potentiel - Du boulodrome de Marseille - Délai demandé |
            | nom_projet | Du boulodrome de Marseille                             |
            | url        | https://potentiel.beta.gouv.fr/laureats/.*/delai       |

    Scénario: Impossible de demander un délai pour un projet si une demande de délai est en cours
        Etant donné une demande de délai en cours pour le projet lauréat
        Quand le porteur demande un délai pour le projet lauréat
        Alors le porteur devrait être informé que "Une demande de délai est déjà en cours"

    Scénario: Impossible de demander un délai pour un projet si un délai est en instruction
        Etant donné une demande de délai en instruction pour le projet lauréat
        Quand le porteur demande un délai pour le projet lauréat
        Alors le porteur devrait être informé que "Une demande de délai est déjà en cours"

    Scénario: Impossible de demander un délai pour un projet achevé
        Etant donné une attestation de conformité transmise pour le projet lauréat
        Quand le porteur demande un délai pour le projet lauréat
        Alors le porteur devrait être informé que "Impossible de faire un changement pour un projet achevé"

    Scénario: Impossible de demander un délai pour un projet si le cahier des charges ne le permet pas
        Etant donné le projet lauréat "Du bouchon lyonnais" avec :
            | appel d'offres | CRE4 - Sol |
            | période        | 10         |
        Quand le porteur demande un délai pour le projet lauréat
        Alors le porteur devrait être informé que "Le cahier des charges de ce projet ne permet pas ce changement"
