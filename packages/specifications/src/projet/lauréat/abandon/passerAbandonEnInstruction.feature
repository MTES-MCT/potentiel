# @select
# language: fr
Fonctionnalité: Passer un abandon d'un projet lauréat en instruction

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et un cahier des charges modificatif choisi

    Scénario: Un administrateur passe l'abandon d'un projet lauréat en instruction
        Etant donné une demande d'abandon en cours pour le projet lauréat
        Quand l'administrateur passe en instruction l'abandon pour le projet lauréat
        Alors la demande d'abandon du projet lauréat devrait être en instruction

    Scénario: Un administrateur reprend l'instruction de l'abandon du projet lauréat
        Etant donné une demande d'abandon en instruction pour le projet lauréat
        Quand un nouvel administrateur passe en instruction l'abandon pour le projet lauréat
        Alors la demande d'abandon du projet lauréat devrait être en instruction

    Scénario: Impossible de passer l'abandon d'un projet lauréat en instruction si l'abandon a déjà été accordé
        Etant donné un abandon accordé pour le projet lauréat
        Quand l'administrateur passe en instruction l'abandon pour le projet lauréat
        Alors le DGEC validateur devrait être informé que "L'abandon a déjà été accordé"

    Scénario: Impossible de passer l'abandon d'un projet lauréat en instruction si l'abandon a déjà été rejeté
        Etant donné un abandon rejeté pour le projet lauréat
        Quand l'administrateur passe en instruction l'abandon pour le projet lauréat
        Alors le DGEC validateur devrait être informé que "L'abandon a déjà été rejeté"

    Scénario: Impossible de passer l'abandon d'un projet lauréat en instruction si aucun abandon n'a été demandé
        Quand l'administrateur passe en instruction l'abandon pour le projet lauréat
        Alors le DGEC validateur devrait être informé que "Aucun abandon n'est en cours"

    Scénario: Impossible de reprendre l'abandon d'un projet lauréat en instruction si on instruit déjà l'abandon
        Etant donné une demande d'abandon en instruction pour le projet lauréat
        Quand le même administrateur passe en instruction l'abandon pour le projet lauréat
        Alors le DGEC validateur devrait être informé que "L'abandon est déjà en instruction avec le même administrateur"
