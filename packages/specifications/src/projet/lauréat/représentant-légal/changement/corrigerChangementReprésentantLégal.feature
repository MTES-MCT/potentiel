# language: fr
Fonctionnalité: Corriger la demande de changement de représentant légal d'un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et le porteur "Marcel Patoulatchi" ayant accés au projet lauréat "Du boulodrome de Marseille"
        Et la dreal "Dreal du sud-est" associée à la région du projet

    Scénario: Un porteur corrige sa demande de changement de représentant légal
        Etant donné une demande de changement de représentant légal en cours pour le projet lauréat
        Quand le porteur corrige la demande de changement de représentant légal pour le projet lauréat
        Alors la demande corrigée de changement de représentant légal du projet lauréat devrait être consultable

    Scénario: Impossible de corriger une demande de changement de représentant légal d'un projet lauréat si aucun changement n'a été demandé
        Quand le porteur corrige une demande inexistante de changement de représentant légal pour le projet lauréat
        Alors le porteur devrait être informé que "Aucun changement de représentant légal n'est en cours"

    Scénario: Impossible de corriger le changement de représentant légal d'un projet lauréat si le changement a déjà été accordé
        Etant donné une demande de changement de représentant légal accordée pour le projet lauréat
        Quand le porteur corrige la demande de changement de représentant légal pour le projet lauréat
        Alors le porteur devrait être informé que "Le changement de représentant légal a déjà été accordé"

    Scénario: Impossible de corriger le changement de représentant légal d'un projet lauréat si le changement a déjà été rejété
        Etant donné une demande de changement de représentant légal rejetée pour le projet lauréat
        Quand le porteur corrige la demande de changement de représentant légal pour le projet lauréat
        Alors le porteur devrait être informé que "Le changement de représentant légal a déjà été rejeté"
