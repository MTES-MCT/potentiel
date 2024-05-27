#Language: fr-FR
Fonctionnalité: Attribuer un gestionnaire de réseau à un raccordement 
    Contexte:
        Etant donné le gestionnaire de réseau "EDF Corse"
        Et le projet lauréat "Du boulodrome de Marseille"

    Scénario: Un gestionnaire de réseau est attribué au raccordement d'un projet lauréat
        Quand le gestionnaire de réseau "EDF Corse" est attribué au raccordement du projet lauréat "Du boulodrome de Marseille"
        Alors le projet "Du boulodrome de Marseille" devrait avoir un raccordement attribué au gestionnaire de réseau "EDF Corse"

    @select
    Scénario: Impossible d'attribuer un gestionnaire de réseau au raccordement d'un projet lauréat si celui-ci a déjà un raccordement attribué à un gestionnaire
        Etant donné le gestionnaire de réseau "Enedis" 
        Et le gestionnaire de réseau "Enedis" attribué au raccordement du projet lauréat "Du boulodrome de Marseille"
        Quand le gestionnaire de réseau "EDF Corse" est attribué au raccordement du projet lauréat "Du boulodrome de Marseille"
        Alors on devrait être informé que "Un raccordement existe déjà pour ce projet"        
    
    @NotImplemented
    # Ce cas ne peut pas être implémenté à date car nous n'avons pas accès à l'aggréagat candidature (projet)
    Scénario: Impossible d'attribuer un gestionnaire de réseau au raccordement d'un projet éliminé
        Etant donné le projet éliminé "MIOS"
        Quand le gestionnaire de réseau "EDF Corse" est attribué au raccordement du projet éliminé "MIOS"
        Alors on devrait être informé que "Un gestionnaire de réseau ne peut pas être attribué au raccordement d'un projet éliminé"

    @NotImplemented
    # Ce cas ne peut pas être implémenté à date car nous n'avons pas accès à l'aggréagat candidature (projet)    
    Scénario: Impossible d'attribuer un gestionnaire de réseau au raccordement d'un projet abandonné
        Etant donné le projet abandonné "MIOS II"
        Quand le gestionnaire de réseau "EDF Corse" est attribué au raccordement du projet abandonné "MIOS II"
        Alors on devrait être informé que "Un gestionnaire de réseau ne peut pas être attribué au raccordement d'un projet abandonné"


