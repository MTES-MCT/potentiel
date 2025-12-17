# language: fr
@abandon
Fonctionnalité: Confirmer la demande d'abandon d'un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et un cahier des charges permettant la modification du projet

    Plan du scénario: Un porteur confirme la demande d'abandon d'un projet lauréat
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offres | <Appel d'offre> |
            | période        | <Période>       |
        Et la dreal "Dreal du sud" associée à la région du projet
        Et une confirmation d'abandon demandée pour le projet lauréat
        Quand le porteur confirme sa demande d'abandon pour le projet lauréat
        Alors la demande d'abandon du projet lauréat devrait être confirmée
        Et un email a été envoyé au porteur avec :
            | sujet          | Potentiel - Demande d'abandon confirmée pour le projet Du boulodrome de Marseille .* |
            | nom_projet     | Du boulodrome de Marseille                                                           |
            | nouveau_statut | confirmée                                                                            |
            | abandon_url    | https://potentiel.beta.gouv.fr/laureats/.*/abandon                                   |
        Et un email a été envoyé à l'autorité instructrice avec :
            | sujet          | Potentiel - Demande d'abandon confirmée pour le projet Du boulodrome de Marseille .* |
            | nom_projet     | Du boulodrome de Marseille                                                           |
            | nouveau_statut | confirmée                                                                            |
            | abandon_url    | https://potentiel.beta.gouv.fr/laureats/.*/abandon                                   |

        Exemples:
            | Appel d'offre            | Période |
            | PPE2 - Sol               | 8       |
            | PPE2 - Petit PV Bâtiment | 1       |

    Scénario: Impossible de confirmer la demande d'abandon d'un projet lauréat si la confirmation d'abandon n'a pas été demandée
        Etant donné une demande d'abandon en cours pour le projet lauréat
        Quand le porteur confirme sa demande d'abandon pour le projet lauréat
        Alors le porteur devrait être informé que "Il n'y a aucune confirmation de demande d'abandon en attente"

    Scénario: Impossible de confirmer la demande d'abandon d'un projet lauréat si la demande d'abandon a déjà été accordée
        Etant donné une demande d'abandon accordée pour le projet lauréat
        Quand le porteur confirme sa demande d'abandon pour le projet lauréat
        Alors le porteur devrait être informé que "La demande d'abandon a déjà été accordée"

    Scénario: Impossible de confirmer la demande d'abandon d'un projet lauréat si la demande d'abandon a déjà été rejetée
        Etant donné une demande d'abandon rejetée pour le projet lauréat
        Quand le porteur confirme sa demande d'abandon pour le projet lauréat
        Alors le porteur devrait être informé que "La demande d'abandon a déjà été rejetée"

    Scénario: Impossible de confirmer la demande d'abandon d'un projet lauréat si la demande d'abandon a déjà été confirmée
        Etant donné une demande d'abandon confirmée pour le projet lauréat
        Quand le porteur confirme sa demande d'abandon pour le projet lauréat
        Alors le porteur devrait être informé que "La demande d'abandon a déjà été confirmée"

    Scénario: Impossible de confirmer la demande d'abandon d'un projet lauréat si aucun abandon n'a été demandé
        Quand le porteur confirme sa demande d'abandon pour le projet lauréat
        Alors le porteur devrait être informé que "Aucune demande d'abandon n'est en cours"

    @select
    Scénario: Impossible de confirmer la demande d'abandon d'un projet lauréat si l'abandon a déjà été annulé
        Etant donné une demande d'abandon annulée pour le projet lauréat
        Quand le porteur confirme sa demande d'abandon pour le projet lauréat
        Alors le porteur devrait être informé que "La demande d'abandon a déjà été annulée"
