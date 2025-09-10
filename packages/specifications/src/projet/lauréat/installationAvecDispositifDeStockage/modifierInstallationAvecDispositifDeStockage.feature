# language: fr
@installation-avec-dispositif-de-stockage
Fonctionnalité: Modifier l'information relative au couplage de l'installation avec un dispositif de stockage

    Scénario: Modifier l'information relative au couplage de l'installation avec un dispositif de stockage d'un projet lauréat
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offre                            | PPE2 - Eolien |
            | installation avec dispositif de stockage | oui           |
        Quand un admin modifie l'information concernant l'installation avec dispositif de stockage du projet lauréat avec :
            | appel d'offre                            | PPE2 - Eolien |
            | installation avec dispositif de stockage | non           |
        Alors l'information concernant le couplage de l'installation avec un dispositif de stockage pour le  projet lauréat devrait être mise à jour

    Scénario: Impossible de modifier l'information relative au couplage de l'installation avec un dispositif de stockage avec une valeur identique à l'actuelle
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offre                            | PPE2 - Eolien |
            | installation avec dispositif de stockage | oui           |
        Quand un admin modifie l'information concernant l'installation avec dispositif de stockage du projet lauréat avec :
            | appel d'offre                            | PPE2 - Eolien |
            | installation avec dispositif de stockage | oui           |
        Alors l'utilisateur devrait être informé que "Pour enregistrer une modification vous devez renseigner une valeur différente de la valeur actuelle"
