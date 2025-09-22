# language: fr
@délai
Fonctionnalité: Passer en instruction la demande de délai d'un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offres | PPE2 - Eolien |
        Et la dreal "Dreal du sud" associée à la région du projet
        Et un cahier des charges permettant la modification du projet

    Scénario: Une dreal passe en instruction la demande de délai d'un projet lauréat
        Etant donné une demande de délai en cours pour le projet lauréat
        Quand la dreal passe en instruction la demande de délai pour le projet lauréat
        Alors la demande de délai du projet lauréat devrait être en instruction

    Scénario: Un nouvel utilisateur dreal reprend l'instruction de la demande de délai du projet lauréat
        Etant donné une demande de délai en instruction pour le projet lauréat
        Quand un nouvel utilisateur dreal passe en instruction la demande de délai pour le projet lauréat
        Alors la demande de délai du projet lauréat devrait être en instruction

    Scénario: Impossible de passer en instruction une demande de délai inexistante pour un projet lauréat
        Quand la dreal passe en instruction la demande de délai pour le projet lauréat
        Alors l'utilisateur devrait être informé que "Aucune demande de délai n'est en cours"

    Scénario: Impossible de passer en instruction une demande de délai si celle-ci est déjà instruite par le même utilisateur dreal
        Etant donné une demande de délai en instruction pour le projet lauréat
        Quand la même dreal passe en instruction la demande de délai pour le projet lauréat
        Alors l'utilisateur devrait être informé que "La demande de délai est déjà instruite par le même utilisateur dreal"

    Scénario: Impossible de passer la demande de délai d'un projet lauréat en instruction si la demande a été annulée
        Etant donné une demande de délai annulée pour le projet lauréat
        Quand la dreal passe en instruction la demande de délai pour le projet lauréat
        Alors l'utilisateur devrait être informé que "Aucune demande de délai n'est en cours"

    Scénario: Impossible de passer la demande de délai d'un projet lauréat en instruction si la demande a déjà été rejetée
        Etant donné une demande de délai rejetée pour le projet lauréat
        Quand la dreal passe en instruction la demande de délai pour le projet lauréat
        Alors l'utilisateur devrait être informé que "Aucune demande de délai n'est en cours"

    Scénario: Impossible de passer la demande de délai d'un projet lauréat en instruction si la demande a déjà été accordée
        Etant donné une demande de délai accordée pour le projet lauréat
        Quand la dreal passe en instruction la demande de délai pour le projet lauréat
        Alors l'utilisateur devrait être informé que "Aucune demande de délai n'est en cours"

    Scénario: Impossible de passer en instruction une demande de délai d'un projet lauréat dont l'autorité compétente est la DGEC pour un utilisateur DREAL
        Etant donné le projet lauréat legacy "Du boulodrome de Marseille" avec :
            | appel d'offres | Eolien |
        Et une demande de délai en cours pour le projet lauréat
        Quand la dreal passe en instruction la demande de délai pour le projet lauréat
        Alors l'utilisateur DREAL devrait être informé que "Vous n'avez pas le rôle requis pour instruire cette demande"
