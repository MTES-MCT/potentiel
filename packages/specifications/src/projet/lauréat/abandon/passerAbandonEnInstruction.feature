# language: fr
@abandon
Fonctionnalité: Passer la demande d'abandon d'un projet lauréat en instruction

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et un cahier des charges permettant la modification du projet

    Scénario: Un administrateur passe la demande d'abandon d'un projet lauréat en instruction
        Etant donné une demande d'abandon en cours pour le projet lauréat
        Quand l'administrateur passe la demande d'abandon du projet lauréat en instruction
        Alors la demande d'abandon du projet lauréat devrait être en instruction
        Et un email a été envoyé au porteur avec :
            | sujet          | Potentiel - La demande d'abandon pour le projet Du boulodrome de Marseille est en instruction |
            | nom_projet     | Du boulodrome de Marseille                                                                    |
            | nouveau_statut | en instruction                                                                                |
            | abandon_url    | https://potentiel.beta.gouv.fr/laureats/.*/abandon                                            |

    Scénario: Un administrateur reprend l'instruction de la demande d'abandon du projet lauréat
        Etant donné une demande d'abandon en instruction pour le projet lauréat
        Quand un nouvel administrateur passe la demande d'abandon du projet lauréat en instruction
        Alors la demande d'abandon du projet lauréat devrait être en instruction

    Scénario: Une dreal peut passer une demande d'abandon en instruction si elle en a l'autorité
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offres | PPE2 - Petit PV Bâtiment |
            | période        | 1                        |
        Et la dreal "Dreal du sud" associée à la région du projet
        Et une demande d'abandon en cours pour le projet lauréat
        Quand la DREAL passe la demande d'abandon du projet lauréat en instruction
        Alors la demande d'abandon du projet lauréat devrait être en instruction

    Scénario: La DGEC peut passer une demande d'abandon en instruction même si l'autorité compétente est la DREAL
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offres | PPE2 - Petit PV Bâtiment |
            | période        | 1                        |
        Et la dreal "Dreal du sud" associée à la région du projet
        Et une demande d'abandon en cours pour le projet lauréat
        Quand l'administrateur passe la demande d'abandon du projet lauréat en instruction
        Alors la demande d'abandon du projet lauréat devrait être en instruction

    Scénario: Impossible de passer en instruction une demande d'abandon déjà accordée
        Etant donné une demande d'abandon accordée pour le projet lauréat
        Quand l'administrateur passe la demande d'abandon du projet lauréat en instruction
        Alors l'utilisateur devrait être informé que "La demande d'abandon a déjà été accordée"

    Scénario: Impossible de passer en instruction une demande d'abandon déjà rejetée
        Etant donné une demande d'abandon rejetée pour le projet lauréat
        Quand l'administrateur passe la demande d'abandon du projet lauréat en instruction
        Alors l'utilisateur devrait être informé que "La demande d'abandon a déjà été rejetée"

    Scénario: Impossible de passer en instruction une demande d'abandon déjà en attente de confirmation
        Etant donné une confirmation d'abandon demandée pour le projet lauréat
        Quand l'administrateur passe la demande d'abandon du projet lauréat en instruction
        Alors l'utilisateur devrait être informé que "La demande d'abandon ne peut être passée "en instruction" car une confirmation a déjà été demandée"

    Scénario: Impossible de passer en instruction une demande d'abandon déjà confirmée
        Etant donné une demande d'abandon confirmée pour le projet lauréat
        Quand l'administrateur passe la demande d'abandon du projet lauréat en instruction
        Alors l'utilisateur devrait être informé que "La demande d'abandon est déjà confirmée et ne peut donc pas être passée "en instruction""

    Scénario: Impossible de passer en instruction la demande d'abandon d'un projet lauréat si aucun abandon n'a été demandé
        Quand l'administrateur passe la demande d'abandon du projet lauréat en instruction
        Alors l'utilisateur devrait être informé que "Aucune demande d'abandon n'est en cours"

    Scénario: Impossible de reprendre l'instruction d'une demande d'abandon que l'on instruit déjà
        Etant donné une demande d'abandon en instruction pour le projet lauréat
        Quand le même administrateur passe la demande d'abandon du projet lauréat en instruction
        Alors l'utilisateur devrait être informé que "La demande d'abandon est déjà en instruction avec le même administrateur"

    Scénario: Impossible pour une Dreal de passer une demande d'abandon en instruction si l'autorité compétente est la DGEC
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offres | PPE2 - Eolien |
            | période        | 8             |
        Et la dreal "Dreal du sud" associée à la région du projet
        Et une demande d'abandon en cours pour le projet lauréat
        Quand la DREAL passe la demande d'abandon du projet lauréat en instruction
        Alors l'utilisateur devrait être informé que "Vous n'avez pas le rôle requis pour instruire cette demande"

    @select
    Scénario: Impossible de passer une demande d'abandon en instruction pour un abandon déjà annulé
        Etant donné une demande d'abandon annulée pour le projet lauréat
        Quand l'administrateur passe la demande d'abandon du projet lauréat en instruction
        Alors l'administrateur devrait être informé que "La demande d'abandon a déjà été annulée"
