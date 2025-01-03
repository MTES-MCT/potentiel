# language: fr
Fonctionnalité: Transmettre l'actionnaire d'un projet lauréat

    Scénario: Transmettre l'actionnaire d'un projet lauréat
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | société mère |  |
        Quand le porteur transmet l'actionnaire pour le projet lauréat
        Alors l'actionnaire du projet lauréat devrait être mis à jour

    Scénario: Impossible de transmettre l'actionnaire si l'actionnaire existe déjà
        Etant donné le projet lauréat "Du boulodrome de Lyon"
        Quand le porteur transmet l'actionnaire pour le projet lauréat
        Alors l'utilisateur devrait être informé que "L'actionnaire a déjà été transmis"
