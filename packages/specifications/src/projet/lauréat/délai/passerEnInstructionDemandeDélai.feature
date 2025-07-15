# language: fr
@délai
@passer-en-instruction-demande-délai
Fonctionnalité: Passer en instruction la demande de délai d'un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et la dreal "Dreal du sud" associée à la région du projet
        Et un cahier des charges modificatif choisi

    Scénario: Une dreal passe en instruction la demande de délai d'un projet lauréat
        Etant donné une demande de délai en cours pour le projet lauréat
        Quand la dreal passe en instruction la demande de délai pour le projet lauréat
        Alors la demande de délai du projet lauréat devrait être en instruction
        Et un email a été envoyé à la dreal avec :
            | sujet      | Potentiel - La demande de délai pour le projet Du boulodrome de Marseille situé dans le département(.*) est passée en instruction |
            | nom_projet | Du boulodrome de Marseille                                                                                                        |
            | url        | https://potentiel.beta.gouv.fr/laureats/.*/delai                                                                                  |
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - La demande de délai pour le projet Du boulodrome de Marseille situé dans le département(.*) est passée en instruction |
            | nom_projet | Du boulodrome de Marseille                                                                                                        |
            | url        | https://potentiel.beta.gouv.fr/laureats/.*/delai                                                                                  |

    Scénario: Une nouvelle dreal reprend l'instruction de la demande de délai du projet lauréat
        Etant donné une demande de délai en instruction pour le projet lauréat
        Quand une nouvelle dreal passe en instruction la demande de délai pour le projet lauréat
        Alors la demande de délai du projet lauréat devrait être en instruction

    Scénario: Impossible de passer en instruction une demande de délai inexistante pour un projet lauréat
        Quand la dreal passe en instruction la demande de délai pour le projet lauréat
        Alors l'utilisateur devrait être informé que "Aucune demande de délai n'est en cours"

    Scénario: Impossible de passer en instruction une demande de délai si celle-ci est déjà instruite par le même utilisateur dreal
        Etant donné une demande de délai en instruction pour le projet lauréat
        Quand la même dreal passe en instruction la demande de délai pour le projet lauréat
        Alors l'utilisateur devrait être informé que "La demande de délai est déjà en instruction avec le même utilisateur dreal"

    Scénario: Impossible de passer la demande de délai d'un projet lauréat en instruction si la demande a été annulée
        Etant donné une demande de délai annulée pour le projet lauréat
        Quand la dreal passe en instruction la demande de délai pour le projet lauréat
        Alors l'utilisateur devrait être informé que "Aucune demande de délai n'est en cours"

    Scénario: Impossible de passer la demande de délai d'un projet lauréat en instruction si la demande a déjà été rejetée
        Etant donné une demande de délai rejetée pour le projet lauréat
        Quand la dreal passe en instruction la demande de délai pour le projet lauréat
        Alors l'utilisateur devrait être informé que "Aucune demande de délai n'est en cours"


# TODO quand les usecase seront disponible
# Scénario: Impossible de passer la demande de délai d'un projet lauréat en instruction si la demande a déjà été accordée
#     Etant donné une demande de délai accordée pour le projet lauréat
#     Quand la dreal passe en instruction la demande de délai pour le projet lauréat
#     Alors l'utilisateur devrait être informé que "La demande de délai a déjà été accordé"