# language: fr
Fonctionnalité: Transmettre l'actionnaire d'un projet lauréat

    Scénario: Transmettre l'actionnaire d'un projet lauréat
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et le porteur "Marcel Patoulatchi" ayant accés au projet lauréat "Du boulodrome de Marseille"
        Quand le porteur transmet l'actionnaire pour le projet lauréat
        Alors l'actionnaire du projet lauréat devrait être mis à jour

    Scénario: Impossible de transmettre l'actionnaire si l'actionnaire existe déjà
        Quand le DGEC validateur transmet l'actionnaire pour le projet lauréat
        Alors l'utilisateur devrait être informé que "L'actionnaire a déjà été transmis"
