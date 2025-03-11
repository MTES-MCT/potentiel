# language: fr
Fonctionnalité: Retirer les accès d'un utilisateur à un projet

    Scénario: Retirer les accès d'un utilisateur à un projet
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et le porteur invité sur le projet lauréat
        Quand un administrateur retire l'accès de l'utilisateur au projet lauréat
        Alors le porteur ne doit plus avoir accès au projet lauréat

    @NotImplemented
    Scénario: Impossible de retirer les accès d'un utilisateur à un projet si celui-ci n'a pas accès au projet
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Quand un administrateur retire l'accès de l'utilisateur au projet lauréat
        Alors l'utilisateur devrait être informé que "L'utilisateur n'a pas accès au projet"
