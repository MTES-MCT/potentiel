# language: fr
Fonctionnalité: Modifier l'évaluation carbone du projet

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et un cahier des charges modificatif choisi

    Scénario: Modifier l'évaluation carbone du projet
        Quand un administrateur modifie l'évaluation carbone du projet
        Alors le fournisseur devrait être mis à jour

    Scénario: Impossible de modifier l'évaluation carbone avec une valeur identique
        Quand un administrateur modifie l'évaluation carbone du projet avec la même valeur
        Alors l'utilisateur devrait être informé que "L'évaluation carbone doit avoir une valeur différente"

    Scénario: Impossible de modifier l'évaluation carbone avec une valeur négative
        Quand un administrateur modifie l'évaluation carbone du projet avec :
            | évaluation carbone | -1 |
        Alors l'utilisateur devrait être informé que "L'évaluation carbone ne peut être négative"

    Scénario: Impossible de modifier l'évaluation carbone avec une valeur autre qu'un nombre
        Quand un administrateur modifie l'évaluation carbone du projet avec :
            | évaluation carbone | hello |
        Alors l'utilisateur devrait être informé que "L'évaluation carbone doit être un nombre"
