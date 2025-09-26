# language: fr
@délai
Fonctionnalité: Corriger la demande de délai d'un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offres | PPE2 - Eolien |
        Et la dreal "Dreal du sud-est" associée à la région du projet
        Et un cahier des charges permettant la modification du projet

    Scénario: Un porteur corrige sa demande de délai
        Etant donné une demande de délai en cours pour le projet lauréat
        Quand le porteur corrige la demande de délai pour le projet lauréat
        Alors la demande corrigée de délai devrait être consultable
        Et un email a été envoyé à l'autorité instructrice avec :
            | sujet      | Potentiel - Correction de la demande de délai pour le projet Du boulodrome de Marseille situé dans le département(.*) |
            | nom_projet | Du boulodrome de Marseille                                                                                            |
            | url        | https://potentiel.beta.gouv.fr/laureats/.*/delai                                                                      |

    Scénario: Impossible de corriger une demande de délai d'un projet lauréat si aucunde demande n'a été demandée
        Quand le porteur corrige la demande de délai pour le projet lauréat
        Alors le porteur devrait être informé que "Aucune demande de délai n'est en cours"

    Scénario: Impossible de corriger le délai d'un projet lauréat si la demande a déjà été accordée
        Etant donné une demande de délai accordée pour le projet lauréat
        Quand le porteur corrige la demande de délai pour le projet lauréat
        Alors le porteur devrait être informé que "Aucune demande de délai n'est en cours"

    Scénario: Impossible de corriger le délai d'un projet lauréat si la demande a déjà été rejétée
        Etant donné une demande de délai rejetée pour le projet lauréat
        Quand le porteur corrige la demande de délai pour le projet lauréat
        Alors le porteur devrait être informé que "Aucune demande de délai n'est en cours"
