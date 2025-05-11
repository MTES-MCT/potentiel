# language: fr
Fonctionnalité: Modifier le nom d'un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"

    Scénario: Modifier un projet lauréat (nom et localité)
        Quand un administrateur modifie le projet lauréat
        Alors le projet lauréat devrait être consultable

    Scénario: Modifier un projet abandonné (nom et localité)
        Etant donné un abandon accordé pour le projet lauréat "Du boulodrome de Marseille"
        Quand un administrateur modifie le projet lauréat
        Alors le projet lauréat devrait être consultable
