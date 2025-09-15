# language: fr
@lauréat
Fonctionnalité: Modifier le nom d'un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et un cahier des charges permettant la modification du projet

    Scénario: Modifier un projet lauréat (nom et localité)
        Quand un administrateur modifie le projet lauréat
        Alors le projet lauréat devrait être consultable

    Scénario: Modifier un projet abandonné (nom et localité)
        Etant donné un abandon accordé pour le projet lauréat "Du boulodrome de Marseille"
        Quand un administrateur modifie le projet lauréat
        Alors le projet lauréat devrait être consultable

    Scénario: Impossible de modifier un lauréat sans modification
        Quand un administrateur modifie le projet lauréat sans modification
        Alors l'utilisateur devrait être informé que "Les informations du projet n'ont pas été modifiées"
