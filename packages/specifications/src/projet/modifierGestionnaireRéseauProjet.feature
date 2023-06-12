#Language: fr-FR
Fonctionnalité: Modifier le gestionnaire de réseau d'un projet
    
    @working
    Scénario: Un porteur de projet modifie le gestionnaire de réseau d'un projet
        Etant donné un projet avec une demande complète de raccordement transmise auprès d'un gestionnaire de réseau
        Quand le porteur modifie le gestionnaire de réseau de son projet avec un gestionnaire ayant le code EIC 'unCodeEIC'
        Alors le gestionaire de réseau 'unCodeEIC' devrait être consultable dans le projet

    @working
     Scénario: Un porteur de projet modifie le gestionnaire de réseau d'un projet avec un gestionnaire non référencé
        Etant donné un projet avec une demande complète de raccordement transmise auprès d'un gestionnaire de réseau
         Quand le porteur modifie le gestionnaire de réseau du projet avec un gestionnaire non référencé
         Alors le porteur devrait être informé que "Le gestionnaire de réseau n'est pas référencé" 