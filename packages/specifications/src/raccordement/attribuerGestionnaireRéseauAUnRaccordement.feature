#Language: fr-FR
Fonctionnalité: Attribuer un gestionnaire de réseau à un raccordement 
    Contexte:
        Etant donné le gestionnaire de réseau "EDF Corse"
        Et le projet lauréat "Du boulodrome de Marseille"

    @NotImplemented
    Scénario: Un gestionnaire de réseau est attribué au raccordement d'un projet lauréat
        Quand le gestionnaire réseau "EDF Corse" est attribué au raccordement du projet lauréat "Du boulodrome de Marseille"
        Alors le raccordement pour le projet lauréat "Du boulodrome de Marseille" devrait être consultable
        Et le projet "Du boulodrome de Marseille" devrait avoir comme gestionnaire de réseau "EDF Corse"
    
    @NotImplemented
    Scénario: Impossible d'attribuer un gestionnaire de réseau au raccordement d'un projet éliminé
        Etant donné le projet éliminé "MIOS"
        Quand le gestionnaire réseau "EDF Corse" est attribué au raccordement du projet éliminé "MIOS"
        Alors on devrait être informé que "Un gestionnaire de réseau ne peut pas être attribué au raccordement d'un projet éliminé"

    @NotImplemented
    Scénario: Impossible d'attribuer un gestionnaire de réseau au raccordement d'un projet abandonné
        Etant donné le projet abandonné "MIOS II"
        Quand le gestionnaire réseau "EDF Corse" est attribué au raccordement du projet abandonné "MIOS II"
        Alors on devrait être informé que "Un gestionnaire de réseau ne peut pas être attribué au raccordement d'un projet abandonné"

    @NotImplemented
    Scénario: Impossible d'attribuer un gestionnaire de réseau au raccordement d'un projet lauréat si celui-ci a déjà un raccordement attribué à un gestionnaire
        Etant donné un gestionnaire réseau "Enedis" attribué au raccordement du projet lauréat "Du boulodrome de Marseille"
        Quand le gestionnaire réseau "EDF Corse" est attribué au raccordement du projet lauréat "Du boulodrome de Marseille"
        Alors on devrait être informé que "Un raccordement existe déjà pour ce projet"
