# language: fr
@accès
Fonctionnalité: Remplacer l'accès d'un porteur sur un projet

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | email contact | porteur@test.test |

    Plan du scénario: Remplacer l'accès d'un porteur
        Quand un administrateur remplace le porteur sur le projet lauréat avec :
            | nouveau | autre-porteur@test.test |
        Alors la liste des porteurs du projet lauréat est mise à jour
        Et le porteur "porteur@test.test" n'a pas accès au projet lauréat
        Et le porteur "autre-porteur@test.test" a accès au projet lauréat

    Scénario: Remplacer l'accès d'un porteur qui n'a pas accès au projet
        Etant donné l'accès retiré au projet lauréat
        Quand un administrateur remplace le porteur sur le projet lauréat avec :
            | nouveau | autre-porteur@test.test |
        Alors le porteur "porteur@test.test" n'a pas accès au projet lauréat
        Et le porteur "autre-porteur@test.test" n'a pas accès au projet lauréat

    Scénario: Remplacer l'accès par un porteur ayant déjà accès au projet
        Etant donné un porteur invité sur le projet lauréat avec :
            | email | autre-porteur@test.test |
        Quand un administrateur remplace le porteur sur le projet lauréat avec :
            | nouveau | autre-porteur@test.test |
        Alors le porteur "porteur@test.test" n'a pas accès au projet lauréat
        Et le porteur "autre-porteur@test.test" a accès au projet lauréat

    Scénario: Impossible de remplacer l'accès d'un porteur par lui même
        Quand un administrateur remplace le porteur sur le projet lauréat avec :
            | actuel  | porteur@test.test |
            | nouveau | porteur@test.test |
        Alors l'utilisateur devrait être informé que "L'utilisateur a déjà accès à ce projet"
