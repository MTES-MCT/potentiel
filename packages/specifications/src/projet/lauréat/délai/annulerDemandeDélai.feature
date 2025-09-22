# language: fr
@délai
Fonctionnalité: Annuler la demande de délai d'un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offres | PPE2 - Eolien |
        Et la dreal "Dreal du sud" associée à la région du projet
        Et un cahier des charges permettant la modification du projet

    Scénario: Annuler la demande de délai d'un projet lauréat
        Etant donné une demande de délai en cours pour le projet lauréat
        Quand le porteur annule la demande de délai pour le projet lauréat
        Alors la demande de délai ne devrait plus être consultable
        Et un email a été envoyé à l'autorité instructrice avec :
            | sujet      | Potentiel - La demande de délai pour le projet Du boulodrome de Marseille situé dans le département(.*) a été annulée |
            | nom_projet | Du boulodrome de Marseille                                                                                            |
            | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                                 |

    Scénario: Impossible d'annuler la demande de changement de puissance si la demande est inexistante
        Quand le porteur annule la demande de délai pour le projet lauréat
        Alors l'utilisateur devrait être informé que "Aucune demande de délai n'est en cours"

    Scénario: Impossible d'annuler la demande de délai d'un projet lauréat si la demande a déjà été rejetée
        Etant donné une demande de délai rejetée pour le projet lauréat
        Quand le porteur annule la demande de délai pour le projet lauréat
        Alors l'utilisateur devrait être informé que "Aucune demande de délai n'est en cours"

    Scénario: Impossible d'annuler la demande de délai d'un projet lauréat si la demande a déjà été accordée
        Etant donné une demande de délai accordée pour le projet lauréat
        Quand le porteur annule la demande de délai pour le projet lauréat
        Alors l'utilisateur DREAL devrait être informé que "Aucune demande de délai n'est en cours"
