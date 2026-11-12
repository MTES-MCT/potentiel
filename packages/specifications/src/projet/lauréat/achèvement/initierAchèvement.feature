# language: fr
@achèvement
@initier-achèvement
Fonctionnalité: Initier l'achèvement d'un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Bordeaux" avec :
            | date notification | 2024-01-01 |
        Et un cahier des charges permettant la modification du projet
        Et le Cocontractant "Cocontractant du sud-ouest" associé à la zone du projet

    Scénario: Un porteur initie l'achèvement de son projet
        Quand le porteur initie l'achèvement du projet lauréat
        Alors l'achèvement du projet lauréat devrait être en attente
        Et le projet lauréat devrait être listé dans les projets en attente d'achèvement
        Et le statut du projet lauréat devrait être "actif"

    Scénario: La transmission de la date d'achèvement par le Cocontractant met fin à l'attente
        Etant donné l'achèvement réel initié pour le projet lauréat
        Quand le Cocontractant transmet la date d'achèvement réel "2025-11-14" pour le projet lauréat
        Alors la date d'achèvement réel devrait être consultable pour le projet lauréat
        Et le statut du projet lauréat devrait être "achevé"
        Et le projet lauréat ne devrait pas être listé dans les projets en attente d'achèvement

    Scénario: Lister uniquement les projets dont l'achèvement a été initié après une date
        Etant donné l'achèvement réel initié pour le projet lauréat
        Alors le projet lauréat devrait être listé dans les projets en attente d'achèvement depuis une date antérieure à l'initiation
        Et le projet lauréat ne devrait pas être listé dans les projets en attente d'achèvement depuis une date postérieure à l'initiation

    Scénario: Impossible d'initier l'achèvement d'un projet dont l'achèvement est déjà initié
        Etant donné l'achèvement réel initié pour le projet lauréat
        Quand le porteur initie l'achèvement du projet lauréat
        Alors l'utilisateur devrait être informé que "L'achèvement du projet a déjà été initié"

    Scénario: Impossible d'initier l'achèvement d'un projet déjà achevé
        Etant donné une date d'achèvement réel transmise pour le projet lauréat
        Quand le porteur initie l'achèvement du projet lauréat
        Alors l'utilisateur devrait être informé que "Le projet est déjà achevé"

    Scénario: Impossible d'initier l'achèvement d'un projet abandonné
        Etant donné une demande d'abandon accordée pour le projet lauréat
        Quand le porteur initie l'achèvement du projet lauréat
        Alors l'utilisateur devrait être informé que "Impossible de faire un changement pour un projet abandonné"

    Scénario: Impossible d'initier l'achèvement d'un projet avec une demande d'abandon en cours
        Etant donné une demande d'abandon en cours pour le projet lauréat
        Quand le porteur initie l'achèvement du projet lauréat
        Alors l'utilisateur devrait être informé que "Impossible de faire un changement car une demande d'abandon est en cours pour le projet"
