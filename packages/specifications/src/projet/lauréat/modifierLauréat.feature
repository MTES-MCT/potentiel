# language: fr
Fonctionnalité: Modifier le nom d'un projet lauréat

    @select
    Scénario: Modifier le nom d'un projet lauréat
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Quand un administrateur modifie le projet lauréat
        Alors le projet lauréat devrait être consultable
