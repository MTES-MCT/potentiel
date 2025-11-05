# language: fr
@lauréat
Fonctionnalité: Modifier le nom d'un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et un cahier des charges permettant la modification du projet

    Scénario: Modifier le nom d'un projet lauréat
        Quand un administrateur modifie le nom du projet
        Alors le projet lauréat devrait être consultable

    Scénario: Modifier le nom d'un projet abandonné
        Etant donné un abandon accordé pour le projet lauréat "Du boulodrome de Marseille"
        Quand un administrateur modifie le nom du projet
        Alors le projet lauréat devrait être consultable

    Scénario: Impossible de modifier un lauréat sans modification
        Quand un administrateur modifie le nom du projet avec la même valeur
        Alors l'utilisateur devrait être informé que "Les informations du projet n'ont pas été modifiées"
