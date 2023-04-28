#Language: fr-FR
Fonctionnalité: Modifier le gestionnaire de réseau d'un projet

    Scénario: Un porteur de projet modifie le gestionnaire de réseau d'un projet
        Etant donné un projet avec une demande complète de raccordement transmise auprès d'un gestionnaire de réseau
        Quand le porteur modifie le gestionnaire de réseau de son projet avec un gestionnaire ayant le code EIC 'unCodeEIC'
        Alors le gestionaire de réseau 'unCodeEIC' devrait être consultable dans le projet

    # Scénario: Impossible de modifier la date de qualification pour un dossier de raccordement non connu
    #     Quand un administrateur modifie la date de qualification pour un dossier de raccordement non connu
    #     Alors un administrateur devrait être informé que "Le dossier de raccordement n'est pas référencé" 