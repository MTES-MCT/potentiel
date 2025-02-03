# language: fr
Fonctionnalité: Modifier le nom d'un projet lauréat

    @select
    Scénario: Modifier le nom d'un projet lauréat
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        # Et le porteur "Marcel Patoulatchi" ayant accés au projet lauréat "Du boulodrome de Marseille"
        # Et la dreal "Dreal du sud" associée à la région du projet
        Quand un administrateur modifie le nom du projet lauréat
        Alors le projet lauréat devrait être mis à jour
